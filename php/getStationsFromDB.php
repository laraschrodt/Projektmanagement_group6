<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$table = "Fahrradstationen";
$stations = [];

$sql = "SELECT StationID, StationName, Latitude, Longitude FROM $table";
$result = $verbindung->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stations[] = [
            "station_id" => $row['StationID'],
            "station_name" => $row['StationName'],
            "lat" => floatval($row['Latitude']),
            "long" => floatval($row['Longitude']),
        ];
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Keine Stationen gefunden oder Datenbankfehler."]);
    exit();
}

$verbindung->close();
echo json_encode($stations, JSON_INVALID_UTF8_SUBSTITUTE);
?>



