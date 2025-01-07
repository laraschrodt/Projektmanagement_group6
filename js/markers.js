var arrayForMarkers = []; /* Array, dem alle Marker hinzugefügt werden */
var featureGroup; /* Feature Group, die das arrayForMarkers[] beinhaltet */

/* bekommt json von getStationsFromDB.php und verarbeitet diese in showMarker() */
function fetchStationsAndShowMarkers(map) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './php/getStationsFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const stations = JSON.parse(xhr.responseText);

            /* Jede Station wird auf die Karte gepackt*/
            stations.forEach((station) => {
                showMarker(station, map);
            });

            /* Listener um Marker ein- und auszublenden */
            checkboxListenerForMarkers(map);

        } else {
            console.error("Fehler beim Laden der Stationsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Stationsdaten.");
    };

    xhr.send();
}

/* Packt jeden Datensatz aus der json als Marker auf die Karte */
function showMarker(station, map) {
    var marker = new L.marker([station.long, station.lat], {
        clickable: true,
        icon: redMarker,
    }).bindPopup(`<p><b>Station: ${station.station_name}</b><br>
                        ID: ${station.station_id}<br>
                        Startvorgänge: ${station.startvorgaenge}<br>
                        Endvorgänge: ${station.endvorgaenge}<br></p>`)
        .addTo(map);

    arrayForMarkers.push(marker);

    featureGroup = new L.featureGroup(arrayForMarkers);
    map.fitBounds(featureGroup.getBounds());
}

/* Listener um mit der Checkbox die Stationen ein und auszublenden */
function checkboxListenerForMarkers(map) {
    const checkbox = document.getElementById('stations');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            arrayForMarkers.forEach(feature => feature.addTo(map));
        } else {
            arrayForMarkers.forEach(feature => feature.remove());
        }
    });
}
