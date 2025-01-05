let filteredLines = [];

// Listener für das Buchungsportal-Dropdown
document.getElementById('portal-dropdown').addEventListener('change', () => {
    const selectedPortal = document.getElementById('portal-dropdown').value;

    if (selectedPortal === 'none') {
        clearLines();
        console.log('Alle Linien entfernt, da "Keine" ausgewählt wurde.');
    } else if (selectedPortal === 'all') {
        fetchLines('portal', 'all');
    } else {
        fetchLines('portal', selectedPortal);
    }

    document.getElementById('day-dropdown').value = 'none';
});

// Listener für das Wochentag-Dropdown
document.getElementById('day-dropdown').addEventListener('change', () => {
    const selectedDay = document.getElementById('day-dropdown').value;

    if (selectedDay === 'none') {
        clearLines();
        console.log('Alle Linien entfernt, da "Keine" ausgewählt wurde.');
    } else if (selectedDay === 'all') {
        fetchLines('day', 'all');
    } else {
        fetchLines('day', selectedDay);
    }

    document.getElementById('portal-dropdown').value = 'none';
});


// Funktion zum Abrufen und Anzeigen der Linien
function fetchLines(filterType, filterValue) {
    const endpoint = filterType === 'portal'
        ? `./php/portal-filter/getLinesByPortal.php?portal=${filterValue}`
        : `./php/weekday-filter/getLinesByDay.php?day=${filterValue}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint, true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const lines = JSON.parse(xhr.responseText);
            console.log(`Erfolgreich geladene Daten (${filterType}):`, lines);
            updateMapWithLines(lines);
        } else {
            console.error('Fehler beim Abrufen der Daten:', xhr.statusText);
        }
    };

    xhr.onerror = () => console.error('Netzwerkfehler beim Abrufen der Daten.');
    xhr.send();
}

// Entfernt alle aktuellen Linien und fügt neue hinzu
function updateMapWithLines(lines) {
    clearLines();
    lines.forEach(line => {
        const polyline = L.polyline(
            [
                [line.start_long, line.start_lat],
                [line.end_long, line.end_lat]
            ],
            { color: 'blue', weight: 3, opacity: 0.8 }
        ).bindPopup(`
            <b>Buchungsportal:</b> ${line.buchungsportal}<br>
            <b>Wochentag:</b> ${line.wochentag}<br>
            <b>Anzahl der Verbindungen:</b> ${line.count}<br>
            <b>Startstation:</b> ${line.start_station}<br>
            <b>Endstation:</b> ${line.end_station}
        `);

        polyline.addTo(map);
        filteredLines.push(polyline);
        lineFeatures.push(polyline);
    });
}

// Entfernt alle Linien von der Karte
function clearLines() {
    filteredLines.forEach(line => map.removeLayer(line));
    filteredLines.length = 0;
    lineFeatures = lineFeatures.filter(line => !filteredLines.includes(line));
}
