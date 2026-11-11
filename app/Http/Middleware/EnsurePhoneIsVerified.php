<?php

namespace App\Http\Middleware;

use App\Enums\OtpPurpose;
use App\Services\Otp\OtpService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePhoneIsVerified
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest(route('login'));
        }

        if (! $user->hasVerifiedPhone()) {
            $request->session()->put('otp_verify_phone', $user->phone);
            $pageState = $this->otpService->getPageState($user->phone, OtpPurpose::Register);

            if (! $pageState['expires_at']) {
                $this->otpService->send($user->phone, OtpPurpose::Register, $request->ip());
            }

            return redirect()->route('otp.notice')
                ->with('status', 'Please verify your phone number with OTP to continue.');
        }

        return $next($request);
    }
}
