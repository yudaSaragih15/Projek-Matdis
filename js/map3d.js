// ====================================================================
// TAMPILAN 3D (Three.js)
// Gedung-gedung di-"extrude" dari denah sketsa (js/buildings3d.js),
// jalan & rumput memakai tekstur dari sketsa (js/ground-texture.js),
// dan rute Dijkstra digambar mengikuti jalan yang sama seperti di peta 2D.
// 1 satuan di dunia 3D = 1 piksel pada gambar sketsa.
// ====================================================================

const V3 = {
    scene: null, camera: null, renderer: null, controls: null,
    container: null, ground: null,
    pins: {}, routeGroup: null, routePoints: [], routeLen: 0, walker: null,
    lastRoute: null, active: false, inited: false, rafId: null,
    clock: null, camTween: null, sceneReady: false
};

const KAMERA_AWAL = { pos: [0, 560, 520], target: [0, 0, 30] };

// Koordinat piksel sketsa (x, y) -> posisi dunia 3D
function dunia(x, y, tinggi) {
    return new THREE.Vector3(x - IMG_WIDTH / 2, tinggi || 0, y - IMG_HEIGHT / 2);
}

// ---------- Helper: tekstur jendela, label, geometri ----------
function buatTeksturJendela() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#f6f3ec';
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#dcd6c8';                 // garis lantai
    g.fillRect(0, 60, 64, 4);
    g.fillStyle = '#5f7d9c';                 // kaca jendela
    g.fillRect(13, 14, 38, 30);
    g.fillStyle = '#8fb0cf';                 // pantulan langit
    g.fillRect(13, 14, 38, 11);
    g.fillStyle = '#e9e5da';                 // kusen
    g.fillRect(31, 14, 2, 30);
    g.fillRect(13, 28, 38, 2);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
}

function buatLabel(teks) {
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    g.font = 'bold 40px Arial, sans-serif';
    const lebar = Math.ceil(g.measureText(teks).width) + 56;
    c.width = lebar; c.height = 88;
    g.font = 'bold 40px Arial, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.94)';
    g.strokeStyle = 'rgba(30,41,59,0.55)';
    g.lineWidth = 4;
    const r = 22, w = lebar - 4, h = 84, x0 = 2, y0 = 2;
    g.beginPath();
    g.moveTo(x0 + r, y0); g.lineTo(x0 + w - r, y0); g.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
    g.lineTo(x0 + w, y0 + h - r); g.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
    g.lineTo(x0 + r, y0 + h); g.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
    g.lineTo(x0, y0 + r); g.quadraticCurveTo(x0, y0, x0 + r, y0);
    g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#1e293b';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(teks, lebar / 2, 46);
    const tex = new THREE.CanvasTexture(c);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    const tinggi = 15;
    spr.scale.set(tinggi * lebar / 88, tinggi, 1);
    return spr;
}

function titikTengah(poly) {
    let sx = 0, sy = 0;
    poly.forEach(p => { sx += p[0]; sy += p[1]; });
    return [sx / poly.length, sy / poly.length];
}

function skalakanPoly(poly, f) {
    const [cx, cy] = titikTengah(poly);
    return poly.map(p => [cx + (p[0] - cx) * f, cy + (p[1] - cy) * f]);
}

// Bentuk 2D (Shape) dari poligon piksel. Setelah diputar -90 derajat pada sumbu X,
// titik (sx, sy) menjadi posisi dunia (x, ., -sy), sehingga sy = IMG_HEIGHT/2 - y.
function buatShape(poly) {
    const s = new THREE.Shape();
    poly.forEach((p, i) => {
        const sx = p[0] - IMG_WIDTH / 2, sy = IMG_HEIGHT / 2 - p[1];
        if (i === 0) s.moveTo(sx, sy); else s.lineTo(sx, sy);
    });
    s.closePath();
    return s;
}

