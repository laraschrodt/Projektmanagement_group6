<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$table = "Fahrradbuchungen";
$lines = [];

$limit = intval($_GET['limit']);

$sql = "
    SELECT 
        Start_Lat, 
        Start_Long, 
        Ende_Lat, 
        Ende_Long, 
        Start_Station, 
        Ende_Station, 
        COUNT(*) AS count
    FROM $table
    GROUP BY Start_Lat, Start_Long, Ende_Lat, Ende_Long, Start_Station, Ende_Station
    ORDER BY count DESC
    LIMIT $limit";

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
            "count" => intval($row['count'])
        ];
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Keine Verbindungsdaten gefunden."]);
    exit();
}

$verbindung->close();
echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
?>
