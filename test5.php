<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('role', 'superadmin')->first();
auth()->login($user);

// Create a test appointment so we can edit it
$client = App\Models\Client::first();
if (!$client) {
    $client = App\Models\Client::create(['name' => 'Kevin', 'phone' => '+34 613810465', 'email' => 'kjdiaz2000@gmail.com']);
}
$appt = App\Models\Appointment::create([
    'client_id' => $client->id,
    'appointment_date' => \Carbon\Carbon::now(),
    'service_type' => 'barberia',
    'service_name' => 'Corte Normal',
    'employee_id' => 1,
    'price' => '10',
    'status' => 'pending'
]);

$request = Illuminate\Http\Request::create("/panel/citas/" . $appt->id, 'PUT', [
    'nombre' => 'Test',
    'telefono' => '+34 613810465',
    'email' => 'test@test.com',
    'fecha' => '2026-10-01',
    'hora' => '16:00',
    'servicio' => 'Corte Normal',
    'tipo_servicio' => 'barberia',
    'precio' => '12',
    'observaciones' => '',
    'empleado_id' => 2,
]);
try {
    $response = app()->handle($request);
    echo 'Response Status: ' . $response->getStatusCode() . PHP_EOL;

    if ($response->getStatusCode() == 302) {
        $session = $request->getSession();
        if ($session && $session->has('errors')) {
            print_r($session->get('errors')->getBag('default')->getMessages());
        }
    }
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
