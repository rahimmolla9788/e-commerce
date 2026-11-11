<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Otp\OtpService;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $phone = $this->resolveTargetPhone($request);

        if (! $phone) {
            return redirect()->route('register')
                ->with('error', 'Please register or sign in first to verify your phone number.');
        }

        $user = User::query()->where('phone', $phone)->first();
        if (! $user) {
            $request->session()->forget('otp_verify_phone');

            return redirect()->route('register');
        }

        if ($user->hasVerifiedPhone()) {
            $request->session()->forget('otp_verify_phone');

            return redirect()->route('home');
        }

        $pageState = $this->otpService->getPageState($phone, OtpPurpose::Register);

        return Inertia::render('Auth/VerifyOtp', [
            'phone' => $phone,
            'maskedPhone' => PhoneNumber::mask($phone),
            'otpPreview' => $pageState,
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $phone = $this->resolveTargetPhone($request);

        if (! $phone) {
            return redirect()->route('register')
                ->with('error', 'Verification session expired. Please register again.');
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'regex:/^\d{6}$/'],
        ], [
            'code.regex' => 'Please enter the 6-digit numeric OTP code.',
        ]);

        $result = $this->otpService->verify($phone, OtpPurpose::Register, $validated['code']);

        if (! $result['verified']) {
            return back()->withErrors([
                'code' => $result['message'],
            ]);
        }

        /** @var User $user */
        $user = User::query()->where('phone', $phone)->firstOrFail();

        if (! $user->hasVerifiedPhone()) {
            $user->forceFill([
                'phone_verified_at' => now(),
            ])->save();
        }

        Auth::login($user, true);
        $request->session()->regenerate();
        $request->session()->forget('otp_verify_phone');

        return redirect()->intended(route('home'))
            ->with('success', 'Phone number verified! Welcome to NovaMart.');
    }

    public function resend(Request $request): RedirectResponse
    {
        $phone = $this->resolveTargetPhone($request);

        if (! $phone) {
            return redirect()->route('register');
        }

        $result = $this->otpService->send(
            $phone,
            OtpPurpose::Register,
            $request->ip(),
            enforceCooldown: true,
        );

        if (! $result['sent']) {
            return back()->withErrors([
                'code' => $result['message'],
            ]);
        }

        return back()->with('status', 'A new 6-digit OTP has been generated for your phone.');
    }

    private function resolveTargetPhone(Request $request): ?string
    {
        $phone = $request->user()?->phone ?? $request->session()->get('otp_verify_phone');

        return is_string($phone) && $phone !== '' ? PhoneNumber::normalize($phone) : null;
    }
}
