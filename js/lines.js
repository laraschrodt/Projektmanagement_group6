var arrayForLines = []; /* Array, dem alle Lines hinzugefügt werden */

/* Event-Listener für die Checkbox und en "Laden"-Button */
function checkboxListenersForLines(map) {

    /* Event-Listener für die Checkbox */
    const checkbox = document.getElementById('trend-lines');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) { /* Wenn Checkbox "checked" ist werden Lines zur Karte hinzugefügt */
            if (arrayForLines.length > 0) {
                arrayForLines.forEach(line => line.addTo(map));
            }
        } else {
            arrayForLines.forEach(line => line.remove()); /* Wenn Checkbox "nicht-checked" ist werden Lines von Karte entfernt */
        }
    });

    /* Event-Listener für den "Laden"-Button */
    document.getElementById('loadLines').addEventListener('click', () => {
        const limit = parseInt(document.getElementById('limit').value, 10);
        if (limit > 0) {
            fetchTopLinesAndShowWithLimit(map, limit); /* Läd limitierte Anzahl an Verbindungen auf die Karte */
        } else {
            alert('Bitte geben Sie eine gültige Anzahl ein.');
        }
    });
}

/* Asynchrone AJAX-Anfrage für Verbindungen */
function fetchTopLinesAndShowWithLimit(map, limit) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `./php/getLinesFromDB.php?limit=${limit}`, true); /* nimmt limit aus dem Event-Listener für den "Laden"-Button */

    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(`Erfolgreich geladen: ${xhr.responseText}`);

            const lines = JSON.parse(xhr.responseText);

            /* Sicherstellen, dass alle bisher hinzugefügten Linien entfernt werden*/
            arrayForLines.forEach(line => line.remove()); /* Entfernt Lines von der Karte */
            arrayForLines = []; /* Entfernt die Referenzen auf die Lines */
            featureGroup = null; /* entfernt Referenz auf Feature Group */

            lines.forEach((line) => {
                showLine(line, map);
            });

            checkboxListenersForLines(map);

            if (featureGroup) {
                map.fitBounds(featureGroup.getBounds());
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

    arrayForLines.push(polyline);
    featureGroup = new L.featureGroup(arrayForLines);
}
