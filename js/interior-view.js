// ====================================================================
// TAMPILAN DALAM GEDUNG (potongan per lantai)
// Klik gedung yang punya data ruangan -> atap terangkat dan tiap lantai
// terpisah. Ruangan tampil sebagai kotak berwarna; arahkan kursor untuk
// melihat nama, klik untuk menjadikannya tujuan (Shift+klik = titik awal).
// Letak ruangan di dalam lantai bersifat SKEMATIS (data: js/interior3d.js).
// ====================================================================

const GAP_LANTAI = 16;      // jarak antar lantai saat gedung dibuka
const TINGGI_RUANG = 5.2;   // tinggi kotak ruangan
const WARNA_RUANG = {
    toilet: 0x7fb7e6, musholla: 0xc9a6e4, baca: 0xf0b6c6, kantin: 0xf4c06a,
    servis: 0xb9b9b9, kantor: 0xe2c48f, lab: 0x8fd19e, umum: 0xe8e2d4
};
const KETERANGAN_WARNA = [
    ['Laboratorium', '#8fd19e'], ['Kantor / Laboran', '#e2c48f'], ['Toilet', '#7fb7e6'],
    ['Musholla', '#c9a6e4'], ['Perpustakaan / Baca', '#f0b6c6'], ['Gudang / Servis', '#b9b9b9']
];

const INT = {
    gedung: {},          // id gedung -> status buka/tutup & isi lantai
    aktif: null,         // gedung yang terakhir dibuka
    lantaiFokus: null,   // null = semua lantai
    meshByRoom: {},      // id ruangan -> mesh kotak ruangan
    sorot: [],           // sprite penanda ruangan awal/tujuan
    tip: null, toastSampai: 0
};

// ---------- Geometri ----------
function dindingGeo(poly, tinggi) {
    const pos = [], uv = [], idx = [];
    let u0 = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        const A = dunia(a[0], a[1], 0), B = dunia(b[0], b[1], 0);
        const u1 = u0 + Math.hypot(b[0] - a[0], b[1] - a[1]) / 16;
        const n = pos.length / 3;
        pos.push(A.x, 0, A.z, B.x, 0, B.z, B.x, tinggi, B.z, A.x, tinggi, A.z);
        uv.push(u0, 0, u1, 0, u1, 1, u0, 1);
        idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
        u0 = u1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
}

function buatAtapBagian(b) {
    const g = new THREE.Group();
    const y0 = 0;
    if (b.roof === 'hip') {
        const m = new THREE.Mesh(buatAtapLimas(skalakanPoly(b.poly, 1.03), y0, 10),
            new THREE.MeshStandardMaterial({ color: 0xb9633f, roughness: 0.75, side: THREE.DoubleSide, flatShading: true }));
        m.castShadow = true; g.add(m);
    } else {
        const m = new THREE.Mesh(extrudePoly(skalakanPoly(b.poly, 0.97), 1.6, y0),
            new THREE.MeshStandardMaterial({ color: 0x8b9099, roughness: 0.8 }));
        m.castShadow = true; g.add(m);
    }
    return g;
}

