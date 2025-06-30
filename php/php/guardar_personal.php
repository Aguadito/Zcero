<?php
include("con_bd.php");

if (isset($_POST['enviar'])) {
    $nombre = $_POST['nombre_completo'];
    $dni = $_POST['dni'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];
    $monto = $_POST['monto_solicitado'];
    $plazo = $_POST['plazo'];
    $ingresos = $_POST['ingresos_mensuales'];
    $finalidad = $_POST['finalidad_credito'];

    // Validaciones básicas
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        die("Correo no válido");
    }
    if (!is_numeric($monto) || !is_numeric($plazo) || !is_numeric($ingresos)) {
        die("Monto, plazo e ingresos deben ser numéricos");
    }

    $stmt = mysqli_prepare($conex, "INSERT INTO creditos_personal (nombre_completo, dni, correo, telefono, monto_solicitado, plazo, ingresos_mensuales, finalidad_credito) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssssiiis", $nombre, $dni, $correo, $telefono, $monto, $plazo, $ingresos, $finalidad);

    if (mysqli_stmt_execute($stmt)) {
        header("Location: gracias.html");
        exit();
    } else {
        echo "Error al guardar: " . mysqli_error($conex);
    }

    mysqli_stmt_close($stmt);
}
?>
