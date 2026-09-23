<!DOCTYPE html>
<html>
<head>
    <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #CD7F32; border-bottom: 2px solid #CD7F32; padding-bottom: 10px;">Nuevo Mensaje de Contacto - Luni Styles</h2>
    
    <p>Has recibido un nuevo mensaje a través del formulario web de contacto:</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Nombre:</strong> {{ $data['nombre'] }} {{ $data['apellidos'] }}</p>
        <p><strong>Teléfono:</strong> {{ $data['telefono'] }}</p>
        <p><strong>Correo:</strong> {{ $data['email'] }}</p>
        <p><strong>Asunto:</strong> {{ $data['asunto'] }}</p>
    </div>
    
    <h3 style="color: #444;">Mensaje:</h3>
    <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">
        {{ $data['mensaje'] }}
    </div>
    
    <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
        Este es un mensaje automático enviado desde la web de Luni Styles.
    </p>
</body>
</html>
