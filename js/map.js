function initMap() {
    map = L.map('map', {
        zoom: 15,
        zoomControl: true
    });
    map.zoomControl.setPosition('topright');

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    /* verschiedene Markerfarben initialisieren, damit man mit ihnen in showMarker() arbeiten kann */
    initMarkerColors();

    /* Marker aus DB auf Map anzeigen */
    fetchStationsAndShowMarkers(map);

    checkboxListenersForLines(map);

    return map;
}