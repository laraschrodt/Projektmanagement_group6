<?php
header('Content-Type: application/json; charset=utf-8');
$verbindung = include('db-connection.php');

$input = $_GET['query'] ?? '';

if ($input) {
    $input = $verbindung->real_escape_string($input);
    $sql = "SELECT StationName FROM Fahrradstationen WHERE StationName LIKE '%$input%' LIMIT 10";
    $result = $verbindung->query($sql);

    $stations = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $stations[] = $row['StationName'];
        }
    }

    echo json_encode($stations);
} else {
    echo json_encode([]);
}
?>
