<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::where('role', 'superadmin')->first();
auth()->login($user);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::create(
        '/panel/citas/36',
        'PUT',
        [
            'nombre' => 'Kevin Díaz',
            'telefono' => '+34 613810465',
            'email' => 'kjdiaz2000@gmail.com',
            'fecha' => '2026-09-30',
            'hora' => '16:00',
            'servicio' => 'Corte Normal',
            'tipo_servicio' => 'barberia',
            'precio' => '10',
            'observaciones' => '',
            'empleado_id' => 2,
        ]
    )
);
echo 'Response Status: ' . $response->getStatusCode() . PHP_EOL;
$appt = App\Models\Appointment::find(36);
echo 'Employee ID: ' . ($appt ? $appt->employee_id : 'Not Found') . PHP_EOL;
