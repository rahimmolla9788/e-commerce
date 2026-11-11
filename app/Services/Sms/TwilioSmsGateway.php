<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class TwilioSmsGateway implements SmsGatewayInterface
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, string $message, array $context = []): SmsSendResult
    {
        $sid = (string) config('sms.drivers.twilio.sid');
        $token = (string) config('sms.drivers.twilio.token');
        $from = (string) config('sms.drivers.twilio.from');

        if ($sid === '' || $token === '' || $from === '') {
            return new SmsSendResult(
                success: false,
                driver: 'twilio',
                errorMessage: 'Twilio credentials are not configured.',
            );
        }

        try {
            $response = Http::timeout(10)
                ->withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'From' => $from,
                    'To' => $phone,
                    'Body' => $message,
                ]);

            if (! $response->successful()) {
                Log::error('[SMS Twilio] Failed to deliver SMS', [
                    'phone' => $phone,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return new SmsSendResult(
                    success: false,
                    driver: 'twilio',
                    errorMessage: 'Twilio API error: '.$response->status(),
                );
            }

            return new SmsSendResult(
                success: true,
                driver: 'twilio',
                providerMessageId: $response->json('sid'),
            );
        } catch (Throwable $exception) {
            Log::error('[SMS Twilio] Request exception', [
                'phone' => $phone,
                'error' => $exception->getMessage(),
            ]);

            return new SmsSendResult(
                success: false,
                driver: 'twilio',
                errorMessage: $exception->getMessage(),
            );
        }
    }
}
