<?php
// Para que el navegador lo trate como texto plano y no lo descargue
header('Content-Type: text/plain; charset=utf-8');

include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = mysqli_real_escape_string($conex, $_POST['nombre_completo']);
    $dni = mysqli_real_escape_string($conex, $_POST['dni']);
    $correo = mysqli_real_escape_string($conex, $_POST['correo']);
    $telefono = mysqli_real_escape_string($conex, $_POST['telefono']);
    $monto = floatval($_POST['monto_solicitado']);
    $plazo = intval($_POST['plazo']);
    $ingresos = floatval($_POST['ingresos_mensuales']);
    $tipo_trabajo = mysqli_real_escape_string($conex, $_POST['tipo_trabajo']);
    $fecha_reg = date('Y-m-d H:i:s');

    $consulta = "INSERT INTO creditos_vivienda (
        nombre_completo, dni, correo, telefono, 
        monto_solicitado, plazo, ingresos_mensuales, 
        tipo_trabajo, fecha_reg
    ) VALUES (
        '$nombre', '$dni', '$correo', '$telefono',
        $monto, $plazo, $ingresos,
        '$tipo_trabajo', '$fecha_reg'
    )";

    if (mysqli_query($conex, $consulta)) {
        echo "Solicitud de crédito vivienda enviada correctamente.";
    } else {
        echo "Error al guardar en la base de datos: " . mysqli_error($conex);
    }
}
?>
