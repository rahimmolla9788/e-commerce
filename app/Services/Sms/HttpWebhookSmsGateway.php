<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class HttpWebhookSmsGateway implements SmsGatewayInterface
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, string $message, array $context = []): SmsSendResult
    {
        $endpoint = (string) config('sms.drivers.http_webhook.endpoint');
        $apiKey = (string) config('sms.drivers.http_webhook.api_key');
        $senderId = (string) config('sms.drivers.http_webhook.sender_id');

        if ($endpoint === '' || $apiKey === '') {
            return new SmsSendResult(
                success: false,
                driver: 'http_webhook',
                errorMessage: 'HTTP SMS endpoint or API key is not configured.',
            );
        }

        try {
            $response = Http::timeout(10)
                ->withToken($apiKey)
                ->post($endpoint, [
                    'to' => $phone,
                    'sender_id' => $senderId,
                    'message' => $message,
                    'api_key' => $apiKey,
                ]);

            if (! $response->successful()) {
                Log::error('[SMS HTTP] Gateway returned error response', [
                    'phone' => $phone,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return new SmsSendResult(
                    success: false,
                    driver: 'http_webhook',
                    errorMessage: 'SMS gateway HTTP error: '.$response->status(),
                );
            }

            return new SmsSendResult(
                success: true,
                driver: 'http_webhook',
                providerMessageId: $response->json('message_id') ?? $response->json('id'),
            );
        } catch (Throwable $exception) {
            Log::error('[SMS HTTP] Request failed', [
                'phone' => $phone,
                'error' => $exception->getMessage(),
            ]);

            return new SmsSendResult(
                success: false,
                driver: 'http_webhook',
                errorMessage: $exception->getMessage(),
            );
        }
    }
}
