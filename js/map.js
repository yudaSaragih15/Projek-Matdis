let map;
let markers = {};
let routeLine = null;

function initMap() {
    // 1. Inisialisasi peta (Arahkan ke koordinat tengah FMIPA)
    map = L.map('map').setView([3.5952, 98.6722], 18); // Zoom 18 = Sangat dekat

    // 2. Gunakan Citra Satelit Esri (Gratis)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    // Opsional: Tambahkan label nama jalan di atas satelit
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Labels &copy; Esri'
    }).addTo(map);

    // 3. KUNCI PETA AGAR HANYA MENAMPILKAN AREA FMIPA
    // Sesuaikan angka ini dengan luas area FMIPA di peta kamu
    const batasFMIPA = [
        [3.5970, 98.6700], // Batas Kiri Atas (Lat, Lng)
        [3.5930, 98.6750]  // Batas Kanan Bawah (Lat, Lng)
    ];
    map.setMaxBounds(batasFMIPA);
    map.setMinZoom(16); // Mencegah user zoom out terlalu jauh
    map.setMaxZoom(19); // Mencegah user zoom in terlalu dekat

    // 4. Gambar semua titik (Node) ke peta
    Object.values(nodes).forEach(node => {
        const marker = L.marker([node.lat, node.lng]).addTo(map);
        marker.bindPopup(`<b>${node.name}</b>`);
        markers[node.id] = marker;
    });

    // 5. Gambar semua jalur (Edge) sebagai garis kuning putus-putus
    edges.forEach(edge => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        
        L.polyline([
            [fromNode.lat, fromNode.lng],
            [toNode.lat, toNode.lng]
        ], {
            color: '#FFD700', // Kuning Emas (Sangat kontras di atas satelit gelap)
            weight: 5,
            opacity: 1,
            dashArray: '8, 8'
        }).addTo(map);
    });
}

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