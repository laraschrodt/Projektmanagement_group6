function initMap() {
    var map = L.map('map', {
        center: [50.112, 8.684],
        zoom: 15
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    initMarkers();

    fetchStationsAndShowMarkers(map);

    return map;
}