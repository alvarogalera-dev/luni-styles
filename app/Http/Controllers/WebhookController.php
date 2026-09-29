<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function deploy(Request $request)
    {
        $githubSecret = env('GITHUB_WEBHOOK_SECRET', 'luni-styles-secret-2026');
        
        $signature = $request->header('X-Hub-Signature-256');
        
        if (!$signature) {
            Log::warning('Webhook deploy failed: No signature provided.');
            return response()->json(['error' => 'No signature provided'], 400);
        }
        
        $payload = $request->getContent();
        $hash = 'sha256=' . hash_hmac('sha256', $payload, $githubSecret);
        
        if (!hash_equals($hash, $signature)) {
            Log::warning('Webhook deploy failed: Invalid signature.');
            return response()->json(['error' => 'Invalid signature'], 403);
        }
        
        // Execute deployment script in the background
        $deployScript = base_path('deploy.sh');
        $logFile = base_path('storage/logs/deploy.log');
        
        // Command to run in background on Linux (CloudPanel)
        $command = "nohup bash {$deployScript} > {$logFile} 2>&1 &";
        
        shell_exec($command);
        
        Log::info('Webhook deploy triggered successfully.');
        
        return response()->json(['message' => 'Deployment triggered']);
    }
}
