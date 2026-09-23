<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
            // 1. Identity Resolution (Match Histórico Cruzado + Lógica Difusa)
            $inputEmail = strtolower(trim($validated['email']));
            $inputPhone = trim($validated['telefono']);
            $cleanPhone = str_replace(' ', '', $inputPhone);
            $inputName = strtolower(trim($validated['nombre'] . ' ' . $validated['apellidos']));

            // Buscar por email principal o en el historial de emails
            $client = Client::where('email', $inputEmail)
                ->orWhere('known_emails', 'LIKE', '%' . $inputEmail . '%')
                ->first();

            // Buscar por teléfono principal o en el historial de teléfonos (ignorando espacios)
            if (!$client) {
                $client = Client::where(DB::raw("REPLACE(phone, ' ', '')"), $cleanPhone)
                    ->orWhere(DB::raw("REPLACE(known_phones, ' ', '')"), 'LIKE', '%' . $cleanPhone . '%')
                    ->first();
            }

            if (!$client) {
                // Fuzzy match by name and surname
                $allClients = Client::all();
                $bestMatch = null;
                $highestSimilarity = 0;

                foreach ($allClients as $c) {
                    $dbName = strtolower(trim($c->name . ' ' . $c->surname));
                    similar_text($inputName, $dbName, $percent);
                    
                    // Si coinciden en más de 80%, o si uno contiene exactamente al otro (ej: "Carlos S" vs "Carlos Sanchez")
                    if ($percent > 80 && $percent > $highestSimilarity) {
                        $highestSimilarity = $percent;
                        $bestMatch = $c;
                    } elseif (str_contains($dbName, $inputName) || str_contains($inputName, $dbName)) {
                        // Coincidencia directa de substring
                        if (100 > $highestSimilarity) {
                            $highestSimilarity = 100;
                            $bestMatch = $c;
                        }
                    }
                }

                if ($bestMatch) {
                    $client = $bestMatch;
                }
            }

            if (!$client) {
                // Crear cliente nuevo
                $client = Client::create([
                    'email' => $inputEmail,
                    'known_emails' => $inputEmail,
                    'name' => trim($validated['nombre']),
                    'surname' => trim($validated['apellidos']),
                    'phone' => $inputPhone,
                    'known_phones' => $inputPhone,
                    'total_appointments' => 1,
                    'loyalty_points' => 0,
                    'penalty_flag' => false,
                ]);
            } else {
                // Actualizar cliente existente y su memoria histórica
                $knownEmails = $client->known_emails ? explode(',', $client->known_emails) : [$client->email];
                if (!in_array($inputEmail, $knownEmails)) {
                    $knownEmails[] = $inputEmail;
                }

                $knownPhones = $client->known_phones ? explode(',', $client->known_phones) : [$client->phone];
                if (!in_array($inputPhone, $knownPhones)) {
                    $knownPhones[] = $inputPhone;
                }

                $client->update([
                    // Mantenemos el email/teléfono principal con el último que ha usado, pero guardamos el historial
                    'email' => $inputEmail,
                    'known_emails' => implode(',', $knownEmails),
                    'name' => trim($validated['nombre']),
                    'surname' => trim($validated['apellidos']),
                    'phone' => $inputPhone,
                    'known_phones' => implode(',', $knownPhones),
                    'total_appointments' => $client->total_appointments + 1,
                ]);
            }

            $datetime = Carbon::parse($validated['fecha'] . ' ' . $validated['hora']);
            
            // Assign employee based on availability to avoid overlap
            $duration = $this->getServiceDuration($validated['servicio']);
            $employeeId = 1;
            
            if ($validated['tipo_servicio'] === 'barberia') {
                $employeeId = $this->assignBarber($validated['fecha'], $validated['hora'], $duration);
                if (!$employeeId) {
                    return response()->json(['success' => false, 'message' => 'Lo sentimos, esa hora acaba de ser reservada por otro cliente. Por favor, elige otra hora.'], 400);
                }
            } else {
                // Infantil (Mariely = employee 3)
                $employeeId = 3; 
                // Check if she is free
                if (!$this->isEmployeeFree(3, $validated['fecha'], $validated['hora'], $duration)) {
                    return response()->json(['success' => false, 'message' => 'Lo sentimos, esa hora acaba de ser reservada. Por favor, elige otra.'], 400);
                }
            }

            $appointment = Appointment::create([
                'client_id' => $client->id,
                'appointment_date' => $datetime,
                'service_type' => $validated['tipo_servicio'],
                'service_name' => $validated['servicio'],
                'employee_id' => $employeeId,
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

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'service_type' => 'required|string', // barberia or peluqueria_infantil
            'duration' => 'required|integer', // in minutes
        ]);

        $date = $request->date;
        $serviceType = $request->service_type;
        $duration = (int) $request->duration;

        $slots = [
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
        ];

        $availableSlots = [];

        foreach ($slots as $slot) {
            if ($serviceType === 'barberia') {
                if ($this->assignBarber($date, $slot, $duration) !== null) {
                    $availableSlots[] = $slot;
                }
            } else {
                if ($this->isEmployeeFree(3, $date, $slot, $duration)) {
                    $availableSlots[] = $slot;
                }
            }
        }

        return response()->json(['available_slots' => $availableSlots]);
    }

    private function getServiceDuration($serviceName)
    {
        // Simplification for the backend logic
        $durations = [
            'Corte Normal' => 30,
            'Corte + Barba' => 60,
            'Solo Barba' => 30, // Assuming 30 for safety on grid
            'Corte Infantil' => 45,
            'Peinados' => 45,
            'Accesorios' => 30,
        ];

        return $durations[$serviceName] ?? 30;
    }

    private function assignBarber($date, $time, $durationMinutes)
    {
        // Try Barber 1
        if ($this->isEmployeeFree(1, $date, $time, $durationMinutes)) return 1;
        // Try Barber 2
        if ($this->isEmployeeFree(2, $date, $time, $durationMinutes)) return 2;
        
        return null;
    }

    private function isEmployeeFree($employeeId, $date, $time, $durationMinutes)
    {
        $start = Carbon::parse($date . ' ' . $time);
        $end = $start->copy()->addMinutes($durationMinutes);

        // Check if there are any appointments for this employee that overlap with [start, end)
        $conflicts = Appointment::where('employee_id', $employeeId)
            ->whereDate('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->get();

        foreach ($conflicts as $appt) {
            $apptStart = Carbon::parse($appt->appointment_date);
            $apptDuration = $this->getServiceDuration($appt->service_name);
            $apptEnd = $apptStart->copy()->addMinutes($apptDuration);

            // Overlap condition: start < apptEnd AND end > apptStart
            if ($start->lt($apptEnd) && $end->gt($apptStart)) {
                return false; // conflict found
            }
        }

        return true;
    }
}
