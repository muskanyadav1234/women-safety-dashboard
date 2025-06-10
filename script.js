
// --- Map Initialization ---
let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
let incidentMarkers = [];

// --- Data and Chart Variables ---
let incidents = [];
let liveChart, barChart, lineChart;
let crimeTypes = ['Harassment', 'Assault', 'Theft', 'Other'];
let cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];

// --- Utility Functions ---
function randomIncident() {
    return {
        city: cities[Math.floor(Math.random() * cities.length)],
        type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
        lat: 20 + Math.random() * 10,
        lng: 75 + Math.random() * 10,
        year: 2020 + Math.floor(Math.random() * 5)
    };
}

function updateMap() {
    incidentMarkers.forEach(m => map.removeLayer(m));
    incidentMarkers = [];
    incidents.forEach(inc => {
        let marker = L.marker([inc.lat, inc.lng]).addTo(map)
            .bindPopup(`<b>${inc.type}</b><br>${inc.city} (${inc.year})`);
        incidentMarkers.push(marker);
    });
}

function updateLiveChart() {
    let counts = crimeTypes.map(type => incidents.filter(i => i.type === type).length);
    if (liveChart) liveChart.destroy();
    liveChart = new Chart(document.getElementById('liveChart'), {
        type: 'doughnut',
        data: {
            labels: crimeTypes,
            datasets: [{
                data: counts,
                backgroundColor: ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71']
            }]
        },
        options: {responsive: true, plugins: {legend: {position: 'bottom'}}}
    });
}

function updateBarChart() {
    let cityCrime = cities.map(city => crimeTypes.map(type => incidents.filter(i => i.city === city && i.type === type).length));
    if (barChart) barChart.destroy();
    barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: cities,
            datasets: crimeTypes.map((type, idx) => ({
                label: type,
                data: cityCrime.map(row => row[idx]),
                backgroundColor: ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71'][idx]
            }))
        },
        options: {responsive: true, plugins: {legend: {position: 'bottom'}}, scales: {x: {stacked: true}, y: {stacked: true}}}
    });
}

function updateLineChart() {
    let years = [...new Set(incidents.map(i => i.year))].sort();
    let cityTrends = cities.map(city => years.map(year => incidents.filter(i => i.city === city && i.year === year).length));
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: years,
            datasets: cities.map((city, idx) => ({
                label: city,
                data: cityTrends[idx],
                borderColor: ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71', '#9b59b6'][idx],
                fill: false
            }))
        },
        options: {responsive: true, plugins: {legend: {position: 'bottom'}}}
    });
}

function refreshDashboard() {
    updateMap();
    updateLiveChart();
    updateBarChart();
    updateLineChart();
}

// --- Simulate Incident ---
document.getElementById('simulate-btn').addEventListener('click', () => {
    incidents.push(randomIncident());
    refreshDashboard();
});

// --- CSV Upload ---
document.getElementById('csvFileInput').addEventListener('change', function(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(evt) {
        let rows = evt.target.result.split(/\r?\n/).filter(r => r.trim().length > 0);
        let headers = rows[0].split(',');
        let cityIdx = headers.findIndex(h => h.toLowerCase().includes('city'));
        let typeIdx = headers.findIndex(h => h.toLowerCase().includes('type'));
        let latIdx = headers.findIndex(h => h.toLowerCase().includes('lat'));
        let lngIdx = headers.findIndex(h => h.toLowerCase().includes('lng'));
        let yearIdx = headers.findIndex(h => h.toLowerCase().includes('year'));
        if (cityIdx === -1 || typeIdx === -1 || latIdx === -1 || lngIdx === -1 || yearIdx === -1) {
            alert('CSV must have columns: city, type, lat, lng, year');
            return;
        }
        incidents = rows.slice(1).map(row => {
            let cols = row.split(',');
            return {
                city: cols[cityIdx],
                type: cols[typeIdx],
                lat: parseFloat(cols[latIdx]),
                lng: parseFloat(cols[lngIdx]),
                year: parseInt(cols[yearIdx])
            };
        }).filter(i => i.city && i.type && !isNaN(i.lat) && !isNaN(i.lng) && !isNaN(i.year));
        refreshDashboard();
    };
    reader.readAsText(file);
});

// --- Default Data (for demo) ---
window.onload = function() {
    for (let i = 0; i < 30; i++) incidents.push(randomIncident());
    refreshDashboard();
};