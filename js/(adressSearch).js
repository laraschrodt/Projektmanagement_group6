var routes = {};

/* Verarbeitet die Adresseingabe */
function handleAddressInput(event) {
    const inputValue = event.target.value;

    if (inputValue.length > 2) {
        fetch(`php/searchStations.php?query=${encodeURIComponent(inputValue)}`)
            .then(response => response.json())
            .then(data => {
                showSuggestions(data);
            })
            .catch(error => console.error("Fehler bei der Stationssuche:", error));
    }
}

/* Funktion, um Vorschläge anzuzeigen */
function showSuggestions(stations) {
    const suggestionBox = document.getElementById('suggestions');
    suggestionBox.innerHTML = '';

    if (stations.length > 0) {
        suggestionBox.style.display = 'block';
    } else {
        suggestionBox.style.display = 'none';
    }

    stations.forEach(station => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = station;
        suggestionItem.className = 'suggestion-item';
        suggestionItem.style.padding = '5px';
        suggestionItem.style.cursor = 'pointer';

        suggestionItem.addEventListener('click', () => {
            document.getElementById('address').value = station;
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
        });

        suggestionBox.appendChild(suggestionItem);
    });
}

/* Geocoding-Funktion */
function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                console.log(`Adresse: ${address}, Koordinaten: ${lat}, ${lon}`);
                placeMarkerOnMap(lat, lon, address);
                findAndRouteToNearestStation(lat, lon);
            } else {
                alert("Die Adresse konnte nicht gefunden werden. Bitte überprüfe deine Eingabe.");
            }
        })
        .catch(error => console.error("Fehler beim Geocoding:", error));
}

/* Marker auf der Karte platzieren */
function placeMarkerOnMap(lat, lon, address) {
    if (window.userMarker) {
        map.removeLayer(window.userMarker);
    }

    window.userMarker = L.marker([lat, lon], { title: address })
        .addTo(map)
        .bindPopup(`<b>Adresse:</b> ${address}`)
        .openPopup();

    map.setView([lat, lon], 15);
}

/* Route erstellen */
function createRoute(id, startCoords, endCoords) {
    if (!Array.isArray(startCoords) || !Array.isArray(endCoords) || startCoords.length !== 2 || endCoords.length !== 2) {
        console.error("Ungültige Koordinaten:", startCoords, endCoords);
        alert("Es gab ein Problem mit den eingegebenen Koordinaten.");
        return;
    }

    const apiUrl = `https://router.project-osrm.org/route/v1/foot/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=false&alternatives=true&steps=true`;
    console.log(`Generierte Routing-URL: ${apiUrl}`);

    const route = L.Routing.control({
        name: id,
        serviceUrl: 'https://router.project-osrm.org/route/v1/foot',
        waypoints: [
            L.latLng(startCoords[0], startCoords[1]),
            L.latLng(endCoords[0], endCoords[1])
        ],
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: function () { return null; }
    }).addTo(map);

    route.on('routingerror', function (e) {
        console.error('Routing error:', e);
        alert("Es gab ein Problem bei der Routenberechnung.");
    });

    routes[id] = route;
}

/* Alle Routen entfernen */
function removeAllRoutes() {
    for (const route of Object.values(routes)) {
        route.remove();
    }
    routes = {};
}

/* Dynamisches Laden der Stationen */
function fetchStationsFromDB() {
    return fetch('php/getStationsFromDB.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Stationsdaten aus der DB:", data);
            return data.map(station => ({
                name: station.station_name,
                lat: parseFloat(station.lat),
                lon: parseFloat(station.long)
            }));
        })
        .catch(error => {
            console.error("Fehler beim Laden der Stationsdaten:", error);
            return [];
        });
}

/* Nächste Station finden und Route berechnen */
function findAndRouteToNearestStation(lat, lon) {
    const userCoords = [lat, lon];
    console.log(`Benutzerkoordinaten: ${userCoords}`);

    fetchStationsFromDB().then(stations => {
        if (!stations || stations.length === 0) {
            alert("Keine Stationen gefunden, um eine Route zu berechnen.");
            return;
        }

        let nearestStation = null;
        let minDistance = Infinity;

        stations.forEach(station => {
            if (station.lat && station.lon) {
                const distance = map.distance(
                    L.latLng(userCoords[0], userCoords[1]),
                    L.latLng(station.lat, station.lon)
                );
                console.log(`Station: ${station.name} (${station.lat}, ${station.lon}), Entfernung: ${distance} Meter`);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStation = station;
                }
            } else {
                console.warn(`Station mit ungültigen Koordinaten übersprungen: ${station.name}`);
            }
        });

        if (nearestStation) {
            console.log(`Nächstgelegene Station: ${nearestStation.name} (${nearestStation.lat}, ${nearestStation.lon}), Entfernung: ${minDistance} Meter`);
            createRoute("UserToStation", userCoords, [nearestStation.lon, nearestStation.lat]);
        } else {
            alert("Keine gültige Station gefunden.");
        }
    });
}