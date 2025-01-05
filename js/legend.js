document.addEventListener('DOMContentLoaded', function () {
    const legendToggle = document.getElementById('legend-toggle');
    const legendContent = document.getElementById('legend-content');
    const legendClose = document.getElementById('legend-close');

    legendToggle.addEventListener('click', function () {
        console.log('Legende-Button geklickt');
        legendContent.style.display = 'block';
        legendToggle.style.display = 'none';
    });

    legendClose.addEventListener('click', function () {
        legendContent.style.display = 'none';
        legendToggle.style.display = 'block';
    });
});
