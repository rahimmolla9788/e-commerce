<?php

namespace App\Http\Middleware;

use App\Services\Cart\CartService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        private readonly CartService $cartService,
    ) {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'appName' => config('app.name', 'NovaMart'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'is_admin' => $user->isAdmin(),
                    'phone_verified' => $user->hasVerifiedPhone(),
                    'phone_verified_at' => $user->phone_verified_at?->toIso8601String(),
                    'address' => $user->address,
                    'city' => $user->city,
                ] : null,
            ],
            'cartCount' => fn (): int => $this->cartService->totalQuantity(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'smsConfig' => [
                'driver' => config('sms.driver'),
                'showOtpOnPage' => (bool) config('sms.show_otp_on_page'),
            ],
        ];
    }
}
