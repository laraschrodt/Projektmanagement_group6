document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const suggestionsBox = document.getElementById("suggestions");
    let customMarker; // Marker für benutzerdefinierte Adressen

    if (!addressInput || !suggestionsBox) {
        console.error("Das Element mit der ID 'address' oder 'suggestions' wurde nicht gefunden.");
        return;
    }

    // Event-Listener für Benutzereingaben (zeigt Vorschläge an)
    addressInput.addEventListener("input", function () {
        const query = this.value.trim();

        if (query.length < 2) {
            suggestionsBox.style.display = "none";
            suggestionsBox.innerHTML = "";
            return;
        }

        // AJAX-Anfrage an searchStations.php senden
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `./php/adressSearch/searchStations.php?query=${encodeURIComponent(query)}`, true);

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

        xhr.onerror = function () {
            console.error("Netzwerkfehler beim Abrufen der Stationsvorschläge.");
        };

        xhr.send();
    });

    // Event-Listener für die Eingabetaste (setzt Marker für neue Adresse)
    addressInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = this.value.trim();

            if (!query) {
                console.warn("Eingabefeld ist leer.");
                return;
            }

            // Prüfen, ob die Adresse bereits als Station existiert
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `./php/adressSearch/searchStations.php?query=${encodeURIComponent(query)}`, true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const results = JSON.parse(xhr.responseText);

                        if (results.length > 0) {
                            console.log("Station gefunden, kein neuer Marker erforderlich:", results[0].station_name);
                        } else {
                            console.log("Keine Station gefunden. Geokodiere die Adresse...");
                            geocodeAndPlaceMarker(query);
                        }
                    } catch (error) {
                        console.error("Fehler beim Parsen der Antwort:", error);
                    }
                } else {
                    console.error("Fehler beim Abrufen der Daten:", xhr.statusText);
                }
            };

            xhr.onerror = function () {
                console.error("Netzwerkfehler beim Abrufen der Stationsvorschläge.");
            };

            xhr.send();
        }
    });

    async function geocodeAndPlaceMarker(address) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                const coordinates = [parseFloat(lat), parseFloat(lon)];

                // Entferne vorherigen Marker, falls vorhanden
                if (customMarker) {
                    map.removeLayer(customMarker);
                }

                // Setze einen neuen Marker auf die Karte
                customMarker = new L.marker(coordinates, { clickable: true })
                    .bindPopup(`<p>${address}</p>`)
                    .addTo(map);

                // Karte auf den Marker zentrieren
                map.setView(coordinates, 15);
            } else {
                console.error("Keine Ergebnisse für die eingegebene Adresse gefunden.");
            }
        } catch (error) {
            console.error("Fehler beim Geokodieren der Adresse:", error);
        }
    }

    function displaySuggestions(results) {
        suggestionsBox.innerHTML = "";
        if (results.length > 0) {
            results.forEach(station => {
                const suggestion = document.createElement("div");
                suggestion.textContent = station.station_name;
                suggestion.classList.add("suggestion-item");
                suggestion.addEventListener("click", function () {
                    addressInput.value = station.station_name; // Station auswählen
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(suggestion);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    }
});
