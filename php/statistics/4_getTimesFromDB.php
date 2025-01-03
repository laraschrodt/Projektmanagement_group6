<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('../db-connection.php');
$table = "Fahrradbuchungen";

$sql_pickups = "
    SELECT
        CASE
            WHEN HOUR(STR_TO_DATE(Buchung_Start, '%d.%m.%Y %H:%i')) BETWEEN 6 AND 9 THEN '06:00-09:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Start, '%d.%m.%Y %H:%i')) BETWEEN 9 AND 12 THEN '09:00-12:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Start, '%d.%m.%Y %H:%i')) BETWEEN 12 AND 15 THEN '12:00-15:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Start, '%d.%m.%Y %H:%i')) BETWEEN 15 AND 18 THEN '15:00-18:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Start, '%d.%m.%Y %H:%i')) BETWEEN 18 AND 21 THEN '18:00-21:00'
            ELSE '21:00-00:00'
        END AS time_period,
        COUNT(*) AS pickups
    FROM $table
    GROUP BY time_period
    ORDER BY FIELD(time_period, '06:00-09:00', '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-00:00')
";

$result_pickups = $verbindung->query($sql_pickups);

$data = [];
if ($result_pickups && $result_pickups->num_rows > 0) {
    while ($row = $result_pickups->fetch_assoc()) {
        $data[$row['time_period']] = [
            'pickups' => intval($row['pickups']),
            'dropoffs' => 0, // Platzhalter für Abgaben
        ];
    }
}

$sql_dropoffs = "
    SELECT
        CASE
            WHEN HOUR(STR_TO_DATE(Buchung_Ende, '%d.%m.%Y %H:%i')) BETWEEN 6 AND 9 THEN '06:00-09:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Ende, '%d.%m.%Y %H:%i')) BETWEEN 9 AND 12 THEN '09:00-12:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Ende, '%d.%m.%Y %H:%i')) BETWEEN 12 AND 15 THEN '12:00-15:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Ende, '%d.%m.%Y %H:%i')) BETWEEN 15 AND 18 THEN '15:00-18:00'
            WHEN HOUR(STR_TO_DATE(Buchung_Ende, '%d.%m.%Y %H:%i')) BETWEEN 18 AND 21 THEN '18:00-21:00'
            ELSE '21:00-00:00'
        END AS time_period,
        COUNT(*) AS dropoffs
    FROM $table
    GROUP BY time_period
    ORDER BY FIELD(time_period, '06:00-09:00', '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-00:00')
";

$result_dropoffs = $verbindung->query($sql_dropoffs);
if ($result_dropoffs && $result_dropoffs->num_rows > 0) {
    while ($row = $result_dropoffs->fetch_assoc()) {
        $data[$row['time_period']]['dropoffs'] = intval($row['dropoffs']);
    }
}

$output = [];
foreach ($data as $time_period => $counts) {
    $output[] = [
        'time_period' => $time_period,
        'pickups' => $counts['pickups'],
        'dropoffs' => $counts['dropoffs'],
    ];
}

$verbindung->close();
echo json_encode($output, JSON_INVALID_UTF8_SUBSTITUTE);
