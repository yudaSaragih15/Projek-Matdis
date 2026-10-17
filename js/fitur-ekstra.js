// ====================================================================
// FITUR EKSTRA: Mode Jalan Kaki, Print, Share, Estimasi Waktu
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tambahkan UI Mode Navigasi & Fitur Tambahan ke Sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const extraHTML = `
            <div class="form-group" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #cbd5e1;">
                <label class="form-label">Mode Transportasi</label>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="btn-walking" class="neu-button" style="padding: 10px; font-size: 14px; background: #667eea;">
                        🚶 Jalan Kaki
                    </button>
                </div>
                
                <label class="form-label">Fitur Tambahan</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button id="btn-estimate" class="neu-button" style="padding: 10px; font-size: 12px;">⏱️ Estimasi</button>
                    <button id="btn-print" class="neu-button" style="padding: 10px; font-size: 12px;">🖨️ Cetak</button>
                    <button id="btn-share" class="neu-button" style="padding: 10px; font-size: 12px;">🔗 Bagikan</button>
                    <button id="btn-clear" class="neu-button" style="padding: 10px; font-size: 12px; background: #e53e3e;">🗑️ Hapus</button>
                </div>
            </div>
        `;
        sidebar.insertAdjacentHTML('beforeend', extraHTML);

        // 2. Logika Mode Jalan Kaki (Kecepatan rata-rata 1.4 m/detik)
        const walkingSpeed = 1.4; 
        let currentDistance = 0;

        // Kita "mengintip" hasil rute dari main.js dengan membungkus fungsi drawRoute/updateRoute3D
        // Atau lebih aman: kita baca dari result-panel saat tombol diklik
        document.getElementById('btn-estimate').addEventListener('click', () => {
            const distText = document.getElementById('result-distance').textContent;
            const match = distText.match(/\d+/);
            if (match) {
                currentDistance = parseInt(match[0]);
                const timeSeconds = currentDistance / walkingSpeed;
                const minutes = Math.floor(timeSeconds / 60);
                const seconds = Math.floor(timeSeconds % 60);
                alert(`Estimasi Waktu Jalan Kaki:\n\nJarak: ${currentDistance} meter\nWaktu: ${minutes} menit ${seconds} detik\n\n(Catatan: Ini estimasi rata-rata, bisa lebih cepat/lambat tergantung kondisi.)`);
            } else {
                alert('Silakan cari rute terlebih dahulu!');
            }
        });

        // 3. Logika Print Rute
        document.getElementById('btn-print').addEventListener('click', () => {
            const resultPanel = document.getElementById('result-panel');
            if (resultPanel.classList.contains('hidden')) {
                alert('Tidak ada rute untuk dicetak!');
                return;
            }
            const printContent = resultPanel.innerHTML;
            const win = window.open('', '', 'width=800,height=600');
            win.document.write(`
                <html>
                <head><title>Cetak Rute FMIPA</title>
                <style>body { font-family: sans-serif; padding: 20px; } h3 { color: #2d3748; } li { margin: 5px 0; }</style>
                </head>
                <body>
                    <h2>Rute Navigasi FMIPA Unimed</h2>
                    ${printContent}
                </body></html>
            `);
            win.document.close();
            win.print();
        });

        // 4. Logika Share Rute
        document.getElementById('btn-share').addEventListener('click', () => {
            const distText = document.getElementById('result-distance').textContent;
            const pathList = document.getElementById('result-path').innerText;
            if (!distText || distText.includes('tidak ditemukan')) {
                alert('Silakan cari rute terlebih dahulu!');
                return;
            }
            const shareText = `Rute FMIPA Unimed:\n${distText}\n\nJalur:\n${pathList}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Rute FMIPA Unimed',
                    text: shareText,
                    url: window.location.href
                }).catch(err => console.log('Error sharing:', err));
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Rute berhasil disalin ke clipboard!');
                }).catch(() => {
                    prompt('Salin teks berikut:', shareText);
                });
            }
        });

        // 5. Logika Hapus Rute
        document.getElementById('btn-clear').addEventListener('click', () => {
            document.getElementById('result-panel').classList.add('hidden');
            document.getElementById('start-node').value = '';
            document.getElementById('end-node').value = '';
            document.getElementById('start-room').value = '';
            document.getElementById('end-room').value = '';
            
            // Reset peta 2D jika ada
            if (typeof map !== 'undefined' && typeof routeLine !== 'undefined') {
                if (routeLine) map.removeLayer(routeLine);
            }
            alert('Rute telah dihapus.');
        });
    }

    // 6. FUNGSI KHUSUS: Menambahkan Marker Biru di Peta 3D
    // Panggil fungsi ini setelah scene 3D diinisialisasi
    window.tambahMarkerBiru3D = function(scene, nodesData) {
        if (!scene || !nodesData) return;
        
        const markerGeometry = new THREE.SphereGeometry(2, 16, 16); // Bola kecil radius 2
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Warna Biru

        Object.values(nodesData).forEach(node => {
            // Konversi koordinat lat/lng ke posisi 3D (sesuaikan dengan skala peta 3D Anda)
            // Ini contoh sederhana, Anda mungkin perlu menyesuaikan posisi Y (tinggi)
            const x = (node.lng - 98.6725) * 10000; // Skala kasar
            const z = (node.lat - 3.5950) * -10000; 
            const y = 5; // Tinggi marker dari tanah

            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);
            scene.add(marker);
        });
        console.log('Marker biru 3D ditambahkan!');
    };
});