function extrudePoly(poly, tinggi, yMulai) {
    const geo = new THREE.ExtrudeGeometry(buatShape(poly), { depth: tinggi, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, yMulai || 0, 0);
    return geo;
}

// Atap limas (hip roof) dari poligon: tiap sisi jadi segitiga ke puncak di tengah
function buatAtapLimas(poly, yDasar, tinggiAtap) {
    const [cx, cy] = titikTengah(poly);
    const apex = dunia(cx, cy, yDasar + tinggiAtap);
    const pos = [];
    for (let i = 0; i < poly.length; i++) {
        const a = dunia(poly[i][0], poly[i][1], yDasar);
        const b = dunia(poly[(i + 1) % poly.length][0], poly[(i + 1) % poly.length][1], yDasar);
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z, apex.x, apex.y, apex.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    return geo;
}

function buatGedung(b, teksJendela) {
    const grup = new THREE.Group();
    const warna = new THREE.Color(b.color);
    const kaca = b.roof === 'glass';

    const tex = teksJendela.clone();
    tex.needsUpdate = true;
    const lantai = Math.max(1, Math.round(b.h / 9));
    tex.repeat.set(1 / 16, 1 / (b.h / lantai));

    const matAtas = new THREE.MeshStandardMaterial({ color: warna, roughness: 0.9 });
    const matDinding = kaca
        ? new THREE.MeshStandardMaterial({ color: warna, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.55 })
        : new THREE.MeshStandardMaterial({ color: warna, map: tex, roughness: 0.85 });

    const badan = new THREE.Mesh(extrudePoly(b.poly, b.h, 0), [matAtas, matDinding]);
    badan.castShadow = true; badan.receiveShadow = true;
    badan.userData.node = b.node;
    V3.pickBangunan.push(badan);
    grup.add(badan);

    // garis tepi tipis supaya bentuk gedung tegas
    const tepi = new THREE.LineSegments(
        new THREE.EdgesGeometry(badan.geometry, 40),
        new THREE.LineBasicMaterial({ color: 0x1f2937, transparent: true, opacity: 0.28 })
    );
    grup.add(tepi);

    if (b.roof === 'hip') {
        const atap = new THREE.Mesh(
            buatAtapLimas(skalakanPoly(b.poly, 1.03), b.h, 10),
            new THREE.MeshStandardMaterial({ color: 0xb9633f, roughness: 0.75, side: THREE.DoubleSide, flatShading: true })
        );
        atap.castShadow = true; atap.receiveShadow = true;
        grup.add(atap);
    } else {
        const slab = new THREE.Mesh(
            extrudePoly(skalakanPoly(b.poly, 0.97), 1.6, b.h),
            new THREE.MeshStandardMaterial({ color: kaca ? 0xcfeeea : 0x8b9099, roughness: 0.8 })
        );
        slab.castShadow = true; slab.receiveShadow = true;
        grup.add(slab);
    }

    if (b.label && b.name) {
        const [cx, cy] = titikTengah(b.poly);
        const lbl = buatLabel(b.name);
        lbl.position.copy(dunia(cx, cy, b.h + (b.roof === 'hip' ? 24 : 15)));
        grup.add(lbl);
    }
    return grup;
}

function buatPohon(daftar) {
    const n = daftar.length;
    const batang = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.9, 1.2, 7, 6),
        new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 }), n);
    const daun = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(6.5, 1),
        new THREE.MeshStandardMaterial({ color: 0x3f8f4a, roughness: 0.9, flatShading: true }), n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const hijau = [0x3f8f4a, 0x4a9b52, 0x357a3f, 0x5aa65a];
    daftar.forEach((t, i) => {
        const sk = t[2];
        s.set(sk, sk, sk);
        p.set(t[0] - IMG_WIDTH / 2, 3.5 * sk, t[1] - IMG_HEIGHT / 2);
        batang.setMatrixAt(i, m.compose(p, q, s));
        p.set(t[0] - IMG_WIDTH / 2, 11 * sk, t[1] - IMG_HEIGHT / 2);
        s.set(sk, sk * 1.15, sk);
        daun.setMatrixAt(i, m.compose(p, q, s));
        daun.setColorAt(i, new THREE.Color(hijau[i % hijau.length]));
    });
    batang.castShadow = true; daun.castShadow = true;
    const g = new THREE.Group(); g.add(batang); g.add(daun);
    return g;
}

