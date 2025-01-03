<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('../db-connection.php');
$table = "Fahrradbuchungen";

$lines = [];

$sql = "
    SELECT Buchungsportal AS portal, COUNT(*) AS count
    FROM $table
    GROUP BY Buchungsportal
    ORDER BY count DESC";

$result = $verbindung->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $lines[] = [
            "portal" => $row['portal'],
            "count" => intval($row['count']),
        ];
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Keine Buchungsportaldaten gefunden."]);
    exit();
}

$verbindung->close();
echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
