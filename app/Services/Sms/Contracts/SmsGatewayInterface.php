<?php

namespace App\Services\Sms\Contracts;

use App\Services\Sms\SmsSendResult;

interface SmsGatewayInterface
{
    /**
     * Send an SMS message to a normalized phone number.
     *
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, string $message, array $context = []): SmsSendResult;
}
