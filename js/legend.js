document.addEventListener('DOMContentLoaded', function () {
    const legendToggle = document.getElementById('legend-toggle');
    const legendContent = document.getElementById('legend-content');
    const legendClose = document.getElementById('legend-close');
    const filterButtons = document.querySelectorAll('input[name="filter"]');
    const legendText = document.getElementById('legend-text');

    updateLegend();

    legendToggle.addEventListener('click', function () {
        legendContent.style.display = 'block';
        legendToggle.style.display = 'none';
    });

    legendClose.addEventListener('click', function () {
        legendContent.style.display = 'none';
        legendToggle.style.display = 'block';
    });

    function updateLegend() {
        if (document.getElementById('pickups').checked) {
            legendText.innerHTML = `
                <p><b>Startvorgänge</b></p>
                <p>🔴: > 50 Startvorgänge</p>
                <p>🟡: 20–50 Startvorgänge</p>
                <p>🟢: < 20 Startvorgänge</p>
            `;
        } else if (document.getElementById('dropoffs').checked) {
            legendText.innerHTML = `
                <p><b>Endvorgänge</b></p>
                <p>🔴: > 50 Endvorgänge</p>
                <p>🟡: 20–50 Endvorgänge</p>
                <p>🟢: < 20 Endvorgänge</p>
            `;
        } else if (document.getElementById('both').checked) {
            legendText.innerHTML = `
                <p><b>Beides (Verhältnis Start/End)</b></p>
                <p>🔴: > 1.3 oder < 0.77</p>
                <p>🟡: 0.9–1.3</p>
                <p>🟢: Ausgeglichen</p>
            `;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('change', updateLegend);
    });

});
