let map;
let markers = {};
let routeLine = null;

function initMap() {
    map = L.map('map', { 
        zoomControl: true,
        maxBoundsViscosity: 1.0, 
        attributionControl: false 
    }).setView([3.5952, 98.6722], 18);

    const imageBounds = IMAGE_BOUNDS;
    const sketsaImage = 'assets/Gambar Sketsa.jpg'; 
    L.imageOverlay(sketsaImage, imageBounds).addTo(map);
    map.setMaxBounds(imageBounds);
    map.setMinZoom(17); 
    map.setMaxZoom(20); 

    // Buat marker untuk setiap gedung dengan popup berisi foto
    Object.values(nodes).forEach(node => {
        if (node.type === "gedung") {
            const marker = L.marker([node.lat, node.lng], { bubblingMouseEvents: true }).addTo(map);
            
            // Ambil daftar ruangan untuk gedung ini
            const daftar = (typeof roomsByBuilding !== 'undefined') ? roomsByBuilding[node.id] : null;
            
            // Cari foto pertama yang tersedia dari daftar ruangan
            let fotoUrl = null;
            let fotoDesc = "";
            if (daftar && daftar.length) {
                const lantai = [...new Set(daftar.map(r => r.f))];
                const minLantai = Math.min(...lantai);
                const maxLantai = Math.max(...lantai);
                const jumlahRuangan = daftar.length;
                
                // Cari ruangan pertama yang punya properti gambar
                const roomWithPhoto = daftar.find(r => r.image || r.img || r.photo);
                if (roomWithPhoto) {
                    fotoUrl = roomWithPhoto.image || roomWithPhoto.img || roomWithPhoto.photo;
                    fotoDesc = `${labelRuang(roomWithPhoto)} (Lt ${roomWithPhoto.f})`;
                } else {
                    // Jika tidak ada foto, pakai info umum
                    fotoDesc = `${jumlahRuangan} ruangan, Lantai ${minLantai}\u2013${maxLantai}`;
                }
            }

            // Buat konten popup dengan foto (jika ada) + teks
            let popupContent = `<div class="marker-popup-content">`;
            
            if (fotoUrl) {
                popupContent += `
                    <div class="popup-photo-container">
                        <img src="${fotoUrl}" alt="${node.name}" class="popup-photo" onerror="this.parentElement.style.display='none'">
                    </div>
                `;
            }
            
            popupContent += `
                <div class="popup-text">
                    <strong>${node.name}</strong><br>
                    <span style="font-size:12px;color:#555">${fotoDesc}</span>
                </div>
            </div>`;
            
            marker.bindPopup(popupContent, {
                maxWidth: 280,
                className: 'custom-marker-popup'
            });
            
            markers[node.id] = marker;
        }
    });

    map.on('click', pickerKlik2D);
}

function drawRoute(pathIds) {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    if (pathIds.length === 0) return;

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