function buatLantai(node, d, f, bagian) {
    const g = new THREE.Group();
    const dinding = [], label = [];

    bagian.forEach(b => {
        const plat = new THREE.Mesh(extrudePoly(b.poly, 1.0, 0), new THREE.MeshStandardMaterial({ color: 0xd9d5cc, roughness: 0.95 }));
        plat.receiveShadow = true; plat.castShadow = true;
        g.add(plat);

        const tex = V3.teksJendela.clone();
        tex.needsUpdate = true;
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(b.color), map: tex, roughness: 0.85, side: THREE.DoubleSide, transparent: true, opacity: 1 });
        const w = new THREE.Mesh(dindingGeo(b.poly, FLOOR_H), mat);
        g.add(w);
        dinding.push(mat);
        g.add(new THREE.LineSegments(new THREE.EdgesGeometry(w.geometry, 40), new THREE.LineBasicMaterial({ color: 0x1f2937, transparent: true, opacity: 0.25 })));
    });

    // strip koridor tiap sayap
    d.wings.forEach(w => {
        const k = new THREE.Mesh(new THREE.BoxGeometry(w.len, 0.3, w.corrW), new THREE.MeshStandardMaterial({ color: 0xf3f1ea, roughness: 1 }));
        k.position.copy(dunia(w.cx, w.cy, 1.15));
        k.rotation.y = -w.ang * Math.PI / 180;
        g.add(k);
    });

    // tangga
    const S = d.stairs, a0 = d.wings[0].ang * Math.PI / 180;
    const tangga = new THREE.Group();
    tangga.position.copy(dunia(S[0], S[1], 1));
    tangga.rotation.y = -a0;
    const matT = new THREE.MeshStandardMaterial({ color: 0xe9a23b, roughness: 0.7 });
    for (let i = 0; i < 5; i++) {
        const h = 1.6 * (i + 1);
        const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, h, 11), matT);
        m.position.set(-5.2 + i * 2.6, h / 2, 0);
        tangga.add(m);
    }
    g.add(tangga);

    // ruangan
    rooms.forEach(r => {
        if (r.b !== node || r.f !== f) return;
        const L = d.rooms[r.id];
        if (!L || L.zone) return;
        const mat = new THREE.MeshStandardMaterial({ color: WARNA_RUANG[L.cat] || 0xe8e2d4, roughness: 0.7, emissive: 0x000000 });
        const m = new THREE.Mesh(new THREE.BoxGeometry(L.sw, TINGGI_RUANG, L.sd), mat);
        m.position.copy(dunia(L.x, L.y, 1 + TINGGI_RUANG / 2));
        m.rotation.y = -L.ang * Math.PI / 180;
        m.castShadow = true; m.receiveShadow = true;
        m.userData.room = r;
        g.add(m);
        const tepi = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.55 }));
        tepi.position.copy(m.position); tepi.rotation.copy(m.rotation);
        g.add(tepi);
        INT.meshByRoom[r.id] = m;

        const spr = buatLabel(r.c || r.n);
        spr.scale.multiplyScalar(0.36);
        spr.position.copy(dunia(L.x, L.y, 1 + TINGGI_RUANG + 3.2));
        spr.visible = false;
        g.add(spr);
        label.push(spr);
    });
    return { group: g, dinding: dinding, label: label };
}

// ---------- Siapkan semua gedung yang punya data ruangan ----------
function siapkanInterior(scene) {
    INT.gedung = {}; INT.meshByRoom = {};
    Object.keys(INTERIOR_3D).forEach(node => {
        const d = INTERIOR_3D[node];
        const bagian = BUILDINGS_3D.filter(b => b.node === node);
        const grup = new THREE.Group();
        grup.visible = false;
        scene.add(grup);

        const lantai = {};
        for (let f = 1; f <= d.floors; f++) {
            lantai[f] = buatLantai(node, d, f, bagian);
            grup.add(lantai[f].group);
        }
        const atap = new THREE.Group();
        bagian.forEach(b => atap.add(buatAtapBagian(b)));
        grup.add(atap);

        let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
        bagian.forEach(b => b.poly.forEach(p => { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }));

        INT.gedung[node] = {
            node: node, F: d.floors, t: 0, target: 0, grup: grup, lantai: lantai, atap: atap,
            pusat: { x: (minx + maxx) / 2, y: (miny + maxy) / 2 }, ukuran: Math.max(maxx - minx, maxy - miny),
            selesai: true, dariRute: false
        };
    });
}

// ---------- Buka / tutup gedung ----------
function gedungTerbuka(node) {
    const st = INT.gedung[node];
    return !!st && st.target === 1 && st.t === 1;
}

function yLantaiAkhir(f) { return (f - 1) * (FLOOR_H + GAP_LANTAI); }

function bukaGedung(node, dariRute) {
    const st = INT.gedung[node];
    if (!st) return;
    if (st.target !== 1) {
        st.target = 1;
        // Dari pencarian rute: langsung terbuka penuh supaya seluruh jalur
        // (ruangan awal -> luar gedung -> ruangan tujuan) tergambar sekaligus.
        if (dariRute) { st.t = 1; st.selesai = true; } else st.selesai = false;
    }
    st.dariRute = false;
    INT.aktif = node;
    terapkanTampilan();
    segarkanPanel();
    if (!dariRute) fokusKeGedung(node, null);
}

function tutupGedung(node) {
    const st = INT.gedung[node];
    if (!st || st.target === 0) return;
    st.target = 0; st.selesai = false; st.dariRute = false;
    if (INT.aktif === node) INT.aktif = null;
    segarkanPanel();
    if (typeof bangunRute === 'function') bangunRute(false);   // jalur dalam disembunyikan
}

