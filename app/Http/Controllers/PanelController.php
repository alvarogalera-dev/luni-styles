<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PanelController extends Controller
{
    // ─────────────────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────────────────

    public function showLogin()
    {
        if (Auth::check()) {
            return redirect('/panel/citas');
        }
        return Inertia::render('Panel/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        if (Auth::attempt($credentials, false)) {
            $request->session()->regenerate();
            return redirect()->intended('/panel/citas');
        }

        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no son correctas.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/panel/login');
    }

    // ─────────────────────────────────────────────────
    // CITAS (con filtros, búsqueda y paginación)
    // ─────────────────────────────────────────────────

    public function dashboard(Request $request)
    {
        $user = Auth::user();

        $search       = $request->string('search', '')->limit(100)->toString();
        $filterDate   = $request->string('date', '')->limit(10)->toString();
        $filterEmp    = $request->integer('employee_id', 0);
        $filterStatus = $request->string('status', '')->limit(20)->toString();
        $filterType   = $request->string('service_type', '')->limit(30)->toString();
        $page         = max(1, $request->integer('page', 1));
        $perPage      = 20;

        // Por defecto: hoy (si no hay filtro de fecha y no se ha solicitado explícitamente sin filtro)
        if (!$request->has('date')) {
            $filterDate = Carbon::today()->format('Y-m-d');
        }

        $query = Appointment::with('client')
            ->whereBetween('appointment_date', [
                Carbon::now()->subMonths(3)->startOfDay(),
                Carbon::now()->addMonths(12)->endOfDay(),
            ])
            ->orderBy('appointment_date', 'asc');

        // Control por rol
        if ($user->role === 'barber') {
            $query->where('service_type', 'barberia');
        } elseif ($user->role === 'hairdresser') {
            $query->where('service_type', 'peluqueria_infantil');
        } elseif ($user->role === 'superadmin' && !empty($filterType)) {
            $query->where('service_type', $filterType);
        }

        // Filtro por fecha (si hay fecha, filtrar por ese día)
        if (!empty($filterDate)) {
            try {
                $d = Carbon::createFromFormat('Y-m-d', $filterDate);
                $query->whereDate('appointment_date', $d->format('Y-m-d'));
            } catch (\Exception $e) {}
        }

        // Filtro por empleado
        if ($filterEmp > 0) {
            $query->where('employee_id', $filterEmp);
        }

        // Filtro por estado
        $allowedStatuses = ['pending', 'completed', 'no-show'];
        if (!empty($filterStatus) && in_array($filterStatus, $allowedStatuses)) {
            $query->where('status', $filterStatus);
        }

        // Búsqueda
        if (!empty($search)) {
            $likeQ = '%' . addcslashes($search, '%_') . '%';
            $query->where(function ($q) use ($likeQ) {
                $q->where('service_name', 'LIKE', $likeQ)
                  ->orWhere('id', 'LIKE', $likeQ)
                  ->orWhereHas('client', function ($cq) use ($likeQ) {
                      $cq->where('name', 'LIKE', $likeQ)
                         ->orWhere('surname', 'LIKE', $likeQ)
                         ->orWhere('email', 'LIKE', $likeQ)
                         ->orWhere('phone', 'LIKE', $likeQ);
                  });
            });
        }

        $total = $query->count();
        $appointments = $query->skip(($page - 1) * $perPage)->take($perPage)->get()->map(function ($appt) {
            return [
                'id'           => $appt->id,
                'nombre'       => $appt->client?->name ?? '—',
                'apellidos'    => $appt->client?->surname ?? '',
                'email'        => $appt->client?->email ?? '',
                'telefono'     => $appt->client?->phone ?? '',
                'fecha'        => $appt->appointment_date->format('Y-m-d'),
                'hora'         => $appt->appointment_date->format('H:i'),
                'servicio'     => $appt->service_name ?? '',
                'tipo_servicio'=> $appt->service_type,
                'empleado_id'  => $appt->employee_id,
                'precio'       => $appt->price ?? '',
                'observaciones'=> $appt->observations ?? '',
                'estado'       => $appt->status,
                'client_id'    => $appt->client?->id,
            ];
        });

        $dbServices = \App\Models\Service::where('active', true)->get();

        return Inertia::render('Panel/Dashboard', [
            'appointments' => $appointments,
            'total'        => $total,
            'page'         => $page,
            'perPage'      => $perPage,
            'filters'      => [
                'search'       => $search,
                'date'         => $filterDate,
                'employee_id'  => $filterEmp,
                'status'       => $filterStatus,
                'service_type' => $filterType,
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
            'dbServices' => $dbServices,
        ]);
    }

    // ─────────────────────────────────────────────────
    // CRUD CITAS
    // ─────────────────────────────────────────────────

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate(['status' => 'required|in:completed,no-show']);

        $appointment = Appointment::with('client')->findOrFail((int) $id);
        $this->authorizeAppointment($appointment);

        if ($appointment->status === $validated['status']) {
            return back();
        }

        $client = $appointment->client;
        $appointment->status = $validated['status'];
        $appointment->save();

        if ($validated['status'] === 'completed') {
            $client->attended_appointments = ($client->attended_appointments ?? 0) + 1;
            $client->consecutive_misses    = 0;

            if ($client->penalty_flag) {
                $client->consecutive_attendances_after_penalty = ($client->consecutive_attendances_after_penalty ?? 0) + 1;
                if ($client->consecutive_attendances_after_penalty >= 2) {
                    $client->penalty_flag = false;
                    $client->consecutive_attendances_after_penalty = 0;
                }
            } else {
                $client->loyalty_points = ($client->loyalty_points ?? 0) + 1;
                if ($client->loyalty_points > 9) {
                    $client->loyalty_points = 1;
                }
            }
        } elseif ($validated['status'] === 'no-show') {
            $client->missed_appointments = ($client->missed_appointments ?? 0) + 1;
            $client->consecutive_misses  = ($client->consecutive_misses ?? 0) + 1;
            if ($client->consecutive_misses >= 1) {
                $client->penalty_flag = true;
                $client->consecutive_attendances_after_penalty = 0;
                $client->loyalty_points = 0;
            }
        }

        $client->save();
        return back();
    }

    public function updateAppointment(Request $request, $id)
    {
        $appointment = Appointment::with('client')->findOrFail((int) $id);
        $this->authorizeAppointment($appointment);

        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'apellidos'     => 'nullable|string|max:100',
            'telefono'      => 'required|string|max:30',
            'email'         => 'nullable|email|max:255',
            'servicio'      => 'required|string|max:100',
            'tipo_servicio' => 'required|string|in:barberia,peluqueria_infantil',
            'empleado_id'   => 'required|integer|between:1,10',
            'fecha'         => 'required|date_format:Y-m-d',
            'hora'          => ['required', 'regex:/^([01]\d|2[0-3]):[0-5]\d$/'],
            'precio'        => 'nullable|string|max:20',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $client = $appointment->client;
        $client->update([
            'name'    => strip_tags($validated['nombre']),
            'surname' => isset($validated['apellidos']) ? strip_tags($validated['apellidos']) : '',
            'phone'   => strip_tags($validated['telefono']),
            'email'   => $validated['email'] ?? $client->email,
        ]);

        $datetime = Carbon::createFromFormat('Y-m-d H:i', $validated['fecha'] . ' ' . $validated['hora']);

        $appointment->update([
            'service_name'     => strip_tags($validated['servicio']),
            'service_type'     => $validated['tipo_servicio'],
            'employee_id'      => (int) $validated['empleado_id'],
            'appointment_date' => $datetime,
            'price'            => isset($validated['precio']) ? strip_tags($validated['precio']) : $appointment->price,
            'observations'     => isset($validated['observaciones']) ? strip_tags($validated['observaciones']) : null,
        ]);

        return back();
    }

    public function createAppointment(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'apellidos'     => 'nullable|string|max:100',
            'telefono'      => 'required|string|max:30',
            'email'         => 'nullable|email|max:255',
            'servicio'      => 'required|string|max:100',
            'tipo_servicio' => 'required|string|in:barberia,peluqueria_infantil',
            'empleado_id'   => 'required|integer|between:1,10',
            'fecha'         => 'required|date_format:Y-m-d',
            'hora'          => ['required', 'regex:/^([01]\d|2[0-3]):[0-5]\d$/'],
            'precio'        => 'nullable|string|max:20',
            'observaciones' => 'nullable|string|max:500',
        ]);

        // Restrict to appropriate service type
        if ($user->role === 'barber') {
            $validated['tipo_servicio'] = 'barberia';
        } elseif ($user->role === 'hairdresser') {
            $validated['tipo_servicio'] = 'peluqueria_infantil';
        }

        // Find or create client
        $inputEmail = $validated['email'] ? strtolower(trim($validated['email'])) : null;
        $inputPhone = $validated['telefono'] ? trim($validated['telefono']) : null;

        $client = null;
        if ($inputEmail) {
            $client = Client::where('email', $inputEmail)->first();
        }
        if (!$client && $inputPhone) {
            $cleanPhone = str_replace(' ', '', $inputPhone);
            $client = Client::where(DB::raw("REPLACE(phone, ' ', '')"), $cleanPhone)->first();
        }

        if (!$client) {
            $client = Client::create([
                'email'               => $inputEmail ?? 'sin-email@panel.local',
                'known_emails'        => $inputEmail ?? '',
                'name'                => strip_tags(trim($validated['nombre'])),
                'surname'             => isset($validated['apellidos']) ? strip_tags(trim($validated['apellidos'])) : '',
                'phone'               => $inputPhone ?? '',
                'known_phones'        => $inputPhone ?? '',
                'total_appointments'  => 1,
                'loyalty_points'      => 0,
                'penalty_flag'        => false,
            ]);
        } else {
            $client->update([
                'name'    => strip_tags(trim($validated['nombre'])),
                'surname' => strip_tags(trim($validated['apellidos'])),
                'total_appointments' => $client->total_appointments + 1,
            ]);
        }

        $datetime = Carbon::createFromFormat('Y-m-d H:i', $validated['fecha'] . ' ' . $validated['hora']);

        // Determine price with promo logic
        $price = $validated['precio'] ?? $this->getServicePrice($validated['servicio'], $validated['tipo_servicio']);

        Appointment::create([
            'client_id'        => $client->id,
            'appointment_date' => $datetime,
            'service_type'     => $validated['tipo_servicio'],
            'service_name'     => strip_tags($validated['servicio']),
            'employee_id'      => (int) $validated['empleado_id'],
            'price'            => $price,
            'observations'     => isset($validated['observaciones']) ? strip_tags($validated['observaciones']) : null,
            'status'           => 'pending',
        ]);

        return redirect()->route('panel.citas')->with('success', 'Cita creada correctamente.');
    }

    public function deleteAppointment(Request $request, $id)
    {
        $appointment = Appointment::findOrFail((int) $id);
        $this->authorizeAppointment($appointment);
        $appointment->delete();
        return back();
    }

    private function authorizeAppointment(Appointment $appointment): void
    {
        $user = Auth::user();
        if ($user->role === 'barber' && $appointment->service_type !== 'barberia') {
            abort(403, 'No autorizado.');
        }
        if ($user->role === 'hairdresser' && $appointment->service_type !== 'peluqueria_infantil') {
            abort(403, 'No autorizado.');
        }
    }

    private function getServicePrice(string $serviceName, string $serviceType): string
    {
        $promoActive = now() >= new \DateTime('2026-09-28T00:00:00+02:00')
                    && now() < new \DateTime('2026-10-12T00:01:00+02:00');

        $prices = [
            'barberia' => [
                'Corte Normal'  => ['normal' => 12, 'promo' => 10],
                'Corte + Barba' => ['normal' => 15, 'promo' => 13],
                'Solo Barba'    => ['normal' => 4,  'promo' => 4],
            ],
        ];

        if (isset($prices[$serviceType][$serviceName])) {
            $p = $prices[$serviceType][$serviceName];
            return (string) ($promoActive ? $p['promo'] : $p['normal']);
        }

        return 'Consultar';
    }

    // ─────────────────────────────────────────────────
    // ESTADÍSTICAS
    // ─────────────────────────────────────────────────

    public function statistics($type = null)
    {
        $user = Auth::user();

        if ($user->role === 'superadmin' && empty($type)) {
            return redirect()->route('panel.estadisticas', ['type' => 'barberia']);
        }

        $statType = 'general';
        if ($user->role === 'barber' || $type === 'barberia') {
            $statType = 'barberia';
        } elseif ($user->role === 'hairdresser' || $type === 'peluqueria_infantil') {
            $statType = 'peluqueria_infantil';
        }

        $serviceTypeFilter = $statType !== 'general' ? $statType : null;

        $baseQuery = Appointment::where('status', 'completed');
        if ($serviceTypeFilter) $baseQuery->where('service_type', $serviceTypeFilter);

        $allQuery = Appointment::whereIn('status', ['completed', 'no-show']);
        if ($serviceTypeFilter) $allQuery->where('service_type', $serviceTypeFilter);

        $hoy = Carbon::today();

        // 1. Cortes por periodo
        $cortesHoy    = (clone $baseQuery)->whereDate('appointment_date', $hoy)->count();
        $cortesSemana = (clone $baseQuery)->whereBetween('appointment_date', [$hoy->copy()->startOfWeek(), $hoy->copy()->endOfWeek()])->count();
        $cortesMes    = (clone $baseQuery)->whereMonth('appointment_date', $hoy->month)->whereYear('appointment_date', $hoy->year)->count();
        $cortesAno    = (clone $baseQuery)->whereYear('appointment_date', $hoy->year)->count();
        $cortesTotal  = (clone $baseQuery)->count();

        // 2. Ingresos
        $calcIngresos = function ($appts) {
            $total = 0;
            foreach ($appts as $appt) {
                $raw = preg_replace('/[^0-9,.]/', '', $appt->price ?? '');
                $raw = str_replace(',', '.', $raw);
                $v = (float) $raw;
                if ($v > 0) $total += $v;
            }
            return round($total, 2);
        };

        $ingresosHoy    = $calcIngresos((clone $baseQuery)->whereDate('appointment_date', $hoy)->get());
        $ingresosSemana = $calcIngresos((clone $baseQuery)->whereBetween('appointment_date', [$hoy->copy()->startOfWeek(), $hoy->copy()->endOfWeek()])->get());
        $ingresosMes    = $calcIngresos((clone $baseQuery)->whereMonth('appointment_date', $hoy->month)->whereYear('appointment_date', $hoy->year)->get());
        $ingresosAno    = $calcIngresos((clone $baseQuery)->whereYear('appointment_date', $hoy->year)->get());

        // 3. Servicios más demandados
        $servicios = (clone $baseQuery)
            ->select('service_name', DB::raw('count(*) as total'))
            ->groupBy('service_name')
            ->orderBy('total', 'desc')
            ->get();

        // 4. Rendimiento por empleado
        $empleados = (clone $baseQuery)
            ->select('employee_id', DB::raw('count(*) as total'))
            ->groupBy('employee_id')
            ->orderBy('total', 'desc')
            ->get()
            ->map(function ($emp) use ($baseQuery) {
                $mostDemanded = (clone $baseQuery)
                    ->where('employee_id', $emp->employee_id)
                    ->select('service_name', DB::raw('count(*) as cnt'))
                    ->groupBy('service_name')
                    ->orderBy('cnt', 'desc')
                    ->first();

                $names = [1 => 'Luis (Barbero)', 2 => 'Carlos (Barbero)', 3 => 'Mariely (Infantil)'];
                return [
                    'id'           => $emp->employee_id,
                    'name'         => $names[$emp->employee_id] ?? "Empleado {$emp->employee_id}",
                    'total_cortes' => $emp->total,
                    'top_service'  => $mostDemanded ? $mostDemanded->service_name : 'N/A',
                ];
            });

        // 5. Clientes penalizados (datos resumidos para el badge)
        $clientesPenalizadosQuery = Client::where('penalty_flag', true);
        if ($serviceTypeFilter) {
            $clientesPenalizadosQuery->whereHas('appointments', function ($q) use ($serviceTypeFilter) {
                $q->where('service_type', $serviceTypeFilter);
            });
        }
        $clientesPenalizados = $clientesPenalizadosQuery->count();

        // 6. Tasa de asistencia (de todos los tiempos)
        $totalCitas       = (clone $allQuery)->count();
        $citasCompletadas = (clone $baseQuery)->count();
        $citasNoShow      = (clone $allQuery)->where('status', 'no-show')->count();
        $tasaAsistencia   = $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 1) : 0;

        // 7. Hora punta — usando todas las citas completadas de todos los tiempos
        $horaPunta = 'N/A';
        $horaCounts = [];
        $allCompleted = (clone $baseQuery)->select('appointment_date')->get();
        foreach ($allCompleted as $appt) {
            $h = Carbon::parse($appt->appointment_date)->format('H:00');
            $horaCounts[$h] = ($horaCounts[$h] ?? 0) + 1;
        }
        if (!empty($horaCounts)) {
            arsort($horaCounts);
            $horaPunta = array_key_first($horaCounts);
        }

        // 8. Día punta (todos los tiempos)
        $diasSemana = [0 => 'Domingo', 1 => 'Lunes', 2 => 'Martes', 3 => 'Miércoles', 4 => 'Jueves', 5 => 'Viernes', 6 => 'Sábado'];
        $diaCounts  = [];
        foreach ($allCompleted as $appt) {
            $dow = (int) Carbon::parse($appt->appointment_date)->dayOfWeek;
            $diaCounts[$dow] = ($diaCounts[$dow] ?? 0) + 1;
        }
        $diaPunta = 'N/A';
        if (!empty($diaCounts)) {
            arsort($diaCounts);
            $diaPunta = $diasSemana[array_key_first($diaCounts)] ?? 'N/A';
        }

        // 9. Historial de cortes por día (para drill-down)
        $cortesHistorial = (clone $baseQuery)
            ->select(DB::raw('DATE(appointment_date) as dia'), DB::raw('count(*) as total'))
            ->groupBy('dia')
            ->orderBy('dia', 'desc')
            ->get()
            ->map(fn($r) => ['dia' => $r->dia, 'total' => $r->total]);

        return Inertia::render('Panel/Statistics', [
            'stats' => [
                'type'    => $statType,
                'cortes'  => [
                    'hoy'    => $cortesHoy,
                    'semana' => $cortesSemana,
                    'mes'    => $cortesMes,
                    'ano'    => $cortesAno,
                    'total'  => $cortesTotal,
                ],
                'ingresos' => [
                    'hoy'    => $ingresosHoy,
                    'semana' => $ingresosSemana,
                    'mes'    => $ingresosMes,
                    'ano'    => $ingresosAno,
                ],
                'servicios'           => $servicios,
                'empleados'           => $empleados,
                'clientesPenalizados' => $clientesPenalizados,
                'citasCompletadas'    => $citasCompletadas,
                'citasNoShow'         => $citasNoShow,
                'tasaAsistencia'      => $tasaAsistencia,
                'horaPunta'           => $horaPunta,
                'diaPunta'            => $diaPunta,
                'cortesHistorial'     => $cortesHistorial,
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
        ]);
    }

    // API: Drill-down de estadísticas (citas por año/mes/semana/día)
    public function statsDrillDown(Request $request)
    {
        $user = Auth::user();
        $type    = $request->string('type', 'barberia')->toString();
        $period  = $request->string('period', 'day')->toString(); // day|week|month|year
        $filter  = $request->string('filter', '')->toString();    // e.g. '2026-09', '2026'
        $status  = $request->string('status', 'completed')->toString(); // completed|no-show

        $allowedStatuses = ['completed', 'no-show'];
        if (!in_array($status, $allowedStatuses)) $status = 'completed';

        $query = Appointment::with('client')
            ->where('status', $status);

        if ($user->role === 'barber') $type = 'barberia';
        if ($user->role === 'hairdresser') $type = 'peluqueria_infantil';

        if ($type !== 'general') $query->where('service_type', $type);

        // Apply filter
        if ($period === 'month' && $filter) {
            [$year, $month] = explode('-', $filter . '-01');
            $query->whereYear('appointment_date', $year)->whereMonth('appointment_date', $month);
        } elseif ($period === 'year' && $filter) {
            $query->whereYear('appointment_date', $filter);
        } elseif ($period === 'day' && $filter) {
            $query->whereDate('appointment_date', $filter);
        }

        $appointments = $query->orderBy('appointment_date')->get()->map(fn($a) => [
            'id'       => $a->id,
            'nombre'   => ($a->client?->name ?? '—') . ' ' . ($a->client?->surname ?? ''),
            'telefono' => $a->client?->phone ?? '',
            'email'    => $a->client?->email ?? '',
            'servicio' => $a->service_name ?? '',
            'fecha'    => Carbon::parse($a->appointment_date)->format('Y-m-d'),
            'hora'     => Carbon::parse($a->appointment_date)->format('H:i'),
            'estado'   => $a->status,
        ]);

        return response()->json(['appointments' => $appointments]);
    }

    // API: Clientes penalizados (datos completos para el modal)
    public function statsPenalizados(Request $request)
    {
        $user = Auth::user();
        $type = $request->string('type', 'barberia')->toString();

        if ($user->role === 'barber') $type = 'barberia';
        if ($user->role === 'hairdresser') $type = 'peluqueria_infantil';

        $query = Client::where('penalty_flag', true);
        if ($type !== 'general') {
            $query->whereHas('appointments', fn($q) => $q->where('service_type', $type));
        }

        $penalizados = $query->withCount([
            'appointments as total_citas',
            'appointments as citas_completadas' => fn($q) => $q->where('status', 'completed'),
            'appointments as citas_no_show'     => fn($q) => $q->where('status', 'no-show'),
        ])->get()->map(fn($c) => [
            'id'                  => $c->id,
            'nombre'              => $c->name . ' ' . $c->surname,
            'email'               => $c->email,
            'telefono'            => $c->phone,
            'total_citas'         => $c->total_citas,
            'citas_completadas'   => $c->citas_completadas,
            'citas_no_show'       => $c->citas_no_show,
            'missed_appointments' => $c->missed_appointments ?? 0,
            'loyalty_points'      => $c->loyalty_points ?? 0,
            'consecutive_misses'  => $c->consecutive_misses ?? 0,
        ]);

        return response()->json(['penalizados' => $penalizados]);
    }
}
