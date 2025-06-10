// Initial map setup
const map = L.map('map').setView([28.6139, 77.2090], 5); // Centered on India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Incident data (simulated)
let incidents = [
    { city: 'Delhi', lat: 28.6139, lng: 77.2090, type: 'Harassment', time: Date.now() - 600000 },
    { city: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Assault', time: Date.now() - 300000 },
    { city: 'Bangalore', lat: 12.9716, lng: 77.5946, type: 'Harassment', time: Date.now() - 120000 },
    { city: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'Assault', time: Date.now() - 60000 },
    { city: 'Kolkata', lat: 22.5726, lng: 88.3639, type: 'Theft', time: Date.now() - 30000 },
    { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, type: 'Theft', time: Date.now() - 180000 },
    { city: 'Pune', lat: 18.5204, lng: 73.8567, type: 'Theft', time: Date.now() - 120000 },
    { city: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'Harassment', time: Date.now() - 90000 },
    { city: 'Lucknow', lat: 26.8467, lng: 80.9462, type: 'Assault', time: Date.now() - 60000 },
    { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, type: 'Harassment', time: Date.now() - 30000 },
    { city: 'Surat', lat: 21.1702, lng: 72.8311, type: 'Assault', time: Date.now() - 180000 },
    {}
];

function addIncidentMarker(incident) {
    const marker = L.marker([incident.lat, incident.lng]).addTo(map);
    marker.bindPopup(`<b>${incident.city}</b><br>${incident.type}<br>${new Date(incident.time).toLocaleTimeString()}`);
}

function renderAllMarkers() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    incidents.forEach(addIncidentMarker);
}

function getStats() {
    const now = Date.now();
    const lastHour = incidents.filter(i => now - i.time < 3600000);
    const byType = lastHour.reduce((acc, i) => {
        acc[i.type] = (acc[i.type] || 0) + 1;
        return acc;
    }, {});
    return {
        total: lastHour.length,
        harassment: byType['Harassment'] || 0,
        assault: byType['Assault'] || 0
    };
}

// Chart.js live chart
let liveChart;
function renderLiveChart() {
    const stats = getStats();
    const ctx = document.getElementById('liveChart').getContext('2d');
    if (liveChart) liveChart.destroy();
    liveChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Harassment', 'Assault'],
            datasets: [{
                data: [stats.harassment, stats.assault],
                backgroundColor: ['#f06292', '#9575cd']
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: `Incidents in Last Hour: ${stats.total}` }
            }
        }
    });
}

// Simulate new incident
function simulateIncident() {
    const cities = [
        { city: 'Delhi', lat: 28.6139, lng: 77.2090 },
        { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        { city: 'Chennai', lat: 13.0827, lng: 80.2707 }
    ];
    const types = ['Harassment', 'Assault'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    incidents.push({ ...city, type, time: Date.now() });
    renderAllMarkers();
    renderLiveChart();
}

document.getElementById('simulateBtn').addEventListener('click', simulateIncident);

// Initial render
renderAllMarkers();
renderLiveChart();

// Auto-update every 30 seconds to simulate real-time
setInterval(() => {
    // Optionally, remove incidents older than 1 hour
    const now = Date.now();
    incidents = incidents.filter(i => now - i.time < 3600000);
    renderAllMarkers();
    renderLiveChart();
}, 30000);