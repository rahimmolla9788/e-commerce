<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login', [
            'demoCredentials' => config('app.debug') ? [
                'phone' => '01700000000',
                'password' => 'Admin@1234',
            ] : null,
        ]);
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
                'phone' => 'Invalid admin phone number or password.',
            ]);
        }

        if (! $user->isAdmin()) {
            throw ValidationException::withMessages([
                'phone' => 'This account does not have administrator privileges.',
            ]);
        }

        Auth::login($user, (bool) ($validated['remember'] ?? false));
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'))
            ->with('success', 'Signed in to Admin Panel.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login')
            ->with('status', 'Signed out from Admin Panel.');
    }
}
