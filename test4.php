<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('role', 'superadmin')->first();
auth()->login($user);

$request = Illuminate\Http\Request::create("/panel/citas/1", 'PUT', [
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
$response = app()->handle($request);
echo 'Response Status: ' . $response->getStatusCode() . PHP_EOL;

if ($response->getStatusCode() == 500) {
    echo $response->getContent();
} else if ($response->getStatusCode() == 302) {
    $session = $request->getSession();
    if ($session && $session->has('errors')) {
        print_r($session->get('errors')->getBag('default')->getMessages());
    }
}
