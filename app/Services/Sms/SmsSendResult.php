<?php

namespace App\Services\Sms;

readonly class SmsSendResult
{
    public function __construct(
        public bool $success,
        public string $driver,
        public ?string $providerMessageId = null,
        public ?string $errorMessage = null,
    ) {}
}
