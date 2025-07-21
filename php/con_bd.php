<?php
// CONFIGURACIÓN SIN HEADERS PREMATUROS
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$host = "mysql-rodolfo.alwaysdata.net";
$user = "rodolfo";
$pass = "aonxd20";
$bd = "rodolfo_scooperativo";

$conex = new mysqli($host, $user, $pass, $bd);

if ($conex->connect_error) {
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $conex->connect_error
    ]));
}

$conex->set_charset("utf8mb4");
?>