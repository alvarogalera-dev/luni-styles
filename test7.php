<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create("/api/barbers-availability", 'POST', [
    'date' => '2026-10-15',
    'time' => '16:00',
    'duration' => 30,
]);
try {
    $response = app()->handle($request);
    echo 'Response Status: ' . $response->getStatusCode() . PHP_EOL;
    echo $response->getContent();
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
