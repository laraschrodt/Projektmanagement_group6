<?php
header('Content-Type: application/json; charset=utf-8');

$input = $_GET['query'] ?? '';

if ($input) {
    $input = $verbindung->real_escape_string($input);
    $result = $verbindung->query($sql);

    $stations = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
        }
} else {
}
