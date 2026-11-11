<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ForgotPasswordOtpTest extends TestCase
{
    use RefreshDatabase;

    public function test_unknown_phone_cannot_request_password_reset_otp(): void
    {
        $this->post('/forgot-password/send-otp', [
            'phone' => '01799887766',
        ])->assertSessionHasErrors('phone');
    }

    public function test_user_can_reset_password_using_on_page_otp(): void
    {
        config()->set('sms.show_otp_on_page', true);

        $user = User::factory()->create([
            'phone' => '+8801722334455',
            'password' => Hash::make('OldPass@123'),
        ]);

        $this->post('/forgot-password/send-otp', [
            'phone' => '01722334455',
        ])->assertRedirect('/forgot-password');

        $resetOtp = null;

        $this->get('/forgot-password')
            ->assertOk()
            ->assertInertia(function (Assert $page) use (&$resetOtp): void {
                $page->component('Auth/ForgotPassword')
                    ->where('resetPhone', '+8801722334455')
                    ->where('otpPreview.enabled', true)
                    ->where('otpPreview.code', function (?string $code) use (&$resetOtp): bool {
                        $resetOtp = $code;

                        return is_string($code) && preg_match('/^\d{6}$/', $code) === 1;
                    });
            });

        $this->assertNotNull($resetOtp);

        $this->post('/forgot-password/reset', [
            'code' => '999999',
            'password' => 'NewPass@123',
            'password_confirmation' => 'NewPass@123',
        ])->assertSessionHasErrors('code');

        $this->post('/forgot-password/reset', [
            'code' => $resetOtp,
            'password' => 'NewPass@123',
            'password_confirmation' => 'NewPass@123',
        ])->assertRedirect('/login');

        $user->refresh();
        $this->assertTrue(Hash::check('NewPass@123', $user->password));

        $this->post('/login', [
            'phone' => '01722334455',
            'password' => 'NewPass@123',
        ])->assertRedirect('/');

        $this->assertAuthenticatedAs($user);
    }
}
