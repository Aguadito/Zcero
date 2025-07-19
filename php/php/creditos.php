<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $persona_id = $_POST['persona_id'];
    $tipo = $_POST['tipo'];
    $monto = $_POST['monto_solicitado'];
    $plazo = $_POST['plazo'];
    $ingresos = $_POST['ingresos_mensuales'];
    $deudas = $_POST['deudas_actuales'];
    $obligaciones = $_POST['otras_obligaciones'];
    $autorizo_consulta = isset($_POST['autorizo_consulta']) ? 1 : 0;
    $autorizo_debito = isset($_POST['autorizo_debito']) ? 1 : 0;
    $fecha_reg = date('Y-m-d H:i:s');

    // Generar número de crédito único
    $numero_credito = 'CR-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    // Calcular capacidad de pago (30% de ingresos menos deudas y obligaciones)
    $capacidad_pago = ($ingresos * 0.30) - $deudas - $obligaciones;

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

    $sql = "INSERT INTO creditos (numero_credito, persona_id, tipo, monto_solicitado, plazo, ingresos_mensuales, deudas_actuales, otras_obligaciones, capacidad_pago, autorizo_consulta, autorizo_debito, fecha_reg, dni_file, payslip_file) 
            VALUES ('$numero_credito', '$persona_id', '$tipo', '$monto', '$plazo', '$ingresos', '$deudas', '$obligaciones', '$capacidad_pago', '$autorizo_consulta', '$autorizo_debito', '$fecha_reg', '$dniFileName', '$payslipFileName')";

    if ($conex->query($sql)) {
        echo "✅ Crédito guardado correctamente. Número: $numero_credito";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>