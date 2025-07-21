<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dni = $_POST['dni'];
    $nombre = $_POST['nombre_completo'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];
    $direccion = $_POST['direccion'];
    $ciudad = $_POST['ciudad'];

    $sql = "INSERT INTO personas (dni, nombre_completo, correo, telefono, direccion, ciudad) 
            VALUES ('$dni', '$nombre', '$correo', '$telefono', '$direccion', '$ciudad')";

    if ($conex->query($sql)) {
        echo "✅ socio guardada correctamente.";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>