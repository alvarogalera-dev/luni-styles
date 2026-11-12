<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Appointment;
use App\Models\BarberBlock;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    private function isPromoActive(): bool
    {
        $now = now();
        $start = new \DateTime('2026-09-28T00:00:00+02:00');
        $end   = new \DateTime('2026-10-12T00:01:00+02:00');
        return $now >= $start && $now < $end;
    }

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
            'barbero_id'    => 'nullable|integer|between:1,2', // barbero elegido en el modal
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
                    
                    // Fuzzy match ultra estricto: debe coincidir al menos al 90%
                    if ($percent > 90 && $percent > $highestSimilarity) {
                        $highestSimilarity = $percent;
                        $bestMatch = $c;
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
                // Si el usuario eligió barbero en el modal, verificar que esté libre
                if (!empty($validated['barbero_id'])) {
                    $preferredId = (int) $validated['barbero_id'];
                    if ($this->isEmployeeFree($preferredId, $validated['fecha'], $validated['hora'], $duration)) {
                        $employeeId = $preferredId;
                    } else {
                        return response()->json(['success' => false, 'message' => 'Lo sentimos, ese barbero ya tiene una cita en ese horario. Por favor, elige otro.'], 400);
                    }
                } else {
                    $employeeId = $this->assignBarber($validated['fecha'], $validated['hora'], $duration);
                    if (!$employeeId) {
                        return response()->json(['success' => false, 'message' => 'Lo sentimos, esa hora acaba de ser reservada por otro cliente. Por favor, elige otra hora.'], 400);
                    }
                }
            } else {
                // Infantil (Mariely = employee 3)
                $employeeId = 3; 
                // Check if she is free
                if (!$this->isEmployeeFree(3, $validated['fecha'], $validated['hora'], $duration)) {
                    return response()->json(['success' => false, 'message' => 'Lo sentimos, esa hora acaba de ser reservada. Por favor, elige otra.'], 400);
                }
            }

            // Calcular precio correcto (aplicar promo si está activa)
            $precio = $validated['precio'];
            if ($this->isPromoActive() && $validated['tipo_servicio'] === 'barberia') {
                $promoPrices = [
                    'Corte Normal'  => '10',
                    'Corte + Barba' => '13',
                    'Solo Barba'    => '4',
                ];
                if (isset($promoPrices[$validated['servicio']]) && $precio !== 'Gratis') {
                    $precio = $promoPrices[$validated['servicio']];
                }
            }

            $appointment = Appointment::create([
                'client_id'        => $client->id,
                'appointment_date' => $datetime,
                'service_type'     => $validated['tipo_servicio'],
                'service_name'     => $validated['servicio'],
                'employee_id'      => $employeeId,
                'price'            => $precio,
                'observations'     => $validated['observaciones'],
                'status'           => 'pending',
            ]);

            return response()->json(['success' => true, 'appointment_id' => $appointment->id]);
        } catch (\Exception $e) {
            Log::error('Error creating appointment: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error interno al procesar la reserva. Inténtalo de nuevo.'], 500);
        }
    }

    private function isClientPenalized($client, $serviceType)
    {
        if (!$client || !$serviceType) return false;
        
        $appointments = $client->appointments()
            ->whereIn('status', ['completed', 'no-show'])
            ->where(function($q) use ($serviceType) {
                if ($serviceType === 'peluqueria_infantil') {
                    $q->whereIn('service_type', ['peluqueria_infantil', 'infantil']);
                } else {
                    $q->where('service_type', $serviceType);
                }
            })
            ->orderBy('appointment_date', 'desc')
            ->get();

        $isPenalized = false;
        $consecutiveAttendances = 0;

        foreach ($appointments as $appt) {
            if ($appt->status === 'no-show') {
                $isPenalized = true;
                break;
            } else if ($appt->status === 'completed') {
                $consecutiveAttendances++;
                if ($consecutiveAttendances >= 2) {
                    break;
                }
            }
        }
        return $isPenalized;
    }

    public function checkLoyalty(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'service_type' => 'nullable|string'
        ]);
        
        $client = Client::where('email', $request->email)->first();

        if ($client) {
            $isPenalized = $this->isClientPenalized($client, $request->service_type);
            return response()->json([
                'exists' => true,
                'loyalty_points' => $client->loyalty_points,
                'penalty_flag' => $isPenalized,
            ]);
        }

        return response()->json([
            'exists' => false,
            'loyalty_points' => 0,
            'penalty_flag' => false,
        ]);
    }

    public function clientLoyaltyCheck(Request $request)
    {
        $inputEmail = strtolower(trim($request->email ?? ''));
        $inputPhone = trim($request->phone ?? '');
        $cleanPhone = str_replace(' ', '', $inputPhone);
        $inputName = strtolower(trim(($request->nombre ?? '') . ' ' . ($request->apellidos ?? '')));

        $client = null;

        // 1. Email match
        if (!empty($inputEmail)) {
            $client = Client::where('email', $inputEmail)
                ->orWhere('known_emails', 'LIKE', '%' . $inputEmail . '%')
                ->first();
        }

        // 2. Phone match
        if (!$client && !empty($cleanPhone)) {
            $client = Client::where(DB::raw("REPLACE(phone, ' ', '')"), $cleanPhone)
                ->orWhere(DB::raw("REPLACE(known_phones, ' ', '')"), 'LIKE', '%' . $cleanPhone . '%')
                ->first();
        }

        // 3. Name match
        if (!$client && trim($inputName) !== '') {
            $allClients = Client::all();
            $bestMatch = null;
            $highestSimilarity = 0;

            foreach ($allClients as $c) {
                $dbName = strtolower(trim($c->name . ' ' . $c->surname));
                similar_text($inputName, $dbName, $percent);
                
                if ($percent > 90 && $percent > $highestSimilarity) {
                    $highestSimilarity = $percent;
                    $bestMatch = $c;
                }
            }
            if ($bestMatch) {
                $client = $bestMatch;
            }
        }

        if ($client) {
            $isPenalized = $this->isClientPenalized($client, $request->service_type);
            return response()->json([
                'exists' => true,
                'loyalty_points' => $client->loyalty_points,
                'penalty_flag' => $isPenalized,
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

        $dayOfWeek = \Carbon\Carbon::parse($date)->dayOfWeek; // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab

        // Horario unificado:
        // Lun(1) y Mié(3): 16:00-19:00
        // Mar(2), Jue(4), Vie(5): 16:00-20:00
        // Sab(6): 10:00-12:00 y 16:00-20:00
        if ($dayOfWeek === 6) { // Sábado
            $slots = ['10:00','10:30','11:00','11:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'];
        } elseif ($dayOfWeek === 1 || $dayOfWeek === 3) { // Lunes y Miércoles
            $slots = ['16:00','16:30','17:00','17:30','18:00','18:30','19:00'];
        } elseif ($dayOfWeek === 2 || $dayOfWeek === 4 || $dayOfWeek === 5) { // Mar, Jue, Vie
            $slots = ['16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'];
        } else { // Domingo u otro día cerrado
            $slots = [];
        }

        $availableSlots = [];
        $now = \Carbon\Carbon::now('Europe/Madrid');
        $isToday = $date === $now->format('Y-m-d');

        foreach ($slots as $slot) {
            if ($isToday) {
                $slotTime = \Carbon\Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $slot, 'Europe/Madrid');
                if ($slotTime->lt($now)) {
                    continue;
                }
            }

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

    // Endpoint: disponibilidad de cada barbero en una hora y fecha específica
    public function getBarbersAvailability(Request $request)
    {
        $request->validate([
            'date'     => 'required|date',
            'time'     => 'required|string',
            'duration' => 'required|integer',
        ]);

        $date     = $request->date;
        $time     = $request->time;
        $duration = (int) $request->duration;
        $excludeId = $request->has('appointment_id') ? (int) $request->appointment_id : null;

        $barbers = [
            1 => 'Luis',
            2 => 'Carlos',
        ];

        $result = [];
        foreach ($barbers as $id => $name) {
            $result[] = [
                'id'        => $id,
                'name'      => $name,
                'available' => $this->isEmployeeFree($id, $date, $time, $duration, $excludeId),
            ];
        }

        return response()->json(['barbers' => $result]);
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

    private function isEmployeeFree($employeeId, $date, $time, $durationMinutes, $excludeAppointmentId = null)
    {
        $start = Carbon::parse($date . ' ' . $time);
        $end = $start->copy()->addMinutes($durationMinutes);

        // Check barber blocks first
        $blocks = BarberBlock::where('employee_id', $employeeId)
            ->where('block_date', $date)
            ->get();

        foreach ($blocks as $block) {
            $blockStart = Carbon::parse($date . ' ' . $block->block_start);
            $blockEnd   = Carbon::parse($date . ' ' . $block->block_end);
            if ($start->lt($blockEnd) && $end->gt($blockStart)) {
                return false; // blocked
            }
        }

        // Check if there are any appointments for this employee that overlap with [start, end)
        $query = Appointment::where('employee_id', $employeeId)
            ->whereDate('appointment_date', $date)
            ->where('status', '!=', 'cancelled');
            
        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }
        
        $conflicts = $query->get();

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

    // ─────────────────────────────────────────────────
    // BARBER BLOCKS
    // ─────────────────────────────────────────────────

    public function createBarberBlock(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!in_array($user->role, ['barber', 'superadmin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $validated = $request->validate([
            'employee_id' => 'required|integer|between:1,2',
            'block_date'  => 'required|date_format:Y-m-d',
            'block_start' => 'required|date_format:H:i',
            'block_end'   => 'required|date_format:H:i|after:block_start',
            'reason'      => 'nullable|string|max:255',
        ]);

        // Check for conflicting appointments
        $start = Carbon::parse($validated['block_date'] . ' ' . $validated['block_start']);
        $end   = Carbon::parse($validated['block_date'] . ' ' . $validated['block_end']);

        $conflictingAppts = Appointment::with('client')
            ->where('employee_id', $validated['employee_id'])
            ->whereDate('appointment_date', $validated['block_date'])
            ->whereIn('status', ['pending'])
            ->get()
            ->filter(function ($appt) use ($start, $end) {
                $apptStart = Carbon::parse($appt->appointment_date);
                $duration  = $this->getServiceDuration($appt->service_name);
                $apptEnd   = $apptStart->copy()->addMinutes($duration);
                return $start->lt($apptEnd) && $end->gt($apptStart);
            });

        $block = BarberBlock::create($validated);

        return response()->json([
            'success'              => true,
            'block'                => $block,
            'conflicting_appointments' => $conflictingAppts->values()->map(fn($a) => [
                'id'       => $a->id,
                'hora'     => Carbon::parse($a->appointment_date)->format('H:i'),
                'nombre'   => trim((optional($a->client)->name ?? '') . ' ' . (optional($a->client)->surname ?? '')),
                'servicio' => $a->service_name,
                'telefono' => optional($a->client)->phone ?? '',
            ]),
        ]);
    }

    public function checkBarberConflicts(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!in_array($user->role, ['barber', 'superadmin'])) {
            return response()->json(['conflicts' => []]);
        }

        $employeeId = $request->integer('employee_id');
        $date       = $request->string('block_date', '')->toString();
        $startStr   = $request->string('block_start', '')->toString();
        $endStr     = $request->string('block_end', '')->toString();

        if (!$employeeId || !$date || !$startStr || !$endStr) {
            return response()->json(['conflicts' => []]);
        }

        $start = Carbon::parse($date . ' ' . $startStr);
        $end   = Carbon::parse($date . ' ' . $endStr);

        $conflicts = Appointment::with('client')
            ->where('employee_id', $employeeId)
            ->whereDate('appointment_date', $date)
            ->whereIn('status', ['pending'])
            ->get()
            ->filter(function ($appt) use ($start, $end) {
                $apptStart = Carbon::parse($appt->appointment_date);
                $duration  = $this->getServiceDuration($appt->service_name);
                $apptEnd   = $apptStart->copy()->addMinutes($duration);
                return $start->lt($apptEnd) && $end->gt($apptStart);
            })
            ->values()
            ->map(fn($a) => [
                'id'       => $a->id,
                'hora'     => Carbon::parse($a->appointment_date)->format('H:i'),
                'nombre'   => trim((optional($a->client)->name ?? '') . ' ' . (optional($a->client)->surname ?? '')),
                'servicio' => $a->service_name,
                'telefono' => optional($a->client)->phone ?? '',
            ]);

        return response()->json(['conflicts' => $conflicts]);
    }

    public function deleteBarberBlock(Request $request, $id)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!in_array($user->role, ['barber', 'superadmin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }
        $block = BarberBlock::findOrFail((int) $id);
        $block->delete();
        return response()->json(['success' => true]);
    }

    public function getBarberBlocks(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!in_array($user->role, ['barber', 'superadmin'])) {
            return response()->json(['blocks' => []]);
        }
        $date = $request->string('date', '')->toString();
        $employeeId = $request->integer('employee_id', 0);

        $query = BarberBlock::query();
        if ($date) $query->where('block_date', $date);
        if ($employeeId > 0) $query->where('employee_id', $employeeId);

        return response()->json(['blocks' => $query->get()]);
    }

    // ─────────────────────────────────────────────────
    // CLIENT LOOKUP (autorelleno en panel)
    // ─────────────────────────────────────────────────

    public function clientLookup(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user) return response()->json(['found' => false]);

        $email     = strtolower(trim($request->string('email', '')->toString()));
        $phone     = trim($request->string('phone', '')->toString());
        $cleanPhone = str_replace([' ', '-', '(', ')'], '', $phone);

        $client = null;

        // Búsqueda EXACTA por email
        if (!empty($email) && str_contains($email, '@')) {
            $client = Client::where('email', $email)->first();
        }

        // Búsqueda EXACTA por teléfono (coincidencia de número exacto)
        if (!$client && !empty($phone)) {
            $digits = preg_replace('/\D/', '', $phone);
            if (strlen($digits) >= 8) {
                $possibleMatches = [$digits];
                if (str_starts_with($digits, '34') && strlen($digits) === 11) {
                    $possibleMatches[] = substr($digits, 2);
                } elseif (strlen($digits) === 9) {
                    $possibleMatches[] = '34' . $digits;
                }

                $client = Client::where(function ($q) use ($possibleMatches, $cleanPhone) {
                    $q->where('phone', $cleanPhone);
                    foreach ($possibleMatches as $match) {
                        $q->orWhereRaw("REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', ''), '(', '') = ?", [$match]);
                    }
                })->first();
            }
        }

        if (!$client) {
            return response()->json(['found' => false]);
        }

        return response()->json([
            'found'     => true,
            'nombre'    => $client->name,
            'apellidos' => $client->surname ?? '',
            'email'     => $client->email && !str_starts_with($client->email, 'sin-email-') ? $client->email : '',
            'phone'     => $client->phone,
        ]);
    }
}
