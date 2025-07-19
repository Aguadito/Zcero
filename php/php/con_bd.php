<?php
$host = "localhost";
$user = "root";
$pass = "";
$bd = "scooperativo";

$conex = new mysqli($host, $user, $pass, $bd);

if ($conex->connect_error) {
    die("Error de conexión: " . $conex->connect_error);
}
?>