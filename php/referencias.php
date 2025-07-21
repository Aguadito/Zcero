<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $credito_id = $_POST['credito_id'];
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $tipo = $_POST['tipo']; // Debe ser 'personal1' o 'personal2'

    $sql = "INSERT INTO referencias (credito_id, nombre, telefono, tipo) 
            VALUES ('$credito_id', '$nombre', '$telefono', '$tipo')";

    if ($conex->query($sql)) {
        echo "✅ Referencia guardada correctamente.";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>