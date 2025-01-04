<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('../db-connection.php');

$input = $_GET['query'] ?? '';

if ($input) {
    $input = $verbindung->real_escape_string($input);
    $sql = "SELECT StationName FROM Fahrradstationen WHERE StationName LIKE '%$input%' LIMIT 10";
    $result = $verbindung->query($sql);

    $stations = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $stations[] = [
                "station_name" => $row['StationName']
            ];
        }
        echo json_encode($stations, JSON_INVALID_UTF8_SUBSTITUTE);
    } else {
        echo json_encode(["error" => "Keine Ergebnisse gefunden."], JSON_INVALID_UTF8_SUBSTITUTE);
    }
} else {
    echo json_encode(["error" => "Kein Suchbegriff angegeben."], JSON_INVALID_UTF8_SUBSTITUTE);
}

$verbindung->close();

