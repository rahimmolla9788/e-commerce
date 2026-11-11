<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(800, 15000);
        $shippingFee = $subtotal >= 2000 ? 0 : 60;

        return [
            'order_number' => 'ORD-'.now()->format('Ymd').'-'.strtoupper(Str::random(5)),
            'user_id' => User::factory(),
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->numerify('+88017########'),
            'shipping_address' => fake()->streetAddress(),
            'shipping_city' => fake()->randomElement(['Dhaka', 'Chattogram', 'Sylhet']),
            'notes' => null,
            'payment_method' => fake()->randomElement(['cod', 'bkash', 'nagad']),
            'payment_status' => 'unpaid',
            'status' => OrderStatus::Pending,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $subtotal + $shippingFee,
        ];
    }
}
