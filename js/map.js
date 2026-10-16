let map;
let markers = {};
let routeLine = null;

function initMap() {
    map = L.map('map', { 
        zoomControl: true,
        maxBoundsViscosity: 1.0, 
        attributionControl: false 
    }).setView([3.5952, 98.6722], 18);

    // Batas gambar diambil dari graph.js agar koordinat node & gambar selalu sinkron
    const imageBounds = IMAGE_BOUNDS;

    const sketsaImage = 'assets/Gambar Sketsa.jpg'; 
    L.imageOverlay(sketsaImage, imageBounds).addTo(map);

    map.setMaxBounds(imageBounds);
    map.setMinZoom(17); 
    map.setMaxZoom(20); 

    // Hanya gambar marker untuk tipe "gedung"
    Object.values(nodes).forEach(node => {
        if (node.type === "gedung") {
            const marker = L.marker([node.lat, node.lng], { bubblingMouseEvents: true }).addTo(map);
            let info = '';
            const daftar = (typeof roomsByBuilding !== 'undefined') ? roomsByBuilding[node.id] : null;
            if (daftar && daftar.length) {
                const lantai = [...new Set(daftar.map(r => r.f))];
                info = `<br><span style="font-size:12px;color:#555">${daftar.length} ruangan, Lantai ${Math.min(...lantai)}\u2013${Math.max(...lantai)}</span>`;
            }
            marker.bindPopup(`<b>${node.name}</b>${info}`);
            markers[node.id] = marker;
        }
    });

    // ====================================================================
    // KLIK PETA -> ambil koordinat/path (panel popup ada di js/path-picker.js)
    // ====================================================================
    map.on('click', pickerKlik2D);
}

function drawRoute(pathIds) {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    if (pathIds.length === 0) return;

    // Gabungkan bentuk jalur tiap ruas (mengikuti jalan pada sketsa),
    // bukan garis lurus antar gedung yang bisa menembus tembok.
    let latlngs = [];
    if (pathIds.length === 1) {
        latlngs = [[nodes[pathIds[0]].lat, nodes[pathIds[0]].lng]];
    }
    for (let i = 0; i < pathIds.length - 1; i++) {
        const segmen = getEdgePath(pathIds[i], pathIds[i + 1]);
        latlngs = latlngs.concat(i === 0 ? segmen : segmen.slice(1));
    }

    routeLine = L.polyline(latlngs, {
        color: '#FF0000', 
        weight: 7,
        opacity: 1,
        lineJoin: 'round',
        lineCap: 'round'
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}