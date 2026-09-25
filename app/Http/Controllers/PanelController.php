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
    public function showLogin()
    {
        return Inertia::render('Panel/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
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
        return redirect('/panel');
    }

    public function dashboard()
    {
        $user = Auth::user();
        
        $query = Appointment::with('client')->orderBy('appointment_date', 'desc');

        if ($user->role === 'barber') {
            $query->where('service_type', 'barberia');
        } elseif ($user->role === 'hairdresser') {
            $query->where('service_type', 'peluqueria_infantil');
        }

        $appointments = $query->get()->map(function ($appt) {
            return [
                'id' => $appt->id,
                'nombre' => $appt->client->name,
                'apellidos' => $appt->client->surname,
                'email' => $appt->client->email,
                'telefono' => $appt->client->phone,
                'fecha' => $appt->appointment_date->format('Y-m-d'),
                'hora' => $appt->appointment_date->format('H:i'),
                'servicio' => $appt->service_name,
                'tipo_servicio' => $appt->service_type,
                'empleado_id' => $appt->employee_id,
                'precio' => $appt->price,
                'observaciones' => $appt->observations,
                'estado' => $appt->status,
                'client_id' => $appt->client->id
            ];
        });

        return Inertia::render('Panel/Dashboard', [
            'appointments' => $appointments,
            'user' => [
                'name' => $user->name,
                'role' => $user->role
            ]
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:completed,no-show']);
        
        $appointment = Appointment::with('client')->findOrFail($id);
        if ($appointment->status === $request->status) {
            return back();
        }

        $client = $appointment->client;
        $appointment->status = $request->status;
        $appointment->save();

        if ($request->status === 'completed') {
            $client->attended_appointments += 1;
            $client->consecutive_misses = 0;
            
            if ($client->penalty_flag) {
                $client->consecutive_attendances_after_penalty += 1;
                if ($client->consecutive_attendances_after_penalty >= 2) {
                    $client->penalty_flag = false;
                    $client->consecutive_attendances_after_penalty = 0;
                }
            } else {
                $client->loyalty_points += 1;
                if ($client->loyalty_points > 5) {
                    $client->loyalty_points = 1;
                }
            }
        } elseif ($request->status === 'no-show') {
            $client->missed_appointments += 1;
            $client->consecutive_misses += 1;
            if ($client->consecutive_misses >= 1) {
                $client->penalty_flag = true;
                $client->consecutive_attendances_after_penalty = 0;
                $client->loyalty_points = 0; // Reset points on penalty
            }
        }
        
        $client->save();
        return back();
    }

    public function updateAppointment(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        
        $validated = $request->validate([
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'telefono' => 'required|string',
            'email' => 'required|email',
            'servicio' => 'required|string',
            'empleado_id' => 'required|integer',
            'fecha' => 'required|date',
            'hora' => 'required|string',
            'observaciones' => 'nullable|string'
        ]);

        $client = $appointment->client;
        $client->update([
            'name' => $validated['nombre'],
            'surname' => $validated['apellidos'],
            'phone' => $validated['telefono'],
            'email' => $validated['email'],
        ]);

        $datetime = Carbon::parse($validated['fecha'] . ' ' . $validated['hora']);

        $appointment->update([
            'service_name' => $validated['servicio'],
            'employee_id' => $validated['empleado_id'],
            'appointment_date' => $datetime,
            'observations' => $validated['observaciones']
        ]);

        return back();
    }

    public function deleteAppointment($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return back();
    }

    public function statistics($type = null)
    {
        $user = Auth::user();
        
        $query = Appointment::where('status', 'completed');
        
        $statType = 'general';
        
        if ($user->role === 'barber' || $type === 'barberia') {
            $query->where('service_type', 'barberia');
            $statType = 'barberia';
        } elseif ($user->role === 'hairdresser' || $type === 'peluqueria_infantil') {
            $query->where('service_type', 'peluqueria_infantil');
            $statType = 'peluqueria_infantil';
        }
        
        // 1. Cortes por día, semana, mes, año
        $hoy = Carbon::today();
        
        $cortesHoy = (clone $query)->whereDate('appointment_date', $hoy)->count();
        $cortesSemana = (clone $query)->whereBetween('appointment_date', [$hoy->copy()->startOfWeek(), $hoy->copy()->endOfWeek()])->count();
        $cortesMes = (clone $query)->whereMonth('appointment_date', $hoy->month)->whereYear('appointment_date', $hoy->year)->count();
        $cortesAno = (clone $query)->whereYear('appointment_date', $hoy->year)->count();

        // 2. Ingresos de hoy
        $ingresosHoyObj = (clone $query)->whereDate('appointment_date', $hoy)->get();
        $ingresosHoy = 0;
        foreach($ingresosHoyObj as $appt) {
            $precioStr = preg_replace('/[^0-9,.]/', '', $appt->price);
            $precioStr = str_replace(',', '.', $precioStr);
            $ingresosHoy += floatval($precioStr);
        }

        // 3. Servicio más demandado general
        $servicios = (clone $query)->select('service_name', DB::raw('count(*) as total'))
            ->groupBy('service_name')
            ->orderBy('total', 'desc')
            ->get();
            
        // 4. Empleados stats
        $empleados = (clone $query)->select('employee_id', DB::raw('count(*) as total'))
            ->groupBy('employee_id')
            ->get()->map(function($emp) use ($query) {
                $mostDemanded = (clone $query)->where('employee_id', $emp->employee_id)
                    ->select('service_name', DB::raw('count(*) as count'))
                    ->groupBy('service_name')
                    ->orderBy('count', 'desc')
                    ->first();

                $name = 'Empleado ' . $emp->employee_id;
                if ($emp->employee_id === 1) $name = 'Luis (Barbero)';
                if ($emp->employee_id === 2) $name = 'Carlos (Barbero)';
                if ($emp->employee_id === 3) $name = 'Mariely (Infantil)';

                return [
                    'id' => $emp->employee_id,
                    'name' => $name,
                    'total_cortes' => $emp->total,
                    'top_service' => $mostDemanded ? $mostDemanded->service_name : 'N/A'
                ];
            });

        return Inertia::render('Panel/Statistics', [
            'stats' => [
                'type' => $statType,
                'cortes' => [
                    'hoy' => $cortesHoy,
                    'semana' => $cortesSemana,
                    'mes' => $cortesMes,
                    'ano' => $cortesAno
                ],
                'ingresosHoy' => $ingresosHoy,
                'servicios' => $servicios,
                'empleados' => $empleados
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role
            ]
        ]);
    }
}
