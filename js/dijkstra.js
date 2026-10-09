// ====================================================================
// ALGORITMA DIJKSTRA - PENCARIAN RUTE TERPENDEK
// ====================================================================
function hitungShortestPath(startId, endId, nodes, edges) {
    // 1. Buat daftar tetangga (Adjacency List)
    const adjList = {};
    Object.keys(nodes).forEach(nodeId => adjList[nodeId] = []);
    
    // 2. Isi daftar tetangga dari data edges
    edges.forEach(edge => {
        // --- PENGAMAN: Cek apakah node asal dan tujuan ada di dalam 'nodes' ---
        // Jika tidak ada (salah ketik ID), lewati edge ini agar tidak error
        if (!nodes[edge.from] || !nodes[edge.to]) {
            console.warn(`Edge tidak valid diabaikan: ${edge.from} -> ${edge.to}`);
            return; 
        }
        // ---------------------------------------------------------------------

        // Karena jalur bisa dua arah (undirected), kita tambahkan kedua arah
        adjList[edge.from].push({ node: edge.to, weight: edge.weight });
        adjList[edge.to].push({ node: edge.from, weight: edge.weight });
    });

    // 3. Inisialisasi jarak (Infinity) dan rute sebelumnya
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(nodes));

    Object.keys(nodes).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
    });
    distances[startId] = 0;

    // 4. Proses Utama Dijkstra
    while (unvisited.size > 0) {
        // Cari node dengan jarak terkecil yang belum dikunjungi
        let currentNode = null;
        let minDistance = Infinity;
        
        unvisited.forEach(nodeId => {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                currentNode = nodeId;
            }
        });

        // Jika tidak ada jalan atau sudah sampai tujuan
        if (currentNode === null || currentNode === endId) break;

        unvisited.delete(currentNode);

        // Update jarak ke tetangga
        adjList[currentNode].forEach(neighbor => {
            if (unvisited.has(neighbor.node)) {
                const newDistance = distances[currentNode] + neighbor.weight;
                if (newDistance < distances[neighbor.node]) {
                    distances[neighbor.node] = newDistance;
                    previous[neighbor.node] = currentNode;
                }
            }
        });
    }

    // 5. Susun rute dari start ke end
    const path = [];
    let current = endId;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    // Jika rute tidak ditemukan
    if (distances[endId] === Infinity) {
        return { path: [], distance: 0 };
    }

    return { path: path, distance: distances[endId] };
}