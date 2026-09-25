<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PanelUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@lunistyles.com',
                'password' => Hash::make('Admin2026!'),
                'role' => 'superadmin',
            ],
            [
                'name' => 'Luis',
                'email' => 'luis@lunistyles.com',
                'password' => Hash::make('Luis2026!'),
                'role' => 'barber',
            ],
            [
                'name' => 'Carlos',
                'email' => 'carlos@lunistyles.com',
                'password' => Hash::make('Carlos2026!'),
                'role' => 'barber',
            ],
            [
                'name' => 'Mariely',
                'email' => 'mariely@lunistyles.com',
                'password' => Hash::make('Mariely2026!'),
                'role' => 'hairdresser',
            ]
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
