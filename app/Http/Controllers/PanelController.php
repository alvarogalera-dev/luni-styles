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

        // Por defecto: hoy (si no hay filtro de fecha)
        if (empty($filterDate)) {
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
            'apellidos'     => 'required|string|max:100',
            'telefono'      => 'required|string|max:30',
            'email'         => 'required|email|max:255',
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
            'surname' => strip_tags($validated['apellidos']),
            'phone'   => strip_tags($validated['telefono']),
            'email'   => $validated['email'],
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

    // ─────────────────────────────────────────────────
    // ESTADÍSTICAS
    // ─────────────────────────────────────────────────

    public function statistics($type = null)
    {
        $user = Auth::user();

        $baseQuery = Appointment::where('status', 'completed');

        $statType = 'general';
        if ($user->role === 'barber' || $type === 'barberia') {
            $baseQuery->where('service_type', 'barberia');
            $statType = 'barberia';
        } elseif ($user->role === 'hairdresser' || $type === 'peluqueria_infantil') {
            $baseQuery->where('service_type', 'peluqueria_infantil');
            $statType = 'peluqueria_infantil';
        }

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

        // 5. Clientes penalizados
        $clientesPenalizados = Client::where('penalty_flag', true)->count();

        // 6. Tasa de asistencia
        $queryBase2 = Appointment::whereIn('status', ['completed', 'no-show']);
        if ($statType !== 'general') {
            $queryBase2->where('service_type', $statType === 'barberia' ? 'barberia' : 'peluqueria_infantil');
        }
        $totalCitas       = $queryBase2->count();
        $citasCompletadas = (clone $baseQuery)->count();
        $tasaAsistencia   = $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 1) : 0;

        // 7. Hora punta — usando Carbon para compatibilidad MySQL / PostgreSQL / SQLite
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

        // 8. Día punta
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
                'tasaAsistencia'      => $tasaAsistencia,
                'horaPunta'           => $horaPunta,
                'diaPunta'            => $diaPunta,
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
        ]);
    }
}
