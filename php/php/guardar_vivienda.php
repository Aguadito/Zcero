<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Paso 1: Guardar persona
    $dni = $_POST['dni'];
    $nombre = $_POST['nombre_completo'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];
    $direccion = $_POST['direccion'];
    $ciudad = $_POST['ciudad'];

    // Verificar si la persona ya existe
    $checkPersona = "SELECT id FROM personas WHERE dni = '$dni'";
    $result = $conex->query($checkPersona);
    
    if ($result->num_rows > 0) {
        $persona = $result->fetch_assoc();
        $persona_id = $persona['id'];
    } else {
        $sqlPersona = "INSERT INTO personas (dni, nombre_completo, correo, telefono, direccion, ciudad) 
                      VALUES ('$dni', '$nombre', '$correo', '$telefono', '$direccion', '$ciudad')";
        
        if (!$conex->query($sqlPersona)) {
            die("Error al guardar persona: " . $conex->error);
        }
        $persona_id = $conex->insert_id;
    }

    // Paso 2: Guardar crédito principal
    $tipo = 'vivienda';
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

    $sqlCredito = "INSERT INTO creditos (numero_credito, persona_id, tipo, monto_solicitado, plazo, ingresos_mensuales, deudas_actuales, otras_obligaciones, capacidad_pago, autorizo_consulta, autorizo_debito, fecha_reg, dni_file, payslip_file) 
                   VALUES ('$numero_credito', '$persona_id', '$tipo', '$monto', '$plazo', '$ingresos', '$deudas', '$obligaciones', '$capacidad_pago', '$autorizo_consulta', '$autorizo_debito', '$fecha_reg', '$dniFileName', '$payslipFileName')";

    if (!$conex->query($sqlCredito)) {
        die("Error al guardar crédito: " . $conex->error);
    }
    $credito_id = $conex->insert_id;

    // Paso 3: Guardar datos específicos de vivienda
    $tipo_trabajo = $_POST['tipo_trabajo'];
    $ruc = $_POST['ruc'] ?? '';
    $direccion_propiedad = $_POST['direccion_propiedad'];
    $ciudad_propiedad = $_POST['ciudad_propiedad'];
    $valor_propiedad = $_POST['valor_propiedad'];

    $sqlVivienda = "INSERT INTO creditos_vivienda (credito_id, tipo_trabajo, ruc, direccion_propiedad, ciudad_propiedad, valor_propiedad) 
                    VALUES ('$credito_id', '$tipo_trabajo', '$ruc', '$direccion_propiedad', '$ciudad_propiedad', '$valor_propiedad')";

    if (!$conex->query($sqlVivienda)) {
        die("Error al guardar datos de vivienda: " . $conex->error);
    }

    // Paso 4: Guardar referencias
    $ref1_nombre = $_POST['ref1_nombre'];
    $ref1_telefono = $_POST['ref1_telefono'];
    $ref2_nombre = $_POST['ref2_nombre'];
    $ref2_telefono = $_POST['ref2_telefono'];

    $sqlRef1 = "INSERT INTO referencias (credito_id, nombre, telefono, tipo) 
                VALUES ('$credito_id', '$ref1_nombre', '$ref1_telefono', 'personal1')";
    $sqlRef2 = "INSERT INTO referencias (credito_id, nombre, telefono, tipo) 
                VALUES ('$credito_id', '$ref2_nombre', '$ref2_telefono', 'personal2')";

    if (!$conex->query($sqlRef1) || !$conex->query($sqlRef2)) {
        die("Error al guardar referencias: " . $conex->error);
    }

    // Paso 5: Guardar datos bancarios
    $banco_nombre = $_POST['banco_nombre'];
    $banco_tipo_cuenta = $_POST['banco_tipo_cuenta'];
    $banco_numero_cuenta = $_POST['banco_numero_cuenta'];

    $sqlBanco = "INSERT INTO datos_bancarios (credito_id, banco_nombre, banco_tipo_cuenta, banco_numero_cuenta) 
                 VALUES ('$credito_id', '$banco_nombre', '$banco_tipo_cuenta', '$banco_numero_cuenta')";

    if (!$conex->query($sqlBanco)) {
        die("Error al guardar datos bancarios: " . $conex->error);
    }

    echo "✅ Solicitud de crédito de vivienda guardada correctamente. Número: $numero_credito";
}
?>