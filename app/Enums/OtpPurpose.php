<?php

namespace App\Enums;

enum OtpPurpose: string
{
    case Register = 'register';
    case ResetPassword = 'reset_password';
    case VerifyPhone = 'verify_phone';

    public function label(): string
    {
        return match ($this) {
            self::Register => 'Registration Verification',
            self::ResetPassword => 'Password Reset',
            self::VerifyPhone => 'Phone Verification',
        };
    }
}
