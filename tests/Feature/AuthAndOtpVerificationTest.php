<?php

namespace Tests\Feature;

use App\Enums\OtpPurpose;
use App\Models\OtpCode;
use App\Models\User;
use App\Services\Otp\OtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthAndOtpVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_phone_and_verify_with_on_page_sandbox_otp(): void
    {
        config()->set('sms.show_otp_on_page', true);

        $registerResponse = $this->post('/register', [
            'name' => 'Karim Hossain',
            'phone' => '01712345678',
            'password' => 'Secret@123',
            'password_confirmation' => 'Secret@123',
        ]);

        $registerResponse->assertRedirect('/verify-otp');

        $this->assertDatabaseHas('users', [
            'name' => 'Karim Hossain',
            'phone' => '+8801712345678',
            'phone_verified_at' => null,
        ]);

        $otpCodeFromPage = null;

        $this->get('/verify-otp')
            ->assertOk()
            ->assertInertia(function (Assert $page) use (&$otpCodeFromPage): void {
                $page->component('Auth/VerifyOtp')
                    ->where('phone', '+8801712345678')
                    ->where('otpPreview.enabled', true)
                    ->where('otpPreview.code', function (?string $code) use (&$otpCodeFromPage): bool {
                        $otpCodeFromPage = $code;

                        return is_string($code) && preg_match('/^\d{6}$/', $code) === 1;
                    });
            });

        $this->assertNotNull($otpCodeFromPage);

        // Wrong OTP should fail and increment attempt count
        $this->post('/verify-otp', ['code' => '000000'])
            ->assertSessionHasErrors('code');

        $this->assertGuest();

        // Correct OTP verifies phone and authenticates the user
        $this->post('/verify-otp', ['code' => $otpCodeFromPage])
            ->assertRedirect('/');

        $this->assertAuthenticated();
        $this->assertNotNull(User::query()->where('phone', '+8801712345678')->first()?->phone_verified_at);
    }

    public function test_sandbox_otp_is_hidden_when_show_otp_on_page_is_disabled(): void
    {
        config()->set('sms.show_otp_on_page', false);

        $this->post('/register', [
            'name' => 'Prod Mode User',
            'phone' => '01812345678',
            'password' => 'Secret@123',
            'password_confirmation' => 'Secret@123',
        ])->assertRedirect('/verify-otp');

        $this->get('/verify-otp')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Auth/VerifyOtp')
                ->where('otpPreview.enabled', false)
                ->where('otpPreview.code', null));
    }

    public function test_verified_user_can_login_with_local_or_e164_phone_number(): void
    {
        $user = User::factory()->create([
            'phone' => '+8801911223344',
            'password' => Hash::make('MyPass@123'),
        ]);

        $this->post('/login', [
            'phone' => '01911223344',
            'password' => 'MyPass@123',
        ])->assertRedirect('/');

        $this->assertAuthenticatedAs($user);
    }

    public function test_unverified_user_login_redirects_to_otp_verification(): void
    {
        User::factory()->unverifiedPhone()->create([
            'phone' => '+8801611223344',
            'password' => Hash::make('MyPass@123'),
        ]);

        $this->post('/login', [
            'phone' => '01611223344',
            'password' => 'MyPass@123',
        ])->assertRedirect('/verify-otp');

        $this->assertGuest();
        $this->assertDatabaseHas('otp_codes', [
            'phone' => '+8801611223344',
            'purpose' => OtpPurpose::Register->value,
        ]);
    }

    public function test_resend_otp_respects_cooldown_and_issues_new_code_when_elapsed(): void
    {
        config()->set('sms.otp_resend_cooldown_seconds', 60);

        $user = User::factory()->unverifiedPhone()->create([
            'phone' => '+8801755667788',
        ]);

        app(OtpService::class)->send($user->phone, OtpPurpose::Register);

        $this->withSession(['otp_verify_phone' => $user->phone])
            ->post('/verify-otp/resend')
            ->assertSessionHasErrors('code');

        OtpCode::query()->where('phone', $user->phone)->update([
            'created_at' => now()->subSeconds(65),
        ]);

        $this->withSession(['otp_verify_phone' => $user->phone])
            ->post('/verify-otp/resend')
            ->assertSessionHasNoErrors()
            ->assertSessionHas('status');
    }

    public function test_already_verified_phone_cannot_register_again(): void
    {
        User::factory()->create([
            'phone' => '+8801711002233',
        ]);

        $this->post('/register', [
            'name' => 'Duplicate',
            'phone' => '01711002233',
            'password' => 'Secret@123',
            'password_confirmation' => 'Secret@123',
        ])->assertSessionHasErrors('phone');
    }
}
