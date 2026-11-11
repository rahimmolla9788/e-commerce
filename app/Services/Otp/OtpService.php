<?php

namespace App\Services\Otp;

use App\Enums\OtpPurpose;
use App\Models\OtpCode;
use App\Services\Sms\SmsManager;
use App\Support\PhoneNumber;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class OtpService
{
    public function __construct(
        private readonly SmsManager $smsManager,
    ) {}

    /**
     * Generate, persist, and dispatch an OTP code for the given phone and purpose.
     *
     * @return array{sent: bool, cooldown_remaining: int, expires_at: string, message: string, sandbox_code: ?string}
     */
    public function send(string $rawPhone, OtpPurpose $purpose, ?string $ipAddress = null, bool $enforceCooldown = false): array
    {
        $phone = PhoneNumber::normalize($rawPhone);
        $cooldownRemaining = $this->resendCooldownRemaining($phone, $purpose);

        if ($enforceCooldown && $cooldownRemaining > 0) {
            return [
                'sent' => false,
                'cooldown_remaining' => $cooldownRemaining,
                'expires_at' => now()->addMinutes($this->expiryMinutes())->toIso8601String(),
                'message' => "Please wait {$cooldownRemaining} seconds before requesting a new OTP.",
                'sandbox_code' => $this->getSandboxCode($phone, $purpose),
            ];
        }

        // Invalidate previous unverified OTP codes for the same phone and purpose.
        OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->delete();

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes($this->expiryMinutes());
        $driver = (string) config('sms.driver', 'sandbox');

        OtpCode::query()->create([
            'phone' => $phone,
            'purpose' => $purpose,
            'code_hash' => Hash::make($code),
            'driver' => $driver,
            'attempts' => 0,
            'max_attempts' => (int) config('sms.otp_max_attempts', 5),
            'expires_at' => $expiresAt,
            'ip_address' => $ipAddress,
        ]);

        $appName = (string) config('app.name', 'NovaMart');
        $smsMessage = "Your {$appName} verification OTP is {$code}. It expires in {$this->expiryMinutes()} minutes.";

        $sendResult = $this->smsManager->send($phone, $smsMessage, [
            'purpose' => $purpose->value,
            'code' => $code,
        ]);

        if (! $sendResult->success) {
            return [
                'sent' => false,
                'cooldown_remaining' => 0,
                'expires_at' => $expiresAt->toIso8601String(),
                'message' => $sendResult->errorMessage ?? 'Unable to send OTP SMS right now.',
                'sandbox_code' => null,
            ];
        }

        $sandboxCode = null;
        if ($this->shouldShowOtpOnPage()) {
            Cache::put(
                $this->sandboxCacheKey($phone, $purpose),
                [
                    'code' => $code,
                    'expires_at' => $expiresAt->toIso8601String(),
                ],
                $expiresAt,
            );
            $sandboxCode = $code;
        }

        return [
            'sent' => true,
            'cooldown_remaining' => $this->cooldownSeconds(),
            'expires_at' => $expiresAt->toIso8601String(),
            'message' => 'A 6-digit OTP has been generated for your phone number.',
            'sandbox_code' => $sandboxCode,
        ];
    }

    /**
     * Verify a submitted 6-digit OTP code for the given phone and purpose.
     *
     * @return array{verified: bool, message: string}
     */
    public function verify(string $rawPhone, OtpPurpose $purpose, string $submittedCode): array
    {
        $phone = PhoneNumber::normalize($rawPhone);
        $cleanCode = preg_replace('/\D+/', '', trim($submittedCode)) ?? '';

        /** @var OtpCode|null $otp */
        $otp = OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest('id')
            ->first();

        if (! $otp) {
            return [
                'verified' => false,
                'message' => 'No active OTP found. Please request a new code.',
            ];
        }

        if ($otp->isExpired()) {
            Cache::forget($this->sandboxCacheKey($phone, $purpose));

            return [
                'verified' => false,
                'message' => 'This OTP has expired. Please request a new code.',
            ];
        }

        if ($otp->hasExhaustedAttempts()) {
            return [
                'verified' => false,
                'message' => 'Too many invalid attempts. Please request a new OTP.',
            ];
        }

        $otp->increment('attempts');
        $otp->refresh();

        if (! Hash::check($cleanCode, $otp->code_hash)) {
            $remaining = max(0, $otp->max_attempts - $otp->attempts);

            return [
                'verified' => false,
                'message' => $remaining > 0
                    ? "Invalid OTP code. {$remaining} attempt(s) remaining."
                    : 'Invalid OTP code. Maximum attempts reached; please request a new OTP.',
            ];
        }

        $otp->forceFill([
            'verified_at' => now(),
        ])->save();

        Cache::forget($this->sandboxCacheKey($phone, $purpose));

        return [
            'verified' => true,
            'message' => 'Phone number verified successfully.',
        ];
    }

    /**
     * Return sandbox preview metadata for displaying the OTP on the verification page.
     *
     * @return array{enabled: bool, code: ?string, expires_at: ?string, resend_available_in: int}
     */
    public function getPageState(string $rawPhone, OtpPurpose $purpose): array
    {
        $phone = PhoneNumber::normalize($rawPhone);

        /** @var OtpCode|null $latest */
        $latest = OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest('id')
            ->first();

        $cached = $this->shouldShowOtpOnPage()
            ? Cache::get($this->sandboxCacheKey($phone, $purpose))
            : null;

        return [
            'enabled' => $this->shouldShowOtpOnPage(),
            'code' => is_array($cached) ? ($cached['code'] ?? null) : null,
            'expires_at' => $latest?->expires_at?->toIso8601String(),
            'resend_available_in' => $this->resendCooldownRemaining($phone, $purpose),
        ];
    }

    public function resendCooldownRemaining(string $rawPhone, OtpPurpose $purpose): int
    {
        $phone = PhoneNumber::normalize($rawPhone);

        /** @var OtpCode|null $latest */
        $latest = OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest('id')
            ->first();

        if (! $latest || ! $latest->created_at) {
            return 0;
        }

        $unlockTimestamp = $latest->created_at->getTimestamp() + $this->cooldownSeconds();

        return max(0, $unlockTimestamp - now()->getTimestamp());
    }

    public function shouldShowOtpOnPage(): bool
    {
        return (bool) config('sms.show_otp_on_page', true);
    }

    private function getSandboxCode(string $phone, OtpPurpose $purpose): ?string
    {
        if (! $this->shouldShowOtpOnPage()) {
            return null;
        }

        $cached = Cache::get($this->sandboxCacheKey($phone, $purpose));

        return is_array($cached) ? ($cached['code'] ?? null) : null;
    }

    private function sandboxCacheKey(string $phone, OtpPurpose $purpose): string
    {
        return 'otp_sandbox_preview:'.$purpose->value.':'.sha1($phone);
    }

    private function expiryMinutes(): int
    {
        return max(1, (int) config('sms.otp_expiry_minutes', 5));
    }

    private function cooldownSeconds(): int
    {
        return max(0, (int) config('sms.otp_resend_cooldown_seconds', 60));
    }
}
