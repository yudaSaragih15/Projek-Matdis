document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Peta
    initMap();

    // 2. Isi Dropdown dengan data gedung dari graph.js
    const startSelect = document.getElementById('start-node');
    const endSelect = document.getElementById('end-node');

    Object.values(nodes).forEach(node => {
        // HANYA tampilkan node ber-type "gedung" di dropdown
        if (node.type === "gedung") {
            const option1 = new Option(node.name, node.id);
            const option2 = new Option(node.name, node.id);
            startSelect.add(option1);
            endSelect.add(option2);
        }
    });

    // Set nilai default dropdown
    startSelect.value = "gedung_12";
    endSelect.value = "lab_fisika";

    // 3. Handle Tombol Cari Rute
    document.getElementById('find-route-btn').addEventListener('click', () => {
        const startId = startSelect.value;
        const endId = endSelect.value;

        if (startId === endId) {
            alert("Lokasi awal dan tujuan tidak boleh sama!");
            return;
        }

        // Panggil algoritma Dijkstra
        const result = hitungShortestPath(startId, endId, nodes, edges);

        // Tampilkan hasil di UI
        const resultPanel = document.getElementById('result-panel');
        const resultDistance = document.getElementById('result-distance');
        const resultPath = document.getElementById('result-path');

        resultPanel.classList.remove('hidden');
        
        if (result.path.length === 0) {
            resultDistance.innerText = "Rute tidak ditemukan.";
            resultPath.innerHTML = "";
            drawRoute([]); // Hapus garis di peta
        } else {
            resultDistance.innerText = `Total Jarak: ${result.distance} meter`;
            
            resultPath.innerHTML = "";
            result.path.forEach(nodeId => {
                // Hanya tampilkan rute gedung di teks hasil pencarian
                if (nodes[nodeId].type === "gedung") {
                    const li = document.createElement('li');
                    li.innerText = nodes[nodeId].name;
                    resultPath.appendChild(li);
                }
            });

            // Gambar rute di peta (semua node/simpang jalan tetap digambar)
            drawRoute(result.path);
        }
    });
});