function buatPin(warna) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: warna, emissive: warna, emissiveIntensity: 0.35, roughness: 0.4 });
    const batang = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 16, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    batang.position.y = 8;
    const kepala = new THREE.Mesh(new THREE.SphereGeometry(4.6, 20, 16), mat);
    kepala.position.y = 19;
    kepala.castShadow = true;
    const cincin = new THREE.Mesh(new THREE.RingGeometry(3.5, 5.2, 24), new THREE.MeshBasicMaterial({ color: warna, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    cincin.rotation.x = -Math.PI / 2; cincin.position.y = 0.4;
    g.add(batang, kepala, cincin);
    g.userData = { kepala: kepala, mat: mat, cincin: cincin };
    return g;
}

// ---------- Bangun seluruh isi scene (tanpa renderer, supaya mudah dites) ----------
function buatScene() {
    const scene = new THREE.Scene();
    const langit = new THREE.Color(0xd9e8f5);
    scene.background = langit;
    scene.fog = new THREE.Fog(langit, 1100, 2800);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa07a, 0.85));
    const matahari = new THREE.DirectionalLight(0xfff3df, 0.85);
    matahari.position.set(-320, 520, 260);
    matahari.castShadow = true;
    matahari.shadow.mapSize.set(2048, 2048);
    const sc = matahari.shadow.camera;
    sc.left = -620; sc.right = 620; sc.top = 460; sc.bottom = -460; sc.near = 50; sc.far = 1600;
    matahari.shadow.bias = -0.0006;
    scene.add(matahari);

    // area hijau luas di sekeliling sketsa
    const luar = new THREE.Mesh(new THREE.PlaneGeometry(7000, 7000), new THREE.MeshStandardMaterial({ color: 0x86b574, roughness: 1 }));
    luar.rotation.x = -Math.PI / 2; luar.position.y = -0.6;
    luar.receiveShadow = true;
    scene.add(luar);

    // tanah: jalan, rumput, paving
    const tanah = new THREE.Mesh(new THREE.PlaneGeometry(IMG_WIDTH, IMG_HEIGHT), new THREE.MeshStandardMaterial({ color: 0x7fb06c, roughness: 1 }));
    tanah.rotation.x = -Math.PI / 2;
    tanah.receiveShadow = true;
    scene.add(tanah);
    V3.ground = tanah;

    const teksJendela = buatTeksturJendela();
    V3.teksJendela = teksJendela;
    V3.pickBangunan = [];
    V3.gedungGrup = {};
    BUILDINGS_3D.forEach(b => {
        const g = buatGedung(b, teksJendela);
        (V3.gedungGrup[b.node] = V3.gedungGrup[b.node] || []).push(g);
        scene.add(g);
    });
    scene.add(buatPohon(TREES_3D));
    if (typeof siapkanInterior === 'function') siapkanInterior(scene);   // lantai & ruangan (interior-view.js)

    // penanda lokasi (pin) di pintu masuk tiap gedung
    V3.pins = {};
    nodeData.forEach(n => {
        const pin = buatPin(0x2563eb);
        pin.position.copy(dunia(n.x, n.y, 0));
        scene.add(pin);
        V3.pins[n.id] = pin;
    });

    V3.routeGroup = new THREE.Group();
    scene.add(V3.routeGroup);

    // titik yang berjalan menyusuri rute
    const walker = new THREE.Mesh(new THREE.SphereGeometry(4.2, 20, 16),
        new THREE.MeshStandardMaterial({ color: 0xffe14d, emissive: 0xffc400, emissiveIntensity: 0.9 }));
    walker.visible = false;
    scene.add(walker);
    V3.walker = walker;

    V3.scene = scene;
    V3.sceneReady = true;
    return scene;
}

// ---------- Rute 3D ----------
function jalurPiksel(a, b) {
    for (const e of edgeData) {
        if (e.from === a && e.to === b) return e.path;
        if (e.from === b && e.to === a) return [...e.path].reverse();
    }
    const na = nodeData.find(n => n.id === a), nb = nodeData.find(n => n.id === b);
    return [[na.x, na.y], [nb.x, nb.y]];
}

