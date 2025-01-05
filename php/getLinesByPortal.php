<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$portal = $_GET['portal'] ?? 'all';
$lines = [];


$sql = "
    SELECT 
        Start_Lat, 
        Start_Long, 
        Ende_Lat, 
        Ende_Long, 
        Start_Station, 
        Ende_Station, 
        Buchungsportal, -- Hinzufügen des Buchungsportals
        COUNT(*) AS count
    FROM fahrradbuchungen
";

if ($portal !== 'all') {
    $sql .= " WHERE Buchungsportal = '$portal'";
}

$sql .= " 
    GROUP BY Start_Lat, Start_Long, Ende_Lat, Ende_Long, Start_Station, Ende_Station, Buchungsportal
    ORDER BY count DESC
";

$result = $verbindung->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $lines[] = [
            "start_lat" => floatval($row['Start_Lat']),
            "start_long" => floatval($row['Start_Long']),
            "end_lat" => floatval($row['Ende_Lat']),
            "end_long" => floatval($row['Ende_Long']),
            "start_station" => $row['Start_Station'],
            "end_station" => $row['Ende_Station'],
            "buchungsportal" => $row['Buchungsportal'], // Buchungsportal in die Antwort einfügen
            "count" => intval($row['count'])
        ];
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Keine Verbindungsdaten gefunden."]);
    exit();
}

$verbindung->close();
echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
?>