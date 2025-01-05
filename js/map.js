function initMap() {
    map = L.map('map', {
        center: [50.112, 8.684],
        zoom: 15,
        zoomControl: true
    });
    map.zoomControl.setPosition('topright');

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    initMarkers();
    fetchStationsAndShowMarkers(map);

    checkboxListenerForLines(map);

    /* Event-Listener für den "Laden"-Button */
    document.getElementById('loadLines').addEventListener('click', () => {
        const lineCount = parseInt(document.getElementById('lineCount').value, 10);
        if (lineCount > 0) {
            fetchTopLinesAndShowWithLimit(map, lineCount);
        } else {
            alert('Bitte geben Sie eine gültige Anzahl ein.');
        }
    });

    return map;
}