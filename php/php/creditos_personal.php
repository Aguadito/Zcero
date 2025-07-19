<?php
include("con_bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $credito_id = $_POST['credito_id'];
    $finalidad = $_POST['finalidad_credito'];

    $sql = "INSERT INTO creditos_personal (credito_id, finalidad_credito) 
            VALUES ('$credito_id', '$finalidad')";

    if ($conex->query($sql)) {
        echo "✅ Crédito personal guardado correctamente.";
    } else {
        echo "❌ Error: " . $conex->error;
    }
}
?>