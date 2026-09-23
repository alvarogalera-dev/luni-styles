<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'required|string|max:20',
            'fecha' => 'required|date',
            'hora' => 'required|string',
            'servicio' => 'required|string',
            'tipo_servicio' => 'required|string', // barberia or peluqueria_infantil
            'precio' => 'required|string',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        try {
            $client = Client::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['nombre'],
                    'surname' => $validated['apellidos'],
                    'phone' => $validated['telefono'],
                ]
            );

            // Update details and increment total
            $client->update([
                'name' => $validated['nombre'],
                'surname' => $validated['apellidos'],
                'phone' => $validated['telefono'],
                'total_appointments' => $client->total_appointments + 1,
            ]);

            $datetime = Carbon::parse($validated['fecha'] . ' ' . $validated['hora']);

            $appointment = Appointment::create([
                'client_id' => $client->id,
                'appointment_date' => $datetime,
                'service_type' => $validated['tipo_servicio'],
                'price' => $validated['precio'],
                'observations' => $validated['observaciones'],
                'status' => 'pending',
            ]);

            return response()->json(['success' => true, 'appointment_id' => $appointment->id]);
        } catch (\Exception $e) {
            Log::error('Error creating appointment: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error interno al procesar la reserva. Inténtalo de nuevo.'], 500);
        }
    }

    public function checkLoyalty(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $client = Client::where('email', $request->email)->first();

        if ($client) {
            return response()->json([
                'exists' => true,
                'loyalty_points' => $client->loyalty_points,
                'penalty_flag' => $client->penalty_flag,
            ]);
        }

        return response()->json([
            'exists' => false,
            'loyalty_points' => 0,
            'penalty_flag' => false,
        ]);
    }
}