function setWarnaPin(id, warna) {
    const pin = V3.pins[id];
    if (!pin) return;
    pin.userData.mat.color.setHex(warna);
    pin.userData.mat.emissive.setHex(warna);
    pin.userData.cincin.material.color.setHex(warna);
}

function updateRoute3D(pathIds, rAwal, rAkhir) {
    V3.lastRoute = { ids: pathIds || [], rAwal: rAwal || null, rAkhir: rAkhir || null };
    if (!V3.sceneReady) return;
    // gedung tujuan/asal yang punya data ruangan dibuka otomatis
    if (typeof bukaGedungUntukRute === 'function') bukaGedungUntukRute(V3.lastRoute);
    bangunRute(true);
}

// Susun ulang garis rute (luar gedung = merah, dalam gedung = oranye)
function bangunRute(fokus) {
    const lr = V3.lastRoute;
    if (!V3.sceneReady || !lr) return;

    // bersihkan rute lama
    while (V3.routeGroup.children.length) {
        const m = V3.routeGroup.children.pop();
        if (m.geometry) m.geometry.dispose();
    }
    Object.keys(V3.pins).forEach(id => setWarnaPin(id, 0x2563eb));
    V3.routePoints = []; V3.routeLen = 0; V3.walker.visible = false;
    if (typeof sorotRuangan === 'function') sorotRuangan(lr.rAwal, lr.rAkhir);

    const ids = lr.ids;
    const titik = [];   // { v: posisi 3D, dalam: true jika di dalam gedung }
    function tambahDalam(node, pts) {
        pts.forEach(p => titik.push({ v: new THREE.Vector3(p.x - IMG_WIDTH / 2, yLantaiAkhir(p.f) + 3.4, p.y - IMG_HEIGHT / 2), dalam: true }));
    }
    const terbuka = n => typeof gedungTerbuka === 'function' && gedungTerbuka(n);

    if (ids.length >= 2) {
        if (lr.rAwal && terbuka(lr.rAwal.b)) tambahDalam(lr.rAwal.b, jalurDalam(lr.rAwal.b, lr.rAwal).reverse());
        let px = [];
        for (let i = 0; i < ids.length - 1; i++) {
            const seg = jalurPiksel(ids[i], ids[i + 1]);
            px = px.concat(i === 0 ? seg : seg.slice(1));
        }
        px.forEach(p => titik.push({ v: dunia(p[0], p[1], 2.6), dalam: false }));
        if (lr.rAkhir && terbuka(lr.rAkhir.b)) tambahDalam(lr.rAkhir.b, jalurDalam(lr.rAkhir.b, lr.rAkhir));
    } else if (ids.length === 0 && lr.rAwal && lr.rAkhir && lr.rAwal.b === lr.rAkhir.b && terbuka(lr.rAwal.b)) {
        tambahDalam(lr.rAwal.b, jalurAntarRuang(lr.rAwal.b, lr.rAwal, lr.rAkhir));
    }
    if (titik.length < 2) return;

    const pts = titik.map(t => t.v);
    V3.routePoints = pts;

    const matLuar = new THREE.MeshStandardMaterial({ color: 0xff2d2d, emissive: 0xff1010, emissiveIntensity: 0.55, roughness: 0.4 });
    const matDalam = new THREE.MeshStandardMaterial({ color: 0xff9f1c, emissive: 0xff7a00, emissiveIntensity: 0.6, roughness: 0.4 });
    const glowLuar = new THREE.MeshBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.28, depthWrite: false });
    const glowDalam = new THREE.MeshBasicMaterial({ color: 0xffc46b, transparent: true, opacity: 0.3, depthWrite: false });
    const geoBola = new THREE.SphereGeometry(2.3, 10, 8);
    const geoBolaGlow = new THREE.SphereGeometry(3.8, 10, 8);
    const atas = new THREE.Vector3(0, 1, 0);
    let total = 0;
    const kum = [0];

    titik.forEach((t, i) => {
        const p = t.v;
        const bola = new THREE.Mesh(geoBola, t.dalam ? matDalam : matLuar); bola.position.copy(p); V3.routeGroup.add(bola);
        const glow = new THREE.Mesh(geoBolaGlow, t.dalam ? glowDalam : glowLuar); glow.position.copy(p); V3.routeGroup.add(glow);
        if (i === 0) return;
        const a = pts[i - 1], dir = new THREE.Vector3().subVectors(p, a), len = dir.length();
        total += len; kum.push(total);
        if (len < 0.01) return;
        dir.normalize();
        const dalam = t.dalam && titik[i - 1].dalam;
        const q = new THREE.Quaternion().setFromUnitVectors(atas, dir);
        const mid = new THREE.Vector3().addVectors(a, p).multiplyScalar(0.5);
        const sil = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, len, 10), dalam ? matDalam : matLuar);
        sil.position.copy(mid); sil.quaternion.copy(q); V3.routeGroup.add(sil);
        const sg = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, len, 10), dalam ? glowDalam : glowLuar);
        sg.position.copy(mid); sg.quaternion.copy(q); V3.routeGroup.add(sg);
    });
    V3.routeLen = total;
    V3.routeCum = kum;

    if (ids.length >= 2) {
        setWarnaPin(ids[0], 0x16a34a);                      // awal = hijau
        setWarnaPin(ids[ids.length - 1], 0xdc2626);         // tujuan = merah
    }
    V3.walkDist = 0;
    V3.walker.visible = true;
    if (fokus && V3.active) fokusKeRute();
}

