<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@lunistyles.com',
                'password' => Hash::make('Admin2026!'),
                'role' => 'superadmin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Luis',
                'email' => 'luis@lunistyles.com',
                'password' => Hash::make('Luis2026!'),
                'role' => 'barber',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Carlos',
                'email' => 'carlos@lunistyles.com',
                'password' => Hash::make('Carlos2026!'),
                'role' => 'barber',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mariely',
                'email' => 'mariely@lunistyles.com',
                'password' => Hash::make('Mariely2026!'),
                'role' => 'hairdresser',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($users as $userData) {
            $existing = DB::table('users')->where('email', $userData['email'])->first();
            if (!$existing) {
                DB::table('users')->insert($userData);
            } else {
                DB::table('users')->where('email', $userData['email'])->update([
                    'password' => $userData['password'],
                    'role' => $userData['role']
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->whereIn('email', [
            'admin@lunistyles.com',
            'luis@lunistyles.com',
            'carlos@lunistyles.com',
            'mariely@lunistyles.com',
        ])->delete();
    }
};
