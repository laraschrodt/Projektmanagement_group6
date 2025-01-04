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

    // Funktion zur Anzeige der Vorschläge
    function displaySuggestions(results) {
        suggestionsBox.innerHTML = "";
        if (results.length > 0) {
            results.forEach(station => {
                const suggestion = document.createElement("div");
                suggestion.textContent = station.station_name;
                suggestion.classList.add("suggestion-item");

                // Event-Listener für Klick auf Vorschlag
                suggestion.addEventListener("click", function () {
                    addressInput.value = station.station_name; // Station auswählen
                    suggestionsBox.style.display = "none";

                    // Zeige die Station auf der Karte
                    showStationOnMap(station);
                });

                suggestionsBox.appendChild(suggestion);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    }

    // Funktion zur Anzeige einer Station auf der Karte
    function showStationOnMap(station) {
        const latitude = parseFloat(station.latitude);
        const longitude = parseFloat(station.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Ungültige Koordinaten:", latitude, longitude);
            return;
        }

        const coordinates = [longitude, latitude];

        // Entferne vorherigen Marker, falls vorhanden
        if (customMarker) {
            map.removeLayer(customMarker);
        }

        // Setze einen neuen Marker auf die Karte
        customMarker = new L.marker(coordinates, { clickable: true })
            .bindPopup(`<b>${station.station_name}</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
            .addTo(map);

        // Öffne das Popup und zentriere die Karte
        customMarker.openPopup();
        map.setView(coordinates, 15);
    }
});
