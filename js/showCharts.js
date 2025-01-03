document.addEventListener('DOMContentLoaded', () => {
    fetchTopStationsAndShowChart();
    fetchWeekdaysDataAndShowChart();
    fetchBookingDataAndShowChart();
    fetchTimesDataAndShowChart();
});


/* 1. Balkendiagramm: Häufigste Start- und Endstationen*/
function fetchTopStationsAndShowChart() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/statistics/1_getTopStationsFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const stationData = JSON.parse(xhr.responseText);

            console.log('Empfangene Stationsdaten:', stationData);

            const stationNames = stationData.map(item => item.station);
            const startCounts = stationData.map(item => item.starts);
            const endCounts = stationData.map(item => item.ends);

            showTopStationsChart(stationNames, startCounts, endCounts);
        } else {
            console.error("Fehler beim Laden der Stationsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Stationsdaten.");
    };

    xhr.send();
}

function showTopStationsChart(stationNames, startCounts, endCounts) {
    const ctx = document.getElementById('stationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stationNames,
            datasets: [
                {
                    label: 'Startvorgänge',
                    data: startCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Endvorgänge',
                    data: endCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontaler Balken
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    ticks: {
                        autoSkip: false,
                    },
                },
            },
        },
    });
}



/* 2. Doughnut: Meist gebuchte Wochentage */
function fetchWeekdaysDataAndShowChart() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/statistics/2_getWeekdaysFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const weekdayData = JSON.parse(xhr.responseText);

            console.log('Empfangene Wochentagsdaten:', weekdayData);

            const weekdays = weekdayData.map(item => item.weekday);
            const weekdayCounts = weekdayData.map(item => item.count);

            showWeekdayChart(weekdays, weekdayCounts);
        } else {
            console.error("Fehler beim Laden der Wochentagsdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Wochentagsdaten.");
    };

    xhr.send();
}

function showWeekdayChart(weekdays, weekdayCounts) {
    const ctx = document.getElementById('weekdayChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: weekdays,
            datasets: [{
                label: 'Buchungen nach Wochentagen',
                data: weekdayCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
        },
    });
}



/* 3. Balkendiagramm: Meist genutzte Buchungsportale */
function fetchBookingDataAndShowChart() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/statistics/3_getPortalsFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const bookingData = JSON.parse(xhr.responseText);

            console.log('Empfangene Daten:', bookingData);

            const portalNames = bookingData.map(item => item.portal);
            const portalCounts = bookingData.map(item => item.count);

            showPortalsChart(portalNames, portalCounts);
        } else {
            console.error("Fehler beim Laden der Buchungsportaldaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Buchungsportaldaten.");
    };

    xhr.send();
}

function showPortalsChart(portalNames, portalCounts) {
    const ctx = document.getElementById('bookingChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: portalNames,
            datasets: [{
                label: 'Anzahl der Buchungen',
                data: portalCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 4,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}



/* 4. Balkendiagramm: Meiste Abholungen/Abgaben nach Tageszeit */
function fetchTimesDataAndShowChart() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/statistics/4_getTimesFromDB.php', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const timeData = JSON.parse(xhr.responseText);

            console.log('Empfangene Zeitdaten:', timeData);

            const timePeriods = timeData.map(item => item.time_period);
            const pickups = timeData.map(item => item.pickups);
            const dropoffs = timeData.map(item => item.dropoffs);

            showTimesChart(timePeriods, pickups, dropoffs);
        } else {
            console.error("Fehler beim Laden der Zeitdaten:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Netzwerkfehler beim Abrufen der Zeitdaten.");
    };

    xhr.send();
}

function showTimesChart(timePeriods, pickups, dropoffs) {
    const ctx = document.getElementById('timeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timePeriods,
            datasets: [
                {
                    label: 'Abholungen',
                    data: pickups,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Abgaben',
                    data: dropoffs,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
