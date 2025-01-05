<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$day = $_GET['day'] ?? 'all';
$lines = [];

$sql = "
    SELECT 
        Start_Lat, 
        Start_Long, 
        Ende_Lat, 
        Ende_Long, 
        Start_Station, 
        Ende_Station, 
        Buchungsportal, 
        Wochentag,
        COUNT(*) AS count
    FROM fahrradbuchungen
    WHERE 1=1
";

if ($day !== 'all') {
    $sql .= " AND Wochentag = '$day'";
}

$sql .= " 
    GROUP BY Start_Lat, Start_Long, Ende_Lat, Ende_Long, Start_Station, Ende_Station, Buchungsportal, Wochentag
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
            "buchungsportal" => $row['Buchungsportal'],
            "wochentag" => $row['Wochentag'],
            "count" => intval($row['count'])
        ];
    }
}

echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
?>
