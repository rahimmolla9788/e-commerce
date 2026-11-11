<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use App\Services\Otp\OtpService;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function create(Request $request): Response
    {
        $resetPhone = $request->session()->get('password_reset_phone');
        $normalized = is_string($resetPhone) && $resetPhone !== '' ? PhoneNumber::normalize($resetPhone) : null;

        return Inertia::render('Auth/ForgotPassword', [
            'resetPhone' => $normalized,
            'maskedPhone' => $normalized ? PhoneNumber::mask($normalized) : null,
            'otpPreview' => $normalized ? $this->otpService->getPageState($normalized, OtpPurpose::ResetPassword) : null,
        ]);
    }

    public function sendOtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', new ValidPhoneNumber],
        ]);

        $normalizedPhone = PhoneNumber::normalize($validated['phone']);
        $user = User::query()->where('phone', $normalizedPhone)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'phone' => 'No account is registered with this phone number.',
            ]);
        }

        $dispatch = $this->otpService->send(
            $normalizedPhone,
            OtpPurpose::ResetPassword,
            $request->ip(),
        );

        if (! $dispatch['sent']) {
            throw ValidationException::withMessages([
                'phone' => $dispatch['message'],
            ]);
        }

        $request->session()->put('password_reset_phone', $normalizedPhone);

        return redirect()->route('password.request')
            ->with('status', 'Password reset OTP generated. Verify it below to set a new password.');
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $resetPhone = $request->session()->get('password_reset_phone');

        if (! is_string($resetPhone) || $resetPhone === '') {
            return redirect()->route('password.request');
        }

        $dispatch = $this->otpService->send(
            $resetPhone,
            OtpPurpose::ResetPassword,
            $request->ip(),
            enforceCooldown: true,
        );

        if (! $dispatch['sent']) {
            return back()->withErrors([
                'code' => $dispatch['message'],
            ]);
        }

        return back()->with('status', 'A fresh password reset OTP has been generated.');
    }

    public function reset(Request $request): RedirectResponse
    {
        $sessionPhone = $request->session()->get('password_reset_phone');

        if (! is_string($sessionPhone) || $sessionPhone === '') {
            return redirect()->route('password.request')
                ->with('error', 'Please enter your phone number to request a reset OTP.');
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'regex:/^\d{6}$/'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'code.regex' => 'Please enter the 6-digit numeric OTP code.',
        ]);

        $verification = $this->otpService->verify(
            $sessionPhone,
            OtpPurpose::ResetPassword,
            $validated['code'],
        );

        if (! $verification['verified']) {
            return back()->withErrors([
                'code' => $verification['message'],
            ]);
        }

        /** @var User $user */
        $user = User::query()->where('phone', $sessionPhone)->firstOrFail();

        $user->forceFill([
            'password' => $validated['password'],
            'phone_verified_at' => $user->phone_verified_at ?? now(),
        ])->save();

        $request->session()->forget('password_reset_phone');

        return redirect()->route('login')
            ->with('success', 'Password reset successful! You can now sign in with your new password.');
    }

    public function changePhone(Request $request): RedirectResponse
    {
        $request->session()->forget('password_reset_phone');

        return redirect()->route('password.request');
    }
}
