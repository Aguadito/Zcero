<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $credito_id = $_POST['credito_id'];
    $banco_nombre = $_POST['banco_nombre'];
    $banco_tipo_cuenta = $_POST['banco_tipo_cuenta']; // 'ahorros' o 'corriente'
    $banco_numero_cuenta = $_POST['banco_numero_cuenta'];

    $sql = "INSERT INTO datos_bancarios (credito_id, banco_nombre, banco_tipo_cuenta, banco_numero_cuenta) 
            VALUES ('$credito_id', '$banco_nombre', '$banco_tipo_cuenta', '$banco_numero_cuenta')";

    if ($conex->query($sql)) {
        echo "✅ Datos bancarios guardados correctamente.";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>