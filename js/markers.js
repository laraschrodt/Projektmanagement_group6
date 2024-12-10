// es werden bis jetzt nur die roten marker benutzt - die anderen kann man vllt später irgendwie einbinden

var greenMarker, yellowMarker, redMarker, blueMarker;
var features = [];

function initMarkers() {
    blueMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    greenMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    yellowMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    redMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

function fetchStationsAndShowMarkers(map) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './php/getStationsFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const stations = JSON.parse(xhr.responseText);

            stations.forEach((station) => {
                showMarker(station, map);
            });
        } else {
            console.error("Fehler beim Laden der Stationsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Stationsdaten.");
    };

    xhr.send();
}

function showMarker(myData, map) {

    var marker = new L.marker([myData.long, myData.lat], {
        clickable: true,
        icon: redMarker,
    }).bindPopup(`<p><b>${myData.station_name}</b><br>
                        Station ID: ${myData.station_id}<br>
                           Lat: ${myData.lat}
                            Long: ${myData.long}</p>`)
        .addTo(map);

    features.push(marker);

    var group = new L.featureGroup(features);
    map.fitBounds(group.getBounds());
}