function titikDiRute(jarak) {
    const kum = V3.routeCum, pts = V3.routePoints;
    if (!pts.length) return null;
    const d = Math.min(Math.max(jarak, 0), V3.routeLen);
    let i = 1;
    while (i < kum.length - 1 && kum[i] < d) i++;
    const span = kum[i] - kum[i - 1] || 1;
    return new THREE.Vector3().lerpVectors(pts[i - 1], pts[i], (d - kum[i - 1]) / span);
}

// ---------- Kamera ----------
function tweenKamera(posBaru, targetBaru, durasi) {
    V3.camTween = {
        t: 0, dur: durasi || 1.1,
        p0: V3.camera.position.clone(), p1: posBaru,
        t0: V3.controls.target.clone(), t1: targetBaru
    };
}

function fokusKeRute() {
    if (!V3.routePoints.length || !V3.camera) return;
    const box = new THREE.Box3().setFromPoints(V3.routePoints);
    const pusat = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    const arah = new THREE.Vector3().subVectors(V3.camera.position, V3.controls.target).normalize();
    const jarak = Math.max(260, radius * 1.7);
    tweenKamera(pusat.clone().addScaledVector(arah, jarak), pusat);
}

function resetKamera() {
    if (!V3.camera) return;
    tweenKamera(new THREE.Vector3(...KAMERA_AWAL.pos), new THREE.Vector3(...KAMERA_AWAL.target));
}

// ---------- Inisialisasi renderer & loop ----------
function init3D() {
    if (V3.inited) return;
    V3.container = document.getElementById('map3d');
    V3.renderer = new THREE.WebGLRenderer({ antialias: true });
    V3.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    V3.renderer.shadowMap.enabled = true;
    V3.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    V3.container.appendChild(V3.renderer.domElement);
    V3.renderer.domElement.style.display = 'block';

    buatScene();

    V3.camera = new THREE.PerspectiveCamera(45, 1, 1, 7000);
    V3.camera.position.set(...KAMERA_AWAL.pos);
    V3.controls = new THREE.OrbitControls(V3.camera, V3.renderer.domElement);
    V3.controls.target.set(...KAMERA_AWAL.target);
    V3.controls.enableDamping = true;
    V3.controls.dampingFactor = 0.08;
    V3.controls.maxPolarAngle = Math.PI / 2.08;
    V3.controls.minDistance = 80;
    V3.controls.maxDistance = 1500;
    V3.controls.autoRotateSpeed = 0.7;

    V3.clock = new THREE.Clock();

    // tekstur tanah dimuat dari data URI (aman dibuka langsung lewat file://)
    new THREE.TextureLoader().load(GROUND_TEXTURE_URL, tex => {
        tex.anisotropy = V3.renderer.capabilities.getMaxAnisotropy();
        V3.ground.material.map = tex;
        V3.ground.material.color.setHex(0xffffff);
        V3.ground.material.needsUpdate = true;
    });

    window.addEventListener('resize', ukuran3D);
    V3.inited = true;
    if (typeof pasangInteraksi3D === 'function') pasangInteraksi3D();   // hover & klik (interior-view.js)
    if (typeof pickerPasang3D === 'function') pickerPasang3D();         // ambil koordinat (path-picker.js)
    if (V3.lastRoute) updateRoute3D(V3.lastRoute.ids, V3.lastRoute.rAwal, V3.lastRoute.rAkhir);
}

