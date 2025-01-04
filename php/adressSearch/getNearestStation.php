<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$sql = "SELECT StationName, Latitude, Longitude FROM Fahrradstationen";
$result = $verbindung->query($sql);

$stations = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stations[] = $row;
    }
}

echo json_encode($stations);

