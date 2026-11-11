<?php

namespace Tests\Unit;

use App\Support\PhoneNumber;
use PHPUnit\Framework\TestCase;

class PhoneNumberTest extends TestCase
{
    public function test_normalizes_bangladeshi_and_international_phone_numbers(): void
    {
        $this->assertSame('+8801712345678', PhoneNumber::normalize('01712345678'));
        $this->assertSame('+8801712345678', PhoneNumber::normalize('017-1234-5678'));
        $this->assertSame('+8801712345678', PhoneNumber::normalize('8801712345678'));
        $this->assertSame('+8801712345678', PhoneNumber::normalize('+880 1712 345678'));
        $this->assertSame('+14155552671', PhoneNumber::normalize('0014155552671'));
    }

    public function test_validates_phone_numbers(): void
    {
        $this->assertTrue(PhoneNumber::isValid('01712345678'));
        $this->assertTrue(PhoneNumber::isValid('+8801812345678'));
        $this->assertTrue(PhoneNumber::isValid('+14155552671'));
        $this->assertFalse(PhoneNumber::isValid('01234'));
        $this->assertFalse(PhoneNumber::isValid('not-a-phone'));
    }

    public function test_masks_phone_number(): void
    {
        $this->assertSame('+880*******678', PhoneNumber::mask('01712345678'));
    }
}
