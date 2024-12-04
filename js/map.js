document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map', {
        center: [50.10, 8.68],
        zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.zoomControl.setPosition('topright');
});
