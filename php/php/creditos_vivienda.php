<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $credito_id = $_POST['credito_id'];
    $tipo_trabajo = $_POST['tipo_trabajo'];
    $ruc = $_POST['ruc'];
    $direccion_propiedad = $_POST['direccion_propiedad'];
    $ciudad_propiedad = $_POST['ciudad_propiedad'];
    $valor_propiedad = $_POST['valor_propiedad'];

    $sql = "INSERT INTO creditos_vivienda (credito_id, tipo_trabajo, ruc, direccion_propiedad, ciudad_propiedad, valor_propiedad) 
            VALUES ('$credito_id', '$tipo_trabajo', '$ruc', '$direccion_propiedad', '$ciudad_propiedad', '$valor_propiedad')";

    if ($conex->query($sql)) {
        echo "✅ Crédito vivienda guardado correctamente.";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>