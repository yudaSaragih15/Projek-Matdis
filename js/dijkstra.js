function hitungShortestPath(startId, endId, nodes, edges) {
    // 1. Buat daftar tetangga (Adjacency List)
    const adjList = {};
    Object.keys(nodes).forEach(nodeId => adjList[nodeId] = []);
    
    edges.forEach(edge => {
        // Graf tidak berarah (undirected)
        adjList[edge.from].push({ node: edge.to, weight: edge.weight });
        adjList[edge.to].push({ node: edge.from, weight: edge.weight });
    });

    // 2. Inisialisasi jarak (Infinity) dan rute sebelumnya
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(nodes));

    Object.keys(nodes).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
    });
    distances[startId] = 0;

    // 3. Proses Dijkstra
    while (unvisited.size > 0) {
        let currentNode = null;
        let minDistance = Infinity;
        
        unvisited.forEach(nodeId => {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                currentNode = nodeId;
            }
        });

        if (currentNode === null || currentNode === endId) break;

        unvisited.delete(currentNode);

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

    // 4. Susun rute
    const path = [];
    let current = endId;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    if (distances[endId] === Infinity) {
        return { path: [], distance: 0 };
    }

    return { path: path, distance: distances[endId] };
}