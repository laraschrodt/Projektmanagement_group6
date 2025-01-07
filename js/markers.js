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
            radioButtonListenerForLines();

        } else {
            console.error("Fehler beim Laden der Stationsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Stationsdaten.");
    };

    xhr.send();
}

function determineMarkerColor(station) {
    if (document.getElementById('both').checked) {
        const start = parseInt(station.startvorgaenge, 10);
        const end = parseInt(station.endvorgaenge, 10);
        /*  Verhältnis von Start- zu Endvorgängen zwischen 1.1 und 0.9 gilt als ausgewogen */
        return calculateRelation(start / end, 'both', { high: 1.1, medium: 0.9 });
    }
    if (document.getElementById('pickups').checked) {
        const start = parseInt(station.startvorgaenge, 10);
        /* 50 gilt als hohe Aktivität und 20 als Mittlere */
        return calculateRelation(start, 'pickups', { high: 50, medium: 20 });
    }
    if (document.getElementById('dropoffs').checked) {
        const end = parseInt(station.endvorgaenge, 10);
        return calculateRelation(end, 'dropoffs', { high: 50, medium: 20 });
    }
}

function calculateRelation(value, type, thresholds) {
    const { high, medium } = thresholds;

    if (value >= high) {
        return redMarker;
    } else if (value >= medium) {
        return yellowMarker;
    } else {
        return greenMarker;
    }
}

/* Packt jeden Datensatz aus der json als Marker auf die Karte */
function showMarker(station, map) {
    const markerIcon = determineMarkerColor(station);

    var marker = new L.marker([station.long, station.lat], {
        clickable: true,
        icon: markerIcon,
    }).bindPopup(`<p><b>Station: ${station.station_name}</b><br>
                        ID: ${station.station_id}<br>
                        Startvorgänge: ${station.startvorgaenge}<br>
                        Endvorgänge: ${station.endvorgaenge}<br></p>`)
        .addTo(map);

    arrayForMarkers.push({ marker: marker, station: station });

    featureGroup = new L.featureGroup(arrayForMarkers.map(item => item.marker));
    map.fitBounds(featureGroup.getBounds());
}

/* Listener um mit der Checkbox die Stationen ein- und auszublenden */
function checkboxListenerForMarkers(map) {
    const checkbox = document.getElementById('stations');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            arrayForMarkers.forEach(feature => feature.marker.addTo(map));
        } else {
            arrayForMarkers.forEach(feature => feature.marker.remove());
        }
    });
}

function radioButtonListenerForLines() {
    const radioButtons = document.querySelectorAll('input[name="filter"]'); /* Sammelt alle Radiobuttons mit name="filter" in einer NodeList */
    radioButtons.forEach(button => {
        button.addEventListener('change', () => {
            arrayForMarkers.forEach(item => {
                const station = item.station;
                const newIcon = determineMarkerColor(station);
                item.marker.setIcon(newIcon);
            });
        });
    });
}
