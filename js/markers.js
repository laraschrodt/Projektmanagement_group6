var features = [];

/* Ajax Anfrage mit .json aus getStationsFromDB.php */
function fetchStationsAndShowMarkers(map) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './php/getStationsFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const stations = JSON.parse(xhr.responseText);

            stations.forEach((station) => {
                showMarker(station, map);
            });

            checkboxListener(map);
        } else {
            console.error("Fehler beim Laden der Stationsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Stationsdaten.");
    };

    xhr.send();
}

function showMarker(station, map) {
    var marker = new L.marker([station.long, station.lat], {
        clickable: true,
        icon: redMarker,
    }).bindPopup(`<p><b>Station: ${station.station_name}</b><br>
                        ID: ${station.station_id}<br>
                        Startvorgänge: ${station.startvorgaenge}<br>
                        Endvorgänge: ${station.endvorgaenge}<br></p>`)
        .addTo(map);

    features.push(marker);

    group = new L.featureGroup(features);
    map.fitBounds(group.getBounds());
}

