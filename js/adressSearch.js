document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const suggestionsBox = document.getElementById("suggestions");
    let customMarker;
    let routingLayer;

    /* Event-Listener für Benutzereingaben (zeigt Vorschläge an) */
    addressInput.addEventListener("input", function () {
        const query = this.value.trim();

        /* AJAX-Anfrage an searchStations.php senden */
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `./php/adress-search/searchStations.php?query=${encodeURIComponent(query)}`, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const results = JSON.parse(xhr.responseText);
                    displaySuggestions(results);
                } catch (error) {
                    console.error("Fehler beim Parsen der Antwort:", error);
                }
            } else {
                console.error("Fehler beim Abrufen der Daten:", xhr.statusText);
            }
        };

        xhr.send();
    });

    /* Funktion zur Anzeige der Vorschläge */
    function displaySuggestions(results) {
        suggestionsBox.innerHTML = "";
        if (results.length > 0) {
            results.forEach(station => {
                const suggestion = document.createElement("div"); /* für jede suggestion ein div */
                suggestion.textContent = station.station_name;
                suggestion.classList.add("suggestion-item");

                suggestion.addEventListener("click", function () {
                    addressInput.value = station.station_name;
                    suggestionsBox.style.display = "none";
                    showStationOnMap(station);
                });

                suggestionsBox.appendChild(suggestion);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    }

    /* Event-Listener für Eingabetaste (berechnet Route für neue Adresse) */
    addressInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = this.value.trim();

            if (!query) {
                console.warn("Eingabefeld ist leer.");
                return;
            }

            geocodeAndFindRoute(query);
        }
    });

    window.placeManualMarker = function () {
        map.getContainer().style.cursor = "crosshair";

        map.once("click", function (event) {
            const { lat, lng } = event.latlng;

            const station = {
                lat: lat,
                long: lng,
                station_name: "Benutzerdefinierter Punkt",
                station_id: "N/A",
                startvorgaenge: 0,
                endvorgaenge: 0
            };

            showMarkerOnMap(station, map);

            map.getContainer().style.cursor = "";
            findNearestStation([lat, lng]);
        });
    };

    /* Funktion zur Anzeige einer Station auf der Karte */
    function showMarkerOnMap(station, map) {
        const markerIcon = station.station_name === "Benutzerdefinierter Punkt" ? blueMarker : determineMarkerColor(station);

        const marker = new L.marker([station.lat, station.long], {
            clickable: true,
            icon: markerIcon,
        }).bindPopup(`<p><b>Station: ${station.station_name}</b><br>
                        ID: ${station.station_id}<br>
                        Startvorgänge: ${station.startvorgaenge}<br>
                        Endvorgänge: ${station.endvorgaenge}<br></p>`)
            .addTo(map);

        if (customMarker) {
            map.removeLayer(customMarker);
        }
        customMarker = marker;
    }

    function showStationOnMap(station) {
        const coordinates = [parseFloat(station.longitude), parseFloat(station.latitude)];

        /* Entferne vorherigen Marker, falls vorhanden */
        if (customMarker) {
            map.removeLayer(customMarker);
        }

        customMarker = new L.marker(coordinates, { clickable: true })
            .bindPopup(`<b>${station.station_name}</b><br>Latitude: ${station.latitude}<br>Longitude: ${station.longitude}`)
            .addTo(map);

        customMarker.openPopup();
        map.setView(coordinates, 15);
    }

    /* Funktion zur Geokodierung und Routensuche */
    function geocodeAndFindRoute(address) {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", geocodeUrl, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        const coordinates = [parseFloat(lat), parseFloat(lon)];

                        if (customMarker) {
                            map.removeLayer(customMarker);
                        }

                        customMarker = new L.marker(coordinates, { clickable: true })
                            .bindPopup(`<p>${address}</p>`)
                            .addTo(map);

                        map.setView(coordinates, 15);
                        findNearestStation(coordinates);
                    }
                } catch (error) {
                    console.error("Fehler beim Parsen der Geocode-Antwort:", error);
                }
            }
        };

        xhr.send();
    }

    /* Funktion zur Suche der nächstgelegenen Station */
    function findNearestStation(coordinates) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "./php/getStationsFromDB.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const stations = JSON.parse(xhr.responseText);
                    let nearestStation = null;
                    let minDistance = Infinity;

                    const userLatLng = L.latLng(coordinates[0], coordinates[1]);

                    stations.forEach(station => {
                        const stationLatLng = L.latLng(parseFloat(station.long), parseFloat(station.lat));
                        const distance = userLatLng.distanceTo(stationLatLng);

                        if (distance < minDistance) {
                            minDistance = distance;
                            nearestStation = {
                                latitude: parseFloat(station.lat),
                                longitude: parseFloat(station.long),
                                name: station.station_name,
                                distance: (distance / 1000).toFixed(2)
                            };
                        }
                    });

                    if (nearestStation) {
                        calculateAndShowRoute(coordinates, [nearestStation.longitude, nearestStation.latitude]);
                    } else {
                        console.warn("Keine Stationen gefunden.");
                    }
                } catch (error) {
                    console.error("Fehler beim Parsen der Stationsdaten:", error);
                }
            }
        };

        xhr.send();
    }

    /* Funktion zur Routenberechnung und Anzeige */
    function calculateAndShowRoute(startCoordinates, endCoordinates) {
        const url = `https://router.project-osrm.org/route/v1/walking/${startCoordinates[1]},${startCoordinates[0]};${endCoordinates[1]},${endCoordinates[0]}?overview=full&geometries=geojson`;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);

                    if (data.routes && data.routes.length > 0) {
                        const route = data.routes[0].geometry;

                        if (routingLayer) {
                            map.removeLayer(routingLayer);
                        }

                        routingLayer = L.geoJSON(route, {
                            style: { color: 'blue', weight: 4 }
                        }).addTo(map);
                    }
                } catch (error) {
                    console.error("Fehler beim Parsen der Routing-Daten:", error);
                }
            }
        };

        xhr.send();
    }
});
