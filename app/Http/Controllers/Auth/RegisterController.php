<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpPurpose;
use App\Enums\UserRole;
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

class RegisterController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'phone' => ['required', 'string', new ValidPhoneNumber],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $normalizedPhone = PhoneNumber::normalize($validated['phone']);

        /** @var User|null $existingUser */
        $existingUser = User::query()->where('phone', $normalizedPhone)->first();

        if ($existingUser && $existingUser->hasVerifiedPhone()) {
            throw ValidationException::withMessages([
                'phone' => 'This phone number is already registered. Please sign in instead.',
            ]);
        }

        if ($existingUser) {
            $existingUser->forceFill([
                'name' => $validated['name'],
                'password' => $validated['password'],
            ])->save();
        } else {
            User::query()->create([
                'name' => $validated['name'],
                'phone' => $normalizedPhone,
                'password' => $validated['password'],
                'role' => UserRole::Customer,
            ]);
        }

        $dispatch = $this->otpService->send(
            $normalizedPhone,
            OtpPurpose::Register,
            $request->ip(),
        );

        if (! $dispatch['sent']) {
            throw ValidationException::withMessages([
                'phone' => $dispatch['message'],
            ]);
        }

        $request->session()->put('otp_verify_phone', $normalizedPhone);

        return redirect()->route('otp.notice')
            ->with('status', 'Account created! Enter the 6-digit OTP to verify your phone number.');
    }
}