function tutupSemuaGedung() {
    Object.keys(INT.gedung).forEach(tutupGedung);
    INT.lantaiFokus = null;
    segarkanPanel();
}

function bukaGedungUntukRute(lr) {
    [lr.rAkhir, lr.rAwal].forEach(r => { if (r && INT.gedung[r.b]) bukaGedung(r.b, true); });
}

function fokusKeGedung(node, lantai) {
    const st = INT.gedung[node];
    if (!st || !V3.camera) return;
    const tinggiTotal = yLantaiAkhir(st.F) + FLOOR_H;
    const ty = lantai ? yLantaiAkhir(lantai) + 5 : tinggiTotal / 2;
    const target = dunia(st.pusat.x, st.pusat.y, ty);
    const jarak = Math.max(220, st.ukuran * (lantai ? 1.0 : 1.25));
    const pos = target.clone().add(new THREE.Vector3(0, jarak * (lantai ? 1.15 : 0.9), jarak * 0.9));
    tweenKamera(pos, target);
}

// ---------- Fokus lantai & tampilan ----------
function terapkanTampilan() {
    Object.values(INT.gedung).forEach(st => {
        for (let f = 1; f <= st.F; f++) {
            const show = INT.lantaiFokus === null || INT.lantaiFokus === f;
            st.lantai[f].group.visible = show;
            st.lantai[f].label.forEach(s => { s.visible = INT.lantaiFokus !== null && INT.lantaiFokus === f; });
        }
        st.atap.visible = INT.lantaiFokus === null;
    });
}

function setLantaiFokus(n) {
    INT.lantaiFokus = n;
    terapkanTampilan();
    segarkanPanel();
    if (INT.aktif) fokusKeGedung(INT.aktif, n);
}

function segarkanPanel() {
    const p = document.getElementById('panel-lantai');
    if (!p) return;
    const terbuka = Object.values(INT.gedung).filter(s => s.target === 1);
    if (!terbuka.length) {
        p.style.display = 'none'; p.innerHTML = '';
        INT.lantaiFokus = null; terapkanTampilan();
        return;
    }
    const maks = Math.max(...terbuka.map(s => s.F));
    if (INT.lantaiFokus !== null && INT.lantaiFokus > maks) INT.lantaiFokus = null;
    p.style.display = 'flex';
    p.innerHTML = '';
    function tombol(teks, aktif, fn) {
        const b = document.createElement('button');
        b.className = 'view-btn rounded-md shadow-lg';
        b.textContent = teks;
        b.dataset.aktif = aktif ? '1' : '0';
        b.addEventListener('click', fn);
        p.appendChild(b);
    }
    tombol('Semua lantai', INT.lantaiFokus === null, () => setLantaiFokus(null));
    for (let f = maks; f >= 1; f--) tombol('Lt ' + f, INT.lantaiFokus === f, () => setLantaiFokus(f));
    tombol('Tutup gedung', false, tutupSemuaGedung);
}

// ---------- Animasi tiap frame ----------
function perbaruiInterior(dt, waktu) {
    Object.values(INT.gedung).forEach(st => {
        if (Math.abs(st.target - st.t) > 0.002) st.t += (st.target - st.t) * Math.min(1, dt * 4.5);
        else st.t = st.target;

        const tt = st.t, aktif = tt > 0.002;
        st.grup.visible = aktif;
        (V3.gedungGrup[st.node] || []).forEach(g => { g.visible = !aktif; });
        if (aktif) {
            for (let f = 1; f <= st.F; f++) {
                const L = st.lantai[f];
                L.group.position.y = (f - 1) * (FLOOR_H + GAP_LANTAI * tt);
                const op = 1 - 0.8 * tt;
                L.dinding.forEach(m => { m.opacity = op; });
            }
            st.atap.position.y = st.F * (FLOOR_H + GAP_LANTAI * tt);
        }
        if (!st.selesai && st.t === st.target) {
            st.selesai = true;
            if (typeof bangunRute === 'function') bangunRute(st.dariRute && st.target === 1 && V3.active);
            st.dariRute = false;
        }
    });
    // denyut ruangan awal/tujuan
    const k = 0.55 + 0.45 * Math.sin(waktu * 5);
    Object.values(INT.meshByRoom).forEach(m => { if (m.userData.sorot) m.material.emissiveIntensity = k; });
}

