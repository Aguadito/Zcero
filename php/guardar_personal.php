<?php
session_start();
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener ID de usuario desde sesión
    if (!isset($_SESSION['user_id'])) {
        die("Usuario no autenticado");
    }
    $socio_id = $_SESSION['user_id']; // CORREGIDO: usar socio_id

    // Paso 1: Guardar crédito principal
    $tipo = 'personal';
    $monto = $_POST['monto_solicitado'];
    $plazo = $_POST['plazo'];
    $ingresos = $_POST['ingresos_mensuales'];
    $deudas = $_POST['deudas_actuales'];
    $obligaciones = $_POST['otras_obligaciones'];
    $autorizo_consulta = isset($_POST['autorizo_consulta']) ? 1 : 0;
    $autorizo_debito = isset($_POST['autorizo_debito']) ? 1 : 0;
    $fecha_reg = date('Y-m-d H:i:s');

    $numero_credito = 'CR-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $capacidad_pago = ($ingresos * 0.30) - $deudas - $obligaciones;

    // Manejo de archivos
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $dniFileName = '';
    if (isset($_FILES['dni_file']) && $_FILES['dni_file']['error'] == UPLOAD_ERR_OK) {
        $dniFile = $_FILES['dni_file'];
        $dniFileName = $uploadDir . uniqid('dni_') . '.' . pathinfo($dniFile['name'], PATHINFO_EXTENSION);
        move_uploaded_file($dniFile['tmp_name'], $dniFileName);
    }
    
    $payslipFileName = '';
    if (isset($_FILES['payslip_file']) && $_FILES['payslip_file']['error'] == UPLOAD_ERR_OK) {
        $payslipFile = $_FILES['payslip_file'];
        $payslipFileName = $uploadDir . uniqid('payslip_') . '.' . pathinfo($payslipFile['name'], PATHINFO_EXTENSION);
        move_uploaded_file($payslipFile['tmp_name'], $payslipFileName);
    }

    // CORREGIDO: usar socio_id en lugar de persona_id
    $sqlCredito = "INSERT INTO creditos (numero_credito, socio_id, tipo, monto_solicitado, plazo, ingresos_mensuales, deudas_actuales, otras_obligaciones, capacidad_pago, autorizo_consulta, autorizo_debito, fecha_reg, dni_file, payslip_file) 
                   VALUES ('$numero_credito', '$socio_id', '$tipo', '$monto', '$plazo', '$ingresos', '$deudas', '$obligaciones', '$capacidad_pago', '$autorizo_consulta', '$autorizo_debito', '$fecha_reg', '$dniFileName', '$payslipFileName')";

    if (!$conex->query($sqlCredito)) {
        die("Error al guardar crédito: " . $conex->error);
    }
    $credito_id = $conex->insert_id;

    // Paso 2: Guardar finalidad del crédito personal
    $finalidad = $_POST['finalidad_credito'];

    $sqlPersonal = "INSERT INTO creditos_personal (credito_id, finalidad_credito) 
                    VALUES ('$credito_id', '$finalidad')";

    if (!$conex->query($sqlPersonal)) {
        die("Error al guardar datos del crédito personal: " . $conex->error);
    }

    // Paso 3: Guardar referencias correctamente
    $ref1_nombre = $_POST['ref1_nombre'];
    $ref1_telefono = $_POST['ref1_telefono'];
    $ref2_nombre = $_POST['ref2_nombre'];
    $ref2_telefono = $_POST['ref2_telefono'];

    // Insertar primera referencia
    $sqlRef1 = "INSERT INTO referencias (credito_id, nombre, telefono, tipo) 
                VALUES ('$credito_id', '$ref1_nombre', '$ref1_telefono', 'personal1')";
    
    // Insertar segunda referencia
    $sqlRef2 = "INSERT INTO referencias (credito_id, nombre, telefono, tipo) 
                VALUES ('$credito_id', '$ref2_nombre', '$ref2_telefono', 'personal2')";

    // Ejecutar ambas consultas y verificar errores
    $ref1_ok = $conex->query($sqlRef1);
    $ref2_ok = $conex->query($sqlRef2);

    if (!$ref1_ok) {
        echo "Error referencia 1: " . $conex->error . "<br>";
    }
    if (!$ref2_ok) {
        echo "Error referencia 2: " . $conex->error . "<br>";
    }

    // Paso 4: Guardar datos bancarios
    $banco_nombre = $_POST['banco_nombre'];
    $banco_tipo_cuenta = $_POST['banco_tipo_cuenta'];
    $banco_numero_cuenta = $_POST['banco_numero_cuenta'];

    $sqlBanco = "INSERT INTO datos_bancarios (credito_id, banco_nombre, banco_tipo_cuenta, banco_numero_cuenta) 
                 VALUES ('$credito_id', '$banco_nombre', '$banco_tipo_cuenta', '$banco_numero_cuenta')";

    if (!$conex->query($sqlBanco)) {
        die("Error al guardar datos bancarios: " . $conex->error);
    }

    echo "✅ Solicitud de crédito personal guardada correctamente. Número: $numero_credito";
    
    // Debug: Verificar que las referencias se guardaron
    $checkRefs = "SELECT * FROM referencias WHERE credito_id = '$credito_id'";
    $refsResult = $conex->query($checkRefs);
    echo "<br>Referencias guardadas: " . $refsResult->num_rows;
}
?>