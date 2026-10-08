let map;
let markers = {};
let routeLine = null;

function initMap() {
    // 1. Inisialisasi peta
    // Angka [3.5952, 98.6722] adalah titik tengah awal peta. 
    // Kamu bisa menggantinya dengan koordinat tengah area FMIPA.
    map = L.map('map').setView([3.5952, 98.6722], 18);

    // ====================================================================
    // 2. PENGATURAN GAMBAR SKETSA (BAGIAN PALING PENTING)
    // ====================================================================
    // Kamu HARUS menyesuaikan 4 angka di bawah ini agar gambar sketsamu 
    // pas dan tidak gepeng di layar. 
    // Format: [ [Lat Kiri Atas, Lng Kiri Atas], [Lat Kanan Bawah, Lng Kanan Bawah] ]
    const imageBounds = [
        [3.5980, 98.6690], // <-- Ganti dengan angka Kiri Atas
        [3.5920, 98.6760]  // <-- Ganti dengan angka Kanan Bawah
    ];

    // 3. Path (lokasi) file gambar sketsamu
    // Jika kamu menyimpannya di dalam folder 'assets', tulis 'assets/sketsa-fmipa.png'
    // Jika kamu menyimpannya langsung di folder utama, tulis 'sketsa-fmipa.png'
    const sketsaImage = 'assets/Gambar Sketsa.jpg'; // <-- Sesuaikan dengan nama file & foldermu

    // 4. Masukkan gambar ke dalam peta
    L.imageOverlay(sketsaImage, imageBounds).addTo(map);

    // 5. Kunci peta agar hanya menampilkan area gambar sketsa saja
    map.setMaxBounds(imageBounds);
    map.setMinZoom(16); // Mencegah user zoom out terlalu jauh
    map.setMaxZoom(20); // Mencegah user zoom in terlalu dekat

    // ====================================================================
    // 6. MENGGAMBAR TITIK (NODE) DARI FILE graph.js
    // ====================================================================
    Object.values(nodes).forEach(node => {
        const marker = L.marker([node.lat, node.lng]).addTo(map);
        marker.bindPopup(`<b>${node.name}</b>`);
        markers[node.id] = marker;
    });

    // ====================================================================
    // 7. MENGGAMBAR JALUR (EDGE) DARI FILE graph.js
    // ====================================================================
    edges.forEach(edge => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        
        L.polyline([
            [fromNode.lat, fromNode.lng],
            [toNode.lat, toNode.lng]
        ], {
            color: '#FFD700', // Warna Kuning Emas
            weight: 5,        // Ketebalan garis
            opacity: 1,
            dashArray: '8, 8' // Membuat garis putus-putus
        }).addTo(map);
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

    // Buat array koordinat dari rute yang ditemukan
    const latlngs = pathIds.map(id => [nodes[id].lat, nodes[id].lng]);

    // Gambar garis rute berwarna Merah Menyala
    routeLine = L.polyline(latlngs, {
        color: '#FF0000', // Merah
        weight: 7,
        opacity: 1
    }).addTo(map);

    // Zoom peta agar semua rute terlihat
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}