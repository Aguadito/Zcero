<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Leer datos JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar que llegaron los datos
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

// Extraer y limpiar datos - CORREGIDO para coincidir con estructura BD
$nombre_completo = trim($data['nombre'] ?? '');
$dni = trim($data['dni'] ?? '');
$correo = trim($data['email'] ?? ''); // email -> correo
$telefono = trim($data['telefono'] ?? '');
$direccion = trim($data['direccion'] ?? '');
$ciudad = trim($data['ciudad'] ?? '');
$codigo_postal = trim($data['codigoPostal'] ?? '');
$contraseña = $data['contraseña'] ?? '';

// Validaciones básicas del servidor
if (empty($nombre_completo) || empty($dni) || empty($correo) || empty($contraseña)) {
    echo json_encode(['success' => false, 'message' => 'Campos obligatorios faltantes']);
    exit;
}

// Validar formato DNI
if (!preg_match('/^\d{8}$/', $dni)) {
    echo json_encode(['success' => false, 'message' => 'DNI inválido']);
    exit;
}

// Validar formato email
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

try {
    // Incluir conexión
    include("con_bd.php");
    
    // Verificar si el email o DNI ya existe
    $stmt = $conex->prepare("SELECT id FROM socios WHERE correo = ? OR dni = ?");
    $stmt->bind_param("ss", $correo, $dni);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->fetch_assoc()) {
        echo json_encode(['success' => false, 'message' => 'Email o DNI ya registrado']);
        exit;
    }
    $stmt = $conex->prepare("SELECT id FROM socios WHERE dni = ?");
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'DNI ya registrado']);
        exit;
    }

    // Hash de la contraseña
    $contraseñaHash = password_hash($contraseña, PASSWORD_DEFAULT);
    
    // CORREGIDO: Insertar en tabla socios con los campos correctos
    $stmt = $conex->prepare("INSERT INTO socios (dni, nombre_completo, correo, telefono, direccion, ciudad, codigo_postal, contraseña, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())");
    $stmt->bind_param("ssssssss", $dni, $nombre_completo, $correo, $telefono, $direccion, $ciudad, $codigo_postal, $contraseñaHash);
    $resultado = $stmt->execute();
    
    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente. Tu cuenta está pendiente de activación.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar usuario: ' . $conex->error]);
    }
    
} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error del servidor']);
}
?>