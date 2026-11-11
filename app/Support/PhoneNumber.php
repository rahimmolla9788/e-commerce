<?php

namespace App\Support;

class PhoneNumber
{
    /**
     * Normalize local Bangladeshi and international phone numbers to E.164 format.
     */
    public static function normalize(string $phone): string
    {
        $cleaned = preg_replace('/[\s\-\(\)\.]+/', '', trim($phone)) ?? '';

        if ($cleaned === '') {
            return '';
        }

        if (str_starts_with($cleaned, '00')) {
            $cleaned = '+'.substr($cleaned, 2);
        }

        // Convert standard 11-digit Bangladeshi mobile numbers (013..019) to +8801...
        if (preg_match('/^01[3-9]\d{8}$/', $cleaned) === 1) {
            return '+88'.$cleaned;
        }

        if (preg_match('/^8801[3-9]\d{8}$/', $cleaned) === 1) {
            return '+'.$cleaned;
        }

        if (! str_starts_with($cleaned, '+') && preg_match('/^[1-9]\d{7,14}$/', $cleaned) === 1) {
            return '+'.$cleaned;
        }

        return $cleaned;
    }

    /**
     * Determine whether the input normalizes into a valid E.164 phone number.
     */
    public static function isValid(string $phone): bool
    {
        $normalized = self::normalize($phone);

        if (str_starts_with($normalized, '+880')) {
            return preg_match('/^\+8801[3-9]\d{8}$/', $normalized) === 1;
        }

        return preg_match('/^\+[1-9]\d{7,14}$/', $normalized) === 1;
    }

    /**
     * Mask the middle digits of a phone number for safe display.
     */
    public static function mask(string $phone): string
    {
        $normalized = self::normalize($phone);
        $length = strlen($normalized);

        if ($length <= 6) {
            return $normalized;
        }

        return substr($normalized, 0, 4).str_repeat('*', max(2, $length - 7)).substr($normalized, -3);
    }
}
