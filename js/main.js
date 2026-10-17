document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // LOGIKA SMART SIDEBAR TOGGLE (FIXED)
    // ==========================================
    const sidebar = document.getElementById('sidebar');
    const tabOpener = document.getElementById('tab-opener');
    const btnClose = document.getElementById('btn-close-sidebar');
    
    // Fungsi Buka Sidebar
    function openSidebar() {
        sidebar.classList.remove('collapsed');
        setTimeout(() => {
            if (typeof map !== 'undefined' && map) map.invalidateSize();
        }, 400);
    }

    // Fungsi Tutup Sidebar
    function closeSidebar() {
        sidebar.classList.add('collapsed');
        setTimeout(() => {
            if (typeof map !== 'undefined' && map) map.invalidateSize();
        }, 400);
    }

    // Event: Klik Tab di kiri (untuk membuka)
    tabOpener.addEventListener('click', (e) => {
        e.stopPropagation();
        openSidebar();
    });

    // Event: Klik Tombol X (untuk menutup)
    btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
    });

    // Opsional: Klik area peta (map-container) juga bisa menutup sidebar jika terbuka
    // document.querySelector('.map-container').addEventListener('click', () => {
    //     if (!sidebar.classList.contains('collapsed')) closeSidebar();
    // });

    // 1. Inisialisasi Peta
    initMap();
    pasangTombol3D();

    // 2. Isi dropdown gedung dari graph.js
    const startSelect = document.getElementById('start-node');
    const endSelect = document.getElementById('end-node');
    const startRoom = document.getElementById('start-room');
    const endRoom = document.getElementById('end-room');

    Object.values(nodes).forEach(node => {
        if (node.type === "gedung") {
            startSelect.add(new Option(node.name, node.id));
            endSelect.add(new Option(node.name, node.id));
        }
    });
    startSelect.value = "gedung_12";
    endSelect.value = "lab_fisika";

    // 3. Isi dropdown ruangan sesuai gedung yang dipilih
    function isiRuangan(gedungSelect, roomSelect) {
        const daftar = roomsByBuilding[gedungSelect.value] || [];
        roomSelect.innerHTML = "";
        if (daftar.length === 0) {
            roomSelect.add(new Option("Belum ada data ruangan", ""));
            roomSelect.disabled = true;
            return;
        }
        roomSelect.disabled = false;
        roomSelect.add(new Option("\u2014 Pintu masuk gedung \u2014", ""));
        let grup = null, lantaiSekarang = null;
        daftar.forEach(r => {
            if (r.f !== lantaiSekarang) {
                lantaiSekarang = r.f;
                grup = document.createElement('optgroup');
                grup.label = "Lantai " + r.f;
                roomSelect.appendChild(grup);
            }
            grup.appendChild(new Option(labelRuang(r), r.id));
        });
    }

    startSelect.addEventListener('change', () => isiRuangan(startSelect, startRoom));
    endSelect.addEventListener('change', () => isiRuangan(endSelect, endRoom));
    isiRuangan(startSelect, startRoom);
    isiRuangan(endSelect, endRoom);

    // 4. Pencarian ruangan (datalist)
    const datalist = document.getElementById('daftar-ruangan');
    const teksRuang = {};
    rooms.forEach(r => {
        const teks = labelRuang(r) + "  (" + nodes[r.b].name + ", Lt " + r.f + ")";
        teksRuang[teks] = r;
        const opt = document.createElement('option');
        opt.value = teks;
        datalist.appendChild(opt);
    });

    function pasangPencarian(inputId, gedungSelect, roomSelect) {
        const input = document.getElementById(inputId);
        input.addEventListener('change', () => {
            const r = teksRuang[input.value];
            if (!r) return;
            gedungSelect.value = r.b;
            isiRuangan(gedungSelect, roomSelect);
            roomSelect.value = String(r.id);
            input.value = "";
        });
    }

    window.pilihRuanganTujuan = function (id) {
        const r = rooms[id];
        endSelect.value = r.b; isiRuangan(endSelect, endRoom); endRoom.value = String(r.id);
        // Opsional: Buka sidebar otomatis jika user klik ruangan di peta
        openSidebar(); 
    };
    window.pilihRuanganAwal = function (id) {
        const r = rooms[id];
        startSelect.value = r.b; isiRuangan(startSelect, startRoom); startRoom.value = String(r.id);
        openSidebar();
    };
    pasangPencarian('start-search', startSelect, startRoom);
    pasangPencarian('end-search', endSelect, endRoom);

    // FITUR SWAP
    document.getElementById('swap-locations').addEventListener('click', (e) => {
        e.stopPropagation(); 
        const tempGedung = startSelect.value;
        startSelect.value = endSelect.value;
        endSelect.value = tempGedung;

        isiRuangan(startSelect, startRoom);
        isiRuangan(endSelect, endRoom);

        const tempRoomStart = startRoom.value;
        const tempRoomEnd = endRoom.value;
        
        startRoom.value = (tempRoomEnd && [...endRoom.options].some(o => o.value === tempRoomEnd)) 
                          ? tempRoomEnd : "";
        endRoom.value = (tempRoomStart && [...startRoom.options].some(o => o.value === tempRoomStart)) 
                        ? tempRoomStart : "";
                        
        document.getElementById('start-search').value = "";
        document.getElementById('end-search').value = "";
    });

    // 5. Tombol Cari Rute
    document.getElementById('find-route-btn').addEventListener('click', (e) => {
        e.stopPropagation(); 
        const startId = startSelect.value;
        const endId = endSelect.value;
        const rAwal = startRoom.value !== "" ? rooms[Number(startRoom.value)] : null;
        const rAkhir = endRoom.value !== "" ? rooms[Number(endRoom.value)] : null;

        const resultPanel = document.getElementById('result-panel');
        const resultDistance = document.getElementById('result-distance');
        const resultDetail = document.getElementById('result-detail');
        const resultPath = document.getElementById('result-path');
        
        resultPanel.classList.remove('hidden');
        resultPath.innerHTML = "";

        function tambahLangkah(teks) {
            const li = document.createElement('li');
            li.textContent = teks;
            resultPath.appendChild(li);
        }

        if (startId === endId) {
            if (!rAwal || !rAkhir || rAwal.id === rAkhir.id) {
                resultPanel.classList.add('hidden');
                alert("Lokasi awal dan tujuan tidak boleh sama! Untuk satu gedung, pilih dua ruangan yang berbeda.");
                return;
            }
            const dalam = jarakAntarRuang(rAwal, rAkhir);
            resultDistance.textContent = `Total ≈ ${dalam} meter (di dalam gedung)`;
            resultDetail.textContent = "Jarak di dalam gedung adalah perkiraan.";
            tambahLangkah(`Mulai: ${labelRuang(rAwal)} (Lantai ${rAwal.f})`);
            if (rAwal.f !== rAkhir.f) {
                tambahLangkah(`${rAkhir.f > rAwal.f ? "Naik" : "Turun"} ke Lantai ${rAkhir.f} lewat tangga`);
            }
            tambahLangkah(`Tiba: ${labelRuang(rAkhir)} (Lantai ${rAkhir.f})`);
            drawRoute([]);
            updateRoute3D([], rAwal, rAkhir);
            return;
        }

        const result = hitungShortestPath(startId, endId, nodes, edges);

        if (result.path.length === 0) {
            resultDistance.textContent = "Rute tidak ditemukan.";
            resultDetail.textContent = "";
            drawRoute([]);
            updateRoute3D([]);
            return;
        }

        const dalamAwal = jarakDalamGedung(rAwal);
        const dalamAkhir = jarakDalamGedung(rAkhir);
        const total = result.distance + dalamAwal + dalamAkhir;
        
        resultDistance.textContent = `Total ≈ ${total} meter`;
        resultDetail.textContent = `Di luar gedung ${result.distance} m (mengikuti jalan) + di dalam gedung ≈ ${dalamAwal + dalamAkhir} m (perkiraan)`;

        if (rAwal) {
            tambahLangkah(`Mulai: ${labelRuang(rAwal)} (Lantai ${rAwal.f})` + (rAwal.f > 1 ? ", turun ke Lantai 1" : ""));
        }
        result.path.forEach(nodeId => {
            if (nodes[nodeId].type === "gedung") tambahLangkah(nodes[nodeId].name);
        });
        if (rAkhir) {
            tambahLangkah(`Tiba: ${labelRuang(rAkhir)}` + (rAkhir.f > 1 ? ` (naik ke Lantai ${rAkhir.f})` : " (Lantai 1)"));
        }

        drawRoute(result.path);
        updateRoute3D(result.path, rAwal, rAkhir);
    });
});