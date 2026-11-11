<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsGatewayInterface;

class SmsManager
{
    public function __construct(
        private readonly SandboxSmsGateway $sandboxGateway,
        private readonly HttpWebhookSmsGateway $httpWebhookGateway,
        private readonly TwilioSmsGateway $twilioGateway,
    ) {}

    public function driver(?string $name = null): SmsGatewayInterface
    {
        $driverName = $name ?? (string) config('sms.driver', 'sandbox');

        return match ($driverName) {
            'http_webhook' => $this->httpWebhookGateway,
            'twilio' => $this->twilioGateway,
            default => $this->sandboxGateway,
        };
    }

    /**
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, string $message, array $context = []): SmsSendResult
    {
        return $this->driver()->send($phone, $message, $context);
    }
}
