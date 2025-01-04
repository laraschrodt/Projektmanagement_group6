<?php
/* Für die AJAX-Anfrage in markers.js */

header('Content-Type: application/json; charset=utf-8');

// Verbindung zur Datenbank herstellen
$verbindung = include('db-connection.php');
if (!$verbindung) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankverbindung fehlgeschlagen."]);
    exit();
}

$table = "Fahrradstationen";
$stations = [];

// SQL-Abfrage ausführen
$sql = "SELECT StationID, StationName, Latitude, Longitude, Startvorgaenge, Endvorgaenge FROM $table";
$result = $verbindung->query($sql);

if (!$result) {
    // SQL-Fehlerbehandlung
    http_response_code(500);
    echo json_encode(["error" => "SQL-Fehler: " . $verbindung->error]);
    exit();
}

if ($result->num_rows > 0) {
    // Daten aus der Abfrage in ein Array konvertieren
    while ($row = $result->fetch_assoc()) {
        // Koordinatenvalidierung
        if (!is_numeric($row['Latitude']) || !is_numeric($row['Longitude'])) {
            error_log("Ungültige Koordinaten für StationID {$row['StationID']}: Latitude={$row['Latitude']}, Longitude={$row['Longitude']}");
            continue; // Überspringe Stationen mit ungültigen Koordinaten
        }

        // Sicherstellen, dass keine Nullwerte oder ungültige Strings verwendet werden
        $stationName = isset($row['StationName']) ? trim($row['StationName']) : "Unbenannte Station";
        $stations[] = [
            "station_id" => intval($row['StationID']),
            "station_name" => $stationName,
            "lat" => floatval($row['Latitude']),
            "long" => floatval($row['Longitude']),
            "startvorgaenge" => isset($row['Startvorgaenge']) ? floatval($row['Startvorgaenge']) : 0,
            "endvorgaenge" => isset($row['Endvorgaenge']) ? floatval($row['Endvorgaenge']) : 0,
        ];
    }
} else {
    // Keine Ergebnisse gefunden
    http_response_code(404);
    echo json_encode(["error" => "Keine Stationen gefunden."]);
    exit();
}

// Überprüfung auf leere Ergebnisse nach der Schleife
if (empty($stations)) {
    http_response_code(500);
    echo json_encode(["error" => "Keine gültigen Stationen gefunden."]);
    exit();
}

// Verbindung schließen
$verbindung->close();

// JSON-Ausgabe mit Fehlerbehandlung
$jsonOutput = json_encode($stations, JSON_INVALID_UTF8_SUBSTITUTE);
if ($jsonOutput === false) {
    http_response_code(500);
    echo json_encode(["error" => "JSON-Encoding fehlgeschlagen: " . json_last_error_msg()]);
    exit();
}

echo $jsonOutput;
?>
