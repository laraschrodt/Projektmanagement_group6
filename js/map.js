var map;

/* Initialisiert die Karte */
function initMap() {
    map = L.map('map', {
        center: [50.112, 8.684],
        zoom: 15
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    initMarkers();
    fetchStationsAndShowMarkers(map);

    /* Event-Listener für den Button */
    document.getElementById('loadLines').addEventListener('click', () => {
        const lineCount = parseInt(document.getElementById('lineCount').value, 10);
        if (lineCount > 0) {
            fetchTopLinesAndShowWithLimit(map, lineCount);
        } else {
            alert('Bitte geben Sie eine gültige Anzahl ein.');
        }
    });

    /* Event-Listener für Adresseingabe */
    document.getElementById('address').addEventListener('input', handleAddressInput);

    /* Event-Listener für Enter-Taste bei Adresseingabe */
    document.getElementById('address').addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            const inputValue = event.target.value;

            const suggestionBox = document.getElementById('suggestions');
            if (suggestionBox.innerHTML === "" || suggestionBox.style.display === "none") {
                geocodeAddress(inputValue); // Individuelle Adresse verarbeiten
            }
        }
    });

    /* Legenden-Toggle-Event */
    initLegend();

    return map;
}

/* Initialisiert die Legenden-Funktion */
function initLegend() {
    const legendToggle = document.getElementById('legendToggle');
    const legendContent = document.getElementById('legendContent');

    legendToggle.addEventListener('click', () => {
        if (legendContent.classList.contains('hidden')) {
            legendContent.classList.remove('hidden');
            legendToggle.textContent = 'Legende ausblenden';
        } else {
            legendContent.classList.add('hidden');
            legendToggle.textContent = 'Legende anzeigen';
        }
    });
}

/* Verarbeitet die Adresseingabe */
function handleAddressInput(event) {
    const inputValue = event.target.value;
    console.log("Eingegebene Adresse:", inputValue);

    if (inputValue.length > 2) {
        fetch(`php/searchStations.php?query=${encodeURIComponent(inputValue)}`)
            .then(response => response.json())
            .then(data => {
                console.log("Vorgeschlagene Stationen:", data);
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