// ---------- Sorot ruangan awal / tujuan ----------
function sorotRuangan(rAwal, rAkhir) {
    Object.values(INT.meshByRoom).forEach(m => {
        m.userData.sorot = false;
        m.material.emissive.setHex(0x000000); m.material.emissiveIntensity = 1;
    });
    INT.sorot.forEach(s => { if (s.parent) s.parent.remove(s); });
    INT.sorot = [];
    [[rAwal, 0x16a34a], [rAkhir, 0xff3b30]].forEach(([r, warna]) => {
        if (!r) return;
        const m = INT.meshByRoom[r.id];
        if (!m) return;
        m.userData.sorot = true;
        m.material.emissive.setHex(warna);
        const spr = buatLabel(labelRuang(r));
        spr.scale.multiplyScalar(0.42);
        spr.position.copy(m.position); spr.position.y += TINGGI_RUANG / 2 + 7;
        m.parent.add(spr);
        INT.sorot.push(spr);
    });
}

// ---------- Jalur di dalam gedung (titik: x, y piksel + lantai f) ----------
// dari ruangan sampai tangga pada lantai ruangan itu
function ruteKeTangga(node, r) {
    const d = INTERIOR_3D[node], L = d.rooms[r.id];
    const S = { x: d.stairs[0], y: d.stairs[1], f: r.f };
    if (!L || L.zone) return [S];
    const w = d.wings[L.w];
    // titik di tepi koridor, di depan pintu ruangan
    const dx = L.x - L.cx, dy = L.y - L.cy, jarak = Math.hypot(dx, dy) || 1;
    const k = (w.corrW / 2) / jarak;
    return [
        { x: L.cx + dx * k, y: L.cy + dy * k, f: r.f },
        { x: L.cx, y: L.cy, f: r.f },
        { x: w.joint[0], y: w.joint[1], f: r.f },
        S
    ];
}

// dari titik tempat jalur luar berakhir (node gedung) sampai ruangan
function jalurDalam(node, r) {
    const d = INTERIOR_3D[node], L = d.rooms[r.id];
    const n = nodeData.find(x => x.id === node);          // titik tempat jalur luar berakhir
    const pts = [{ x: n.x, y: n.y, f: 1 }];               // mulai dari sini, bukan d.door
    const langsung = r.f === 1 && L && !L.zone;           // ruangan biasa di lantai 1
    if (!langsung) {                                      // selain itu baru lewat tangga
        pts.push({ x: d.stairs[0], y: d.stairs[1], f: 1 });
        if (r.f !== 1) pts.push({ x: d.stairs[0], y: d.stairs[1], f: r.f });
    }
    const ke = ruteKeTangga(node, r).reverse().slice(1);
    return pts.concat(ke);
}

// antar dua ruangan di gedung yang sama
function jalurAntarRuang(node, a, b) {
    const d = INTERIOR_3D[node], La = d.rooms[a.id], Lb = d.rooms[b.id];
    if (a.f === b.f && La && Lb && !La.zone && !Lb.zone && La.w === Lb.w) {
        const ra = ruteKeTangga(node, a), rb = ruteKeTangga(node, b);
        return [ra[0], ra[1], rb[1], rb[0]];
    }
    const naik = ruteKeTangga(node, a);
    const turun = ruteKeTangga(node, b).reverse();
    const hasil = naik.slice();
    if (a.f !== b.f) hasil.push({ x: d.stairs[0], y: d.stairs[1], f: b.f });
    return hasil.concat(turun.slice(1));
}

// ---------- Hover & klik ----------
function daftarPick() {
    const hasil = [];
    Object.values(INT.gedung).forEach(st => {
        if (!st.grup.visible) return;
        for (let f = 1; f <= st.F; f++) {
            const L = st.lantai[f];
            if (!L.group.visible) continue;
            L.group.children.forEach(c => { if (c.userData && c.userData.room) hasil.push(c); });
        }
    });
    (V3.pickBangunan || []).forEach(m => { if (m.parent && m.parent.visible) hasil.push(m); });
    return hasil;
}

function tampilkanTip(html, x, y) {
    const tip = INT.tip;
    tip.innerHTML = html;
    tip.style.display = 'block';
    const w = V3.container.clientWidth;
    tip.style.left = Math.min(x + 14, w - 270) + 'px';
    tip.style.top = (y + 14) + 'px';
}

