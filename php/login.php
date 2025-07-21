<?php
// FORZAR HEADERS JSON AL INICIO
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// CAPTURAR ERRORES
try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Datos JSON inválidos');
    }
    
    $dni = trim($data['dni'] ?? '');
    $contrasena = $data['contrasena'] ?? '';

    // Validación básica
    if (empty($dni) || empty($contrasena)) {
        throw new Exception('DNI y contraseña son requeridos');
    }

    // Buscar usuario
    $stmt = $conex->prepare("SELECT id, dni, nombre_completo, contraseña, estado, rol FROM socios WHERE dni = ?");
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();

    if (!$usuario) {
        throw new Exception('DNI o contraseña incorrectos');
    }

    // Verificar estado
    if ($usuario['estado'] !== 'activo') {
        throw new Exception('Cuenta no activa. Contacte al administrador.');
    }

    // Verificar contraseña
    if (!password_verify($contrasena, $usuario['contraseña'])) {
        throw new Exception('DNI o contraseña incorrectos');
    }

    // Crear sesión
    $_SESSION['user_id'] = $usuario['id'];
    $_SESSION['user_rol'] = $usuario['rol'];
    $_SESSION['user_nombre'] = $usuario['nombre_completo'];

    // Respuesta exitosa con datos del usuario
    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'user' => [
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre_completo'],
            'rol' => $usuario['rol']
        ],
        'redirect' => ($usuario['rol'] === 'admin') ? '../HTMLs/admin/dashboard.html' : '../index.html'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>