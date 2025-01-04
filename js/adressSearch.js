document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const suggestionsBox = document.getElementById("suggestions");

    if (!addressInput || !suggestionsBox) {
        console.error("Das Element mit der ID 'address' oder 'suggestions' wurde nicht gefunden.");
        return;
    }

    // Event-Listener für Benutzereingaben
    addressInput.addEventListener("input", function () {
        const query = this.value.trim();

        // Nur ab einer Mindestlänge von 2 Zeichen suchen
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

    // Vorschläge in der Box anzeigen
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


