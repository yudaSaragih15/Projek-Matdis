let map;
let markers = {};
let routeLine = null;

function initMap() {
    map = L.map('map', { 
        zoomControl: true,
        maxBoundsViscosity: 1.0, 
        attributionControl: false 
    }).setView([3.5952, 98.6722], 18);

    const imageBounds = [
        [3.5980, 98.6690], 
        [3.5920, 98.6760]  
    ];

    const sketsaImage = 'assets/sketsa benar.jpg'; 
    L.imageOverlay(sketsaImage, imageBounds).addTo(map);

    map.setMaxBounds(imageBounds);
    map.setMinZoom(17); 
    map.setMaxZoom(20); 

    // Hanya gambar marker untuk tipe "gedung"
    Object.values(nodes).forEach(node => {
        if (node.type === "gedung") {
            const marker = L.marker([node.lat, node.lng]).addTo(map);
            marker.bindPopup(`<b>${node.name}</b>`);
            markers[node.id] = marker;
        }
    });

    // ====================================================================
    // FITUR MAGIC: KLIK PETA UNTUK MENDAPATKAN KOORDINAT
    // ====================================================================
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        
        // Tampilkan di Console (Tekan F12 di browser untuk melihat)
        console.log(`Koordinat: lat: ${lat}, lng: ${lng}`);
        
        // Tampilkan juga di layar berupa alert agar mudah disalin
        alert(`Salin angka ini ke graph.js:\n\nlat: ${lat},\nlng: ${lng}`);
    });
}

function drawRoute(pathIds) {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    if (pathIds.length === 0) return;

    const latlngs = pathIds.map(id => [nodes[id].lat, nodes[id].lng]);

    routeLine = L.polyline(latlngs, {
        color: '#FF0000', 
        weight: 7,
        opacity: 1
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}