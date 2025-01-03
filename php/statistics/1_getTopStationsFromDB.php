<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('../db-connection.php');
$table = "Fahrradstationen";

$sql = "
    SELECT StationName, Startvorgaenge, Endvorgaenge
    FROM $table
    ORDER BY (Startvorgaenge + Endvorgaenge) DESC
    LIMIT 10
";

$result = $verbindung->query($sql);

$lines = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $lines[] = [
            "station" => $row['StationName'],
            "starts" => intval($row['Startvorgaenge']),
            "ends" => intval($row['Endvorgaenge']),
        ];
    }
} else {
    echo json_encode(["error" => "Keine Daten gefunden."]);
    exit();
}

$verbindung->close();
echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