function ukuran3D() {
    if (!V3.inited) return;
    const w = V3.container.clientWidth, h = V3.container.clientHeight;
    if (!w || !h) return;
    V3.renderer.setSize(w, h, true);
    V3.camera.aspect = w / h;
    V3.camera.updateProjectionMatrix();
}

function loop3D() {
    if (!V3.active) return;
    V3.rafId = requestAnimationFrame(loop3D);
    const dt = Math.min(V3.clock.getDelta(), 0.05);
    const t = V3.clock.elapsedTime;

    if (V3.camTween) {
        const k = V3.camTween;
        k.t += dt / k.dur;
        const e = k.t >= 1 ? 1 : 1 - Math.pow(1 - k.t, 3);
        V3.camera.position.lerpVectors(k.p0, k.p1, e);
        V3.controls.target.lerpVectors(k.t0, k.t1, e);
        if (k.t >= 1) V3.camTween = null;
    }

    if (typeof perbaruiInterior === 'function') perbaruiInterior(dt, t);

    // pin naik-turun pelan
    let i = 0;
    Object.keys(V3.pins).forEach(id => {
        const p = V3.pins[id];
        p.userData.kepala.position.y = 19 + Math.sin(t * 2.2 + i++) * 1.2;
    });

    // titik berjalan di sepanjang rute
    if (V3.walker.visible && V3.routeLen > 0) {
        V3.walkDist += dt * 110;
        if (V3.walkDist > V3.routeLen + 70) V3.walkDist = 0;
        const pos = titikDiRute(V3.walkDist);
        if (pos) { V3.walker.position.copy(pos); V3.walker.position.y += 2.5 + Math.sin(t * 8) * 0.8; }
    }

    V3.controls.update();
    V3.renderer.render(V3.scene, V3.camera);
}

// Tampilkan / sembunyikan mode 3D
function aktifkan3D(aktif) {
    const el3d = document.getElementById('map3d');
    const el2d = document.getElementById('map');
    const kontrol3d = document.getElementById('kontrol-3d');
    V3.active = aktif;

    document.getElementById('btn-2d').dataset.aktif = aktif ? '0' : '1';
    document.getElementById('btn-3d').dataset.aktif = aktif ? '1' : '0';

    if (aktif) {
        el2d.style.display = 'none';
        el3d.style.display = 'block';
        kontrol3d.style.display = 'flex';
        init3D();
        ukuran3D();
        V3.clock.getDelta();
        if (V3.rafId) cancelAnimationFrame(V3.rafId);
        loop3D();
        if (V3.routePoints.length) fokusKeRute();
    } else {
        if (V3.rafId) cancelAnimationFrame(V3.rafId);
        el3d.style.display = 'none';
        kontrol3d.style.display = 'none';
        el2d.style.display = 'block';
        if (typeof map !== 'undefined' && map) map.invalidateSize();
    }
}

function pasangTombol3D() {
    document.getElementById('btn-2d').addEventListener('click', () => aktifkan3D(false));
    document.getElementById('btn-3d').addEventListener('click', () => aktifkan3D(true));
    document.getElementById('btn-reset-cam').addEventListener('click', resetKamera);
    document.getElementById('btn-auto-rotate').addEventListener('click', (e) => {
        if (!V3.controls) return;
        V3.controls.autoRotate = !V3.controls.autoRotate;
        e.currentTarget.dataset.aktif = V3.controls.autoRotate ? '1' : '0';
    });
}
