<?php
/* Für die AJAX-Anfrage in markers.js */

header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$table = "Fahrradstationen";
$stations = [];

$sql = "SELECT StationID, StationName, Latitude, Longitude, Startvorgaenge, Endvorgaenge FROM $table";
$result = $verbindung->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stations[] = [
            "station_id" => $row['StationID'],
            "station_name" => $row['StationName'],
            "lat" => floatval($row['Latitude']),
            "long" => floatval($row['Longitude']),
            "startvorgaenge" => floatval($row['Startvorgaenge']),
            "endvorgaenge" => floatval($row['Endvorgaenge']),
        ];
    }
} else {
    echo json_encode(["error" => "Keine Stationen gefunden oder Datenbankfehler."]);
    exit();
}

$verbindung->close();
echo json_encode($stations, JSON_INVALID_UTF8_SUBSTITUTE);
