var lineFeatures = [];
var lineGroup;

/* Asynchrone AJAX-Anfrage für Verbindungen */
function fetchTopLinesAndShowWithLimit(map, limit) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `./php/getLinesFromDB.php?limit=${limit}`, true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(`Erfolgreich geladen: ${xhr.responseText}`);
            const lines = JSON.parse(xhr.responseText);

            if (lineGroup) {
                lineGroup.clearLayers();
            }

            lineFeatures.forEach(line => line.remove());
            lineFeatures = [];
            lineGroup = null;

            lines.forEach((line) => {
                showLine(line, map);
            });

            checkboxListenerForLines(map);

            if (lineGroup) {
                map.fitBounds(lineGroup.getBounds());
            }
        } else {
            console.error("Fehler beim Laden der Daten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Daten.");
    };

    xhr.send();
}

/* Event-Listener für die Checkbox */
function checkboxListenerForLines(map) {
    const checkbox = document.getElementById('trend-lines');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            if (lineFeatures.length > 0) {
                lineFeatures.forEach(line => line.addTo(map));
            }
        } else {
            lineFeatures.forEach(line => line.remove());
        }
    });
}


/* Linie auf die Karte zeichnen */
function showLine(line, map) {
    var polyline = L.polyline(
        [
            [line.start_long, line.start_lat],
            [line.end_long, line.end_lat],
        ],
        {
            color: 'blue',
            weight: 3,
            opacity: 1,
        }
    ).bindPopup(`<p>
                     <b>Anzahl Verbindungen:</b> ${line.count}<br>
                     <b>Aufgabe:</b> ${line.start_station}<br>
                     <b>Abgabe:</b> ${line.end_station}<br>
                 </p>`)
        .addTo(map);

    lineFeatures.push(polyline);
    lineGroup = new L.featureGroup(lineFeatures);
}
