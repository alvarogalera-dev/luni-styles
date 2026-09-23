<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'asunto' => 'required|string|max:255',
            'mensaje' => 'required|string',
        ]);

        try {
            Mail::to('contacto@lunistyles.com')->send(new ContactMessage($validated));
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error sending contact email: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al enviar el correo. Por favor, inténtalo más tarde.'], 500);
        }
    }
}
