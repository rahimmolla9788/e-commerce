<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsGatewayInterface;
use Illuminate\Support\Facades\Log;

class SandboxSmsGateway implements SmsGatewayInterface
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, string $message, array $context = []): SmsSendResult
    {
        Log::info('[SMS Sandbox] Outgoing OTP message', [
            'phone' => $phone,
            'purpose' => $context['purpose'] ?? null,
            'message' => $message,
        ]);

        return new SmsSendResult(
            success: true,
            driver: 'sandbox',
            providerMessageId: 'sandbox-'.uniqid(),
        );
    }
}
