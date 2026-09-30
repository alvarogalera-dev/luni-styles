<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$client = App\Models\Client::create(['name' => 'Kevin', 'phone' => '+34 613810465', 'email' => 'kjdiaz2000@gmail.com']);
$appt = App\Models\Appointment::create([
    'client_id' => $client->id,
    'appointment_date' => \Carbon\Carbon::now(),
    'service_type' => 'barberia',
    'service_name' => 'Corte Normal',
    'employee_id' => 1,
    'price' => '10',
    'status' => 'pending'
]);
echo "Created appointment " . $appt->id . PHP_EOL;
