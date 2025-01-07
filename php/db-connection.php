<?php
/* Datenbankverbindung */

$server = "localhost";
$username = "root";
$password = "";
$dbname = "fahrradbuchungen";

$verbindung = new mysqli($server, $username, $password, $dbname) or die ("Verbindung fehlgeschlagen!");

return $verbindung;

