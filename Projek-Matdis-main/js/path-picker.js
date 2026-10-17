// ====================================================================
// PENGAMBIL KOORDINAT / PATH  (berlaku di peta 2D dan tampilan 3D)
// --------------------------------------------------------------------
// Klik peta -> titik (x, y) dalam PIKSEL GAMBAR SKETSA ditambahkan ke jalur.
// Format keluarannya sama persis dengan yang dipakai graph.js:
//   path : [[240,360],[242,419],[249,427]]
//   edge : { from: "gedung_12", to: "lab_fisika", path: [[...]] },
//   node : { id: "id_baru", name: "Nama Gedung", x: 240, y: 360 },
// Titik di dekat pintu gedung otomatis "menempel" (snap) ke koordinat node-nya.
// ====================================================================

const PICKER = {
    aktif: true,        // mode ambil koordinat (matikan untuk klik gedung/ruangan di 3D seperti biasa)
    snap: true,         // tempel ke pintu gedung terdekat
    autoSalin: false,   // salin path otomatis tiap klik
    titik: [],          // { x, y, snap: idNode | null }
    layer2d: null, grup3d: null,
    el: {}, bubble: null, bubbleTimer: null
};
const SNAP_RADIUS_PX = 8;   // jarak snap (dalam piksel gambar sketsa)

// ---------- Format teks ----------
function pickerFormatTitik(p) { return `[${p.x}, ${p.y}]`; }
function pickerFormatPath(daftar) { return '[' + daftar.map(p => `[${p.x},${p.y}]`).join(',') + ']'; }
function pickerFormatEdge(daftar) {
    if (!daftar.length) return '';
    const a = daftar[0].snap || 'ID_AWAL';
    const b = daftar[daftar.length - 1].snap || 'ID_TUJUAN';
    return `{ from: "${a}", to: "${b}", path: ${pickerFormatPath(daftar)} },`;
}
function pickerFormatNode(p) {
    return p ? `{ id: "id_baru", name: "Nama Gedung", x: ${p.x}, y: ${p.y} },` : '';
}
function pickerJarakMeter(daftar) {
    let total = 0;
    for (let i = 1; i < daftar.length; i++) {
        total += Math.hypot(daftar[i].x - daftar[i - 1].x, daftar[i].y - daftar[i - 1].y);
    }
    return Math.round(total * METER_PER_PIXEL);
}

// ---------- Logika titik ----------
function pickerCariSnap(x, y) {
    if (!PICKER.snap) return null;
    let terbaik = null, jarak = SNAP_RADIUS_PX;
    nodeData.forEach(n => {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d <= jarak) { jarak = d; terbaik = n; }
    });
    return terbaik;
}

// x, y = piksel gambar (boleh desimal). clientX/Y dipakai hanya untuk menaruh gelembung info.
function pickerTambah(xMentah, yMentah, clientX, clientY) {
    if (!PICKER.aktif) return;
    if (xMentah < 0 || yMentah < 0 || xMentah > IMG_WIDTH || yMentah > IMG_HEIGHT) {
        pickerGelembung('Di luar area sketsa', clientX, clientY);
        return;
    }
    let x = Math.round(xMentah), y = Math.round(yMentah), snap = null;
    const n = pickerCariSnap(x, y);
    if (n) { x = n.x; y = n.y; snap = n.id; }
    const p = { x: x, y: y, snap: snap };
    PICKER.titik.push(p);
    console.log('Titik #' + PICKER.titik.length + ': ' + pickerFormatTitik(p) + (snap ? '  (pintu ' + snap + ')' : ''));
    pickerGelembung(pickerFormatTitik(p) + (snap ? '<br><span style="opacity:.8">pintu: ' + snap + '</span>' : ''), clientX, clientY);
    pickerPerbarui();
    if (PICKER.autoSalin) pickerSalin(pickerFormatPath(PICKER.titik));
}

function pickerUrungkan() { PICKER.titik.pop(); pickerPerbarui(); }
function pickerHapus() { PICKER.titik.length = 0; pickerPerbarui(); }

