<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('../db-connection.php');
$table = "Fahrradbuchungen";

$sql = "
    SELECT Wochentag AS weekday, COUNT(*) AS count
    FROM $table
    GROUP BY Wochentag
    ORDER BY FIELD(Wochentag, 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag')
";

$result = $verbindung->query($sql);

$lines = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $lines[] = [
            "weekday" => $row['weekday'],
            "count" => intval($row['count']),
        ];
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Keine Daten gefunden."]);
    exit();
}

$verbindung->close();
echo json_encode($lines, JSON_INVALID_UTF8_SUBSTITUTE);
