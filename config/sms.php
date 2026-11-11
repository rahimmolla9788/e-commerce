<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default SMS Driver
    |--------------------------------------------------------------------------
    |
    | Supported: "sandbox", "http_webhook", "twilio"
    | Use "sandbox" during development or before connecting a paid SMS provider.
    |
    */
    'driver' => env('SMS_DRIVER', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | Display OTP on Page (Sandbox Helper)
    |--------------------------------------------------------------------------
    |
    | When enabled, the generated OTP code is passed to the OTP verification
    | and password reset pages so it can be verified without an external SMS
    | provider. Set to false in production once a live provider is connected.
    |
    */
    'show_otp_on_page' => (bool) env('SMS_SHOW_OTP_ON_PAGE', true),

    'otp_expiry_minutes' => (int) env('OTP_EXPIRY_MINUTES', 5),
    'otp_resend_cooldown_seconds' => (int) env('OTP_RESEND_COOLDOWN_SECONDS', 60),
    'otp_max_attempts' => (int) env('OTP_MAX_ATTEMPTS', 5),

    'drivers' => [
        'sandbox' => [
            'label' => 'Sandbox (On-Page & Log)',
        ],
        'http_webhook' => [
            'label' => 'Custom HTTP / BulkSMSBD / SSLWireless',
            'endpoint' => env('SMS_HTTP_ENDPOINT', ''),
            'api_key' => env('SMS_HTTP_API_KEY', ''),
            'sender_id' => env('SMS_SENDER_ID', 'NovaMart'),
        ],
        'twilio' => [
            'label' => 'Twilio Programmable SMS',
            'sid' => env('TWILIO_SID', ''),
            'token' => env('TWILIO_TOKEN', ''),
            'from' => env('TWILIO_FROM', ''),
        ],
    ],
];
