document.addEventListener('DOMContentLoaded', function () {
    const legendToggle = document.getElementById('legend-toggle');
    const legendContent = document.getElementById('legend-content');
    const legendClose = document.getElementById('legend-close');

    // Beim Klicken auf "Legende öffnen"
    legendToggle.addEventListener('click', function () {
        console.log('Legende-Button geklickt'); // Nur zum Testen
        legendContent.style.display = 'block'; // Zeige die Legende an
        legendToggle.style.display = 'none'; // Verstecke den Öffnen-Button
    });

    // Beim Klicken auf "Legende schließen"
    legendClose.addEventListener('click', function () {
        legendContent.style.display = 'none'; // Verstecke die Legende
        legendToggle.style.display = 'block'; // Zeige den Öffnen-Button wieder an
    });
});
