function initMap() {
    var map = L.map('map', {
        center: [8.67, 50.11],
        zoom: 18
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    initMarkers();

    fetchStationsAndShowMarkers(map);

    return map;
}