function pasangInteraksi3D() {
    const el = V3.renderer.domElement;
    const tip = document.createElement('div');
    tip.style.cssText = 'position:absolute;pointer-events:none;display:none;z-index:1100;background:rgba(15,23,42,.93);color:#fff;font-size:12px;padding:6px 9px;border-radius:6px;max-width:260px;line-height:1.4;';
    V3.container.appendChild(tip);
    INT.tip = tip;

    // keterangan warna ruangan
    const leg = document.createElement('div');
    leg.style.cssText = 'position:absolute;right:12px;bottom:12px;z-index:1000;background:rgba(255,255,255,.92);border-radius:8px;padding:6px 10px;font-size:11px;color:#334155;box-shadow:0 1px 4px rgba(0,0,0,.2);';
    leg.innerHTML = KETERANGAN_WARNA.map(k => `<div><span style="display:inline-block;width:10px;height:10px;background:${k[1]};border:1px solid #64748b;margin-right:6px;"></span>${k[0]}</div>`).join('');
    V3.container.appendChild(leg);

    const ray = new THREE.Raycaster(), m = new THREE.Vector2();
    function cari(ev) {
        const r = el.getBoundingClientRect();
        m.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(m, V3.camera);
        const h = ray.intersectObjects(daftarPick(), false)[0];
        if (!h) return null;
        if (h.object.userData.room) return { room: h.object.userData.room };
        return { node: h.object.userData.node };
    }

    el.addEventListener('pointermove', ev => {
        if (performance.now() < INT.toastSampai) return;
        if (typeof PICKER !== 'undefined' && PICKER.aktif) { tip.style.display = 'none'; el.style.cursor = 'crosshair'; return; }
        const r = el.getBoundingClientRect();
        const hit = cari(ev);
        if (!hit) { tip.style.display = 'none'; el.style.cursor = 'grab'; return; }
        el.style.cursor = 'pointer';
        if (hit.room) {
            const q = hit.room;
            tampilkanTip(`<b>${q.c || ''}</b> ${q.n}<br>Lantai ${q.f} \u2022 ${nodes[q.b].name}<br><span style="opacity:.7">Klik: jadikan tujuan \u2022 Shift+klik: titik awal</span>`, ev.clientX - r.left, ev.clientY - r.top);
        } else {
            const ada = !!INTERIOR_3D[hit.node];
            tampilkanTip(`<b>${nodes[hit.node].name}</b><br><span style="opacity:.8">${ada ? 'Klik untuk melihat lantai &amp; ruangan' : 'Belum ada data ruangan'}</span>`, ev.clientX - r.left, ev.clientY - r.top);
        }
    });
    el.addEventListener('pointerleave', () => { tip.style.display = 'none'; });

    let bawah = null;
    el.addEventListener('pointerdown', ev => { bawah = { x: ev.clientX, y: ev.clientY }; });
    el.addEventListener('pointerup', ev => {
        if (!bawah || Math.hypot(ev.clientX - bawah.x, ev.clientY - bawah.y) > 5) { bawah = null; return; }
        bawah = null;
        if (typeof PICKER !== 'undefined' && PICKER.aktif) return;   // mode ambil koordinat: klik dipakai path-picker.js
        const hit = cari(ev);
        if (!hit) return;
        const r = el.getBoundingClientRect();
        if (hit.room) {
            const q = hit.room;
            const awal = ev.shiftKey;
            if (awal && typeof pilihRuanganAwal === 'function') pilihRuanganAwal(q.id);
            else if (!awal && typeof pilihRuanganTujuan === 'function') pilihRuanganTujuan(q.id);
            tampilkanTip(`${awal ? 'Titik awal' : 'Tujuan'} dipilih:<br><b>${labelRuang(q)}</b><br><span style="opacity:.8">Tekan "Cari Rute" untuk melihat jalurnya</span>`, ev.clientX - r.left, ev.clientY - r.top);
            INT.toastSampai = performance.now() + 2200;
            setTimeout(() => { if (performance.now() >= INT.toastSampai) tip.style.display = 'none'; }, 2300);
        } else if (INTERIOR_3D[hit.node]) {
            if (INT.gedung[hit.node].target === 1) tutupGedung(hit.node); else bukaGedung(hit.node, false);
        }
    });
}