// Klik pada peta 2D (dipanggil dari map.js). Latlng -> piksel gambar.
function pickerKlik2D(e) {
    if (!PICKER.aktif) return;
    const b = IMAGE_BOUNDS;
    const x = (e.latlng.lng - b[0][1]) / (b[1][1] - b[0][1]) * IMG_WIDTH;
    const y = (e.latlng.lat - b[0][0]) / (b[1][0] - b[0][0]) * IMG_HEIGHT;
    const oe = e.originalEvent || {};
    pickerTambah(x, y, oe.clientX, oe.clientY);
}

// ---------- Clipboard ----------
function pickerSalin(teks, tombol) {
    const hasil = ok => {
        if (!tombol) return;
        const asli = tombol.dataset.label || tombol.textContent;
        tombol.dataset.label = asli;
        tombol.textContent = ok ? 'Tersalin \u2713' : 'Gagal';
        setTimeout(() => { tombol.textContent = asli; }, 1200);
    };
    const cadangan = () => {
        const ta = document.createElement('textarea');
        ta.value = teks; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        hasil(ok);
    };
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(teks).then(() => hasil(true), cadangan);
    } else {
        cadangan();
    }
}

// ---------- Gelembung info di dekat klik ----------
function pickerGelembung(html, clientX, clientY) {
    if (!PICKER.bubble || clientX === undefined) return;
    const induk = PICKER.bubble.parentElement.getBoundingClientRect();
    const b = PICKER.bubble;
    b.innerHTML = html;
    b.style.display = 'block';
    b.style.left = Math.max(4, Math.min(clientX - induk.left + 12, induk.width - 150)) + 'px';
    b.style.top = Math.max(4, Math.min(clientY - induk.top + 12, induk.height - 50)) + 'px';
    clearTimeout(PICKER.bubbleTimer);
    PICKER.bubbleTimer = setTimeout(() => { b.style.display = 'none'; }, 2200);
}

// ---------- Gambar jalur sementara di peta 2D ----------
function pickerGambar2D() {
    if (typeof map === 'undefined' || !map || typeof L === 'undefined') return;
    if (!PICKER.layer2d) PICKER.layer2d = L.layerGroup().addTo(map);
    const lg = PICKER.layer2d;
    lg.clearLayers();
    const ll = PICKER.titik.map(p => pxToLatLng(p.x, p.y));
    if (ll.length > 1) {
        L.polyline(ll, { color: '#0ea5e9', weight: 4, dashArray: '8 6', interactive: false }).addTo(lg);
    }
    ll.forEach((c, i) => {
        const akhir = i === ll.length - 1;
        L.circleMarker(c, {
            radius: akhir ? 6 : 4, color: '#0369a1', weight: 2, fillOpacity: 1, interactive: false,
            fillColor: i === 0 ? '#22c55e' : (akhir ? '#f59e0b' : '#ffffff')
        }).addTo(lg);
    });
}

// ---------- Gambar jalur sementara di tampilan 3D ----------
function pickerGambar3D() {
    if (typeof V3 === 'undefined' || !V3.sceneReady) return;
    if (!PICKER.grup3d) { PICKER.grup3d = new THREE.Group(); V3.scene.add(PICKER.grup3d); }
    const g = PICKER.grup3d;
    while (g.children.length) {
        const m = g.children.pop();
        if (m.geometry) m.geometry.dispose();
        if (m.material) m.material.dispose();
    }
    const T = PICKER.titik, atas = new THREE.Vector3(0, 1, 0);
    const mat = hex => new THREE.MeshBasicMaterial({ color: hex, depthTest: false, transparent: true, opacity: 0.95 });
    T.forEach((p, i) => {
        const pos = dunia(p.x, p.y, 3.5);
        const akhir = i === T.length - 1;
        const bola = new THREE.Mesh(new THREE.SphereGeometry(akhir ? 3.6 : 2.7, 14, 10),
            mat(i === 0 ? 0x22c55e : (akhir ? 0xf59e0b : 0xffffff)));
        bola.position.copy(pos); bola.renderOrder = 999; g.add(bola);
        if (i === 0) return;
        const a = dunia(T[i - 1].x, T[i - 1].y, 3.5), dir = new THREE.Vector3().subVectors(pos, a), len = dir.length();
        if (len < 0.01) return;
        dir.normalize();
        const sil = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, len, 8), mat(0x0ea5e9));
        sil.position.copy(a).addScaledVector(dir, len / 2);
        sil.quaternion.setFromUnitVectors(atas, dir);
        sil.renderOrder = 998; g.add(sil);
    });
}

