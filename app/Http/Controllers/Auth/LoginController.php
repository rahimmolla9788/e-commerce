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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', new ValidPhoneNumber],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $normalizedPhone = PhoneNumber::normalize($validated['phone']);

        /** @var User|null $user */
        $user = User::query()->where('phone', $normalizedPhone)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => 'The provided phone number or password is incorrect.',
            ]);
        }

        if (! $user->hasVerifiedPhone()) {
            $request->session()->put('otp_verify_phone', $user->phone);
            $this->otpService->send($user->phone, OtpPurpose::Register, $request->ip());

            return redirect()->route('otp.notice')
                ->with('status', 'Your phone number is not verified yet. Please verify using the OTP below.');
        }

        Auth::login($user, (bool) ($validated['remember'] ?? false));
        $request->session()->regenerate();

        return redirect()->intended(route('home'))
            ->with('success', "Welcome back, {$user->name}!");
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')
            ->with('status', 'You have been signed out.');
    }
}
