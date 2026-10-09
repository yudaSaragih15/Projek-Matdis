let map;
let markers = {};
let routeLine = null;

function initMap() {
    // 1. Inisialisasi peta
    map = L.map('map', { 
        zoomControl: true,
        maxBoundsViscosity: 1.0, 
        attributionControl: false 
    }).setView([3.5952, 98.6722], 18);

    // ====================================================================
    // 2. PENGATURAN GAMBAR SKETSA
    // ====================================================================
    // ATUR ANGKA INI AGAR GAMBAR PAS DAN TIDAK GEPENG
    const imageBounds = [
        [3.5980, 98.6690], // Kiri Atas
        [3.5920, 98.6760]  // Kanan Bawah
    ];

    // Path file gambar (sesuaikan dengan nama file di VS Code kamu)
    // Contoh: 'assets/Gambar Sketsa.jpg' atau 'assets/sketsa benar.jpg'
    const sketsaImage = 'assets/sketsa benar.jpg'; 

    // 3. Masukkan gambar ke dalam peta
    L.imageOverlay(sketsaImage, imageBounds).addTo(map);

    // 4. Kunci peta agar hanya menampilkan area gambar sketsa saja
    map.setMaxBounds(imageBounds);
    map.setMinZoom(17); 
    map.setMaxZoom(20); 

    // ====================================================================
    // 5. MENGGAMBAR TITIK (HANYA TIPE "GEDUNG")
    // ====================================================================
    Object.values(nodes).forEach(node => {
        if (node.type === "gedung") {
            const marker = L.marker([node.lat, node.lng]).addTo(map);
            marker.bindPopup(`<b>${node.name}</b>`);
            markers[node.id] = marker;
        }
    });

    // ====================================================================
    // 6. FITUR KLIK PETA UNTUK MENDAPATKAN KOORDINAT
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

// ====================================================================
// FUNGSI UNTUK MENGGAMBAR RUTE TERPENDEK (GARIS MERAH)
// ====================================================================
function drawRoute(pathIds) {
    // Hapus garis rute sebelumnya jika ada
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    if (pathIds.length === 0) return;

    // --- PENGAMAN: Filter ID yang tidak valid ---
    // Hanya ambil ID yang benar-benar ada di dalam objek 'nodes'
    const latlngs = pathIds
        .filter(id => nodes[id]) 
        .map(id => [nodes[id].lat, nodes[id].lng]);
    // -------------------------------------------

    // Butuh minimal 2 titik untuk bisa menggambar garis
    if (latlngs.length < 2) return; 

    // Gambar garis rute berwarna Merah Menyala
    routeLine = L.polyline(latlngs, {
        color: '#FF0000', 
        weight: 7,
        opacity: 1
    }).addTo(map);

    // Zoom peta agar semua rute terlihat
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}