// Dipasang dari init3D() (map3d.js) setelah renderer & scene siap
function pickerPasang3D() {
    const el = V3.renderer.domElement;
    const ray = new THREE.Raycaster(), m = new THREE.Vector2();
    const tanah = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hasil = new THREE.Vector3();
    let bawah = null;
    el.addEventListener('pointerdown', ev => { bawah = ev.button === 0 ? { x: ev.clientX, y: ev.clientY } : null; });
    el.addEventListener('pointerup', ev => {
        const b = bawah; bawah = null;
        if (!PICKER.aktif || !b || ev.button !== 0) return;
        if (Math.hypot(ev.clientX - b.x, ev.clientY - b.y) > 5) return;   // geseran kamera, bukan klik
        const r = el.getBoundingClientRect();
        m.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(m, V3.camera);
        if (!ray.ray.intersectPlane(tanah, hasil)) return;
        pickerTambah(hasil.x + IMG_WIDTH / 2, hasil.z + IMG_HEIGHT / 2, ev.clientX, ev.clientY);
    });
    pickerGambar3D();
}

// ---------- Panel popup ----------
function pickerPerbarui() {
    const e = PICKER.el, T = PICKER.titik;
    if (e.last) {
        e.last.textContent = T.length ? pickerFormatTitik(T[T.length - 1]) : 'belum ada';
        e.path.value = pickerFormatPath(T);
        e.path.scrollTop = e.path.scrollHeight;
        e.info.textContent = T.length ? `${T.length} titik \u2248 ${pickerJarakMeter(T)} m` : '';
    }
    pickerGambar2D();
    pickerGambar3D();
}

