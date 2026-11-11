<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OtpCode;
use App\Support\PhoneNumber;
use Inertia\Inertia;
use Inertia\Response;

class SmsSettingsController extends Controller
{
    public function index(): Response
    {
        $recentOtps = OtpCode::query()
            ->latest('id')
            ->limit(20)
            ->get()
            ->map(static fn (OtpCode $otp): array => [
                'id' => $otp->id,
                'phone' => PhoneNumber::mask($otp->phone),
                'purpose' => $otp->purpose->label(),
                'driver' => $otp->driver,
                'attempts' => $otp->attempts,
                'max_attempts' => $otp->max_attempts,
                'verified' => $otp->isVerified(),
                'expired' => $otp->isExpired(),
                'expires_at' => $otp->expires_at->toIso8601String(),
                'created_at' => $otp->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/SmsSettings', [
            'smsSettings' => [
                'active_driver' => config('sms.driver'),
                'show_otp_on_page' => (bool) config('sms.show_otp_on_page'),
                'otp_expiry_minutes' => (int) config('sms.otp_expiry_minutes'),
                'otp_resend_cooldown_seconds' => (int) config('sms.otp_resend_cooldown_seconds'),
                'otp_max_attempts' => (int) config('sms.otp_max_attempts'),
                'drivers' => [
                    [
                        'key' => 'sandbox',
                        'label' => config('sms.drivers.sandbox.label'),
                        'configured' => true,
                    ],
                    [
                        'key' => 'http_webhook',
                        'label' => config('sms.drivers.http_webhook.label'),
                        'configured' => ! empty(config('sms.drivers.http_webhook.endpoint'))
                            && ! empty(config('sms.drivers.http_webhook.api_key')),
                    ],
                    [
                        'key' => 'twilio',
                        'label' => config('sms.drivers.twilio.label'),
                        'configured' => ! empty(config('sms.drivers.twilio.sid'))
                            && ! empty(config('sms.drivers.twilio.token'))
                            && ! empty(config('sms.drivers.twilio.from')),
                    ],
                ],
            ],
            'recentOtps' => $recentOtps,
        ]);
    }
}