function pickerBuatPanel() {
    const induk = document.getElementById('map').parentElement;
    const css = document.createElement('style');
    css.textContent = `
        #picker-panel{position:absolute;top:52px;right:12px;width:292px;z-index:1200;background:rgba(255,255,255,.97);
            border:1px solid #cbd5e1;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.25);
            font:12px/1.45 system-ui,Arial,sans-serif;color:#1e293b;max-height:calc(100% - 64px);overflow:auto}
        #picker-panel .pk-head{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;
            background:#0f172a;color:#fff;border-radius:10px 10px 0 0;font-weight:700;position:sticky;top:0}
        #picker-panel .pk-head label{font-weight:400;margin-right:6px;cursor:pointer}
        #picker-panel .pk-body{padding:9px 10px;display:flex;flex-direction:column;gap:7px}
        #picker-panel .pk-row{display:flex;align-items:center;justify-content:space-between;gap:6px}
        #picker-panel .pk-muted{color:#64748b}
        #picker-panel code{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:2px 6px;font-size:12px}
        #picker-panel textarea{width:100%;font:11px/1.35 ui-monospace,Consolas,monospace;border:1px solid #cbd5e1;
            border-radius:6px;padding:5px;resize:vertical;background:#f8fafc}
        #picker-panel .pk-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
        #picker-panel button{font:600 12px system-ui,Arial,sans-serif;border:1px solid #cbd5e1;border-radius:6px;
            padding:5px 8px;background:#fff;color:#1e293b;cursor:pointer}
        #picker-panel button:hover{background:#e2e8f0}
        #picker-panel button.pk-utama{background:#2563eb;border-color:#2563eb;color:#fff}
        #picker-panel button.pk-utama:hover{background:#1d4ed8}
        #picker-panel button.pk-bahaya{color:#b91c1c}
        #picker-panel label{cursor:pointer}
        #picker-bubble{position:absolute;display:none;z-index:1150;pointer-events:none;background:rgba(15,23,42,.94);
            color:#fff;font:600 12px/1.4 ui-monospace,Consolas,monospace;padding:5px 9px;border-radius:6px}
        body.picker-on #map, body.picker-on #map *{cursor:crosshair !important}
    `;
    document.head.appendChild(css);

    const p = document.createElement('div');
    p.id = 'picker-panel';
    p.innerHTML = `
        <div class="pk-head">
            <span>Ambil Koordinat / Path</span>
            <span><label><input type="checkbox" id="pk-aktif" checked> Aktif</label>
            <button id="pk-lipat" title="Ciutkan / buka" style="padding:0 7px">\u2013</button></span>
        </div>
        <div class="pk-body" id="pk-body">
            <div class="pk-muted">Klik peta (2D atau 3D) untuk menambah titik. Titik dekat pintu gedung otomatis menempel ke node.
                Matikan <b>Aktif</b> bila ingin klik gedung/ruangan di 3D seperti biasa.</div>
            <div class="pk-row"><span>Titik terakhir <code id="pk-last">belum ada</code></span>
                <button id="pk-salin-titik">Salin</button></div>
            <div class="pk-row"><b>Path</b><span class="pk-muted" id="pk-info"></span></div>
            <textarea id="pk-path" rows="4" readonly placeholder="[[x,y],[x,y],...]"></textarea>
            <div class="pk-grid">
                <button id="pk-salin-path" class="pk-utama">Salin Path</button>
                <button id="pk-salin-edge">Salin Edge</button>
                <button id="pk-salin-node">Salin Node</button>
                <button id="pk-urung">Urungkan</button>
            </div>
            <button id="pk-hapus" class="pk-bahaya">Hapus semua titik</button>
            <label><input type="checkbox" id="pk-snap" checked> Tempel ke pintu gedung (snap)</label>
            <label><input type="checkbox" id="pk-auto"> Salin path otomatis tiap klik</label>
        </div>`;
    induk.appendChild(p);

    const b = document.createElement('div');
    b.id = 'picker-bubble';
    induk.appendChild(b);
    PICKER.bubble = b;

    const $ = id => document.getElementById(id);
    PICKER.el = { last: $('pk-last'), path: $('pk-path'), info: $('pk-info') };

    const setAktif = on => {
        PICKER.aktif = on;
        document.body.classList.toggle('picker-on', on);
        if (!on && PICKER.bubble) PICKER.bubble.style.display = 'none';
    };
    $('pk-aktif').addEventListener('change', e => setAktif(e.target.checked));
    $('pk-snap').addEventListener('change', e => { PICKER.snap = e.target.checked; });
    $('pk-auto').addEventListener('change', e => { PICKER.autoSalin = e.target.checked; });
    $('pk-lipat').addEventListener('click', e => {
        const body = $('pk-body');
        const tutup = body.style.display !== 'none';
        body.style.display = tutup ? 'none' : 'flex';
        e.currentTarget.textContent = tutup ? '+' : '\u2013';
    });
    $('pk-salin-titik').addEventListener('click', e => {
        const T = PICKER.titik;
        if (T.length) pickerSalin(pickerFormatTitik(T[T.length - 1]), e.currentTarget);
    });
    $('pk-salin-path').addEventListener('click', e => pickerSalin(pickerFormatPath(PICKER.titik), e.currentTarget));
    $('pk-salin-edge').addEventListener('click', e => pickerSalin(pickerFormatEdge(PICKER.titik), e.currentTarget));
    $('pk-salin-node').addEventListener('click', e => {
        const T = PICKER.titik;
        if (T.length) pickerSalin(pickerFormatNode(T[T.length - 1]), e.currentTarget);
    });
    $('pk-urung').addEventListener('click', pickerUrungkan);
    $('pk-hapus').addEventListener('click', pickerHapus);
    $('pk-path').addEventListener('focus', e => e.target.select());

    // Ctrl+Z = urungkan titik terakhir (kecuali sedang mengetik di kolom input)
    document.addEventListener('keydown', ev => {
        const tag = (ev.target && ev.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z' && PICKER.aktif) {
            ev.preventDefault(); pickerUrungkan();
        }
    });

    setAktif(true);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', pickerBuatPanel);
}
