// ====================================================================
// FOTO + PENJELASAN GEDUNG
// Kunci = id gedung di graph.js. File foto ada di assets/foto/.
// Mau ganti foto atau teks? Cukup ubah file / isi di bawah ini.
//   ringkas   : 1 kalimat untuk popup marker di peta
//   penjelasan: penjelasan lengkap di hasil rute
//   ciri      : ciri-ciri bangunan supaya mudah dikenali
// ====================================================================
const INFO_GEDUNG = {
    gedung_12: {
        foto: "assets/foto/gedung_12.jpg",
        ringkas: "Gedung 2 lantai di sekeliling halaman berpaving.",
        penjelasan: "Gedung 2 lantai berkode 12. Di dalamnya ada Ruang Baca FMIPA, Kantor Dekan, dan ruang-ruang program studi Gizi.",
        ciri: "Halaman berpaving yang dikelilingi dua sayap bangunan, angka 12 terlihat di bagian tengah."
    },
    lab_fisika: {
        foto: "assets/foto/lab_fisika.jpg",
        ringkas: "Laboratorium Fisika, 4 lantai.",
        penjelasan: "Laboratorium 4 lantai berisi Lab Listrik, Lab Optik, Lab Fisika Bumi, Lab Instrumentasi, Ruang Penelitian SEM, dan Ruang Astronomi.",
        ciri: "Bangunan warna krem dengan kanopi biru dan tulisan LABORATORIUM FISIKA di bagian depan."
    },
    lab_biologi: {
        foto: "assets/foto/lab_biologi.jpg",
        ringkas: "Laboratorium Biologi, 4 lantai.",
        penjelasan: "Laboratorium 4 lantai berisi Lab Mikrobiologi, Lab Mikroteknik, Lab Penelitian GCMS, Lab Biologi Umum, serta kantin di lantai 1 dan perpustakaan Biologi di lantai 3.",
        ciri: "Tulisan Laboratorium BIOLOGI, garis hijau vertikal di dinding, dan jendela kaca gelap di sisi depan."
    },
    lab_komputer: {
        foto: "assets/foto/lab_komputer.jpg",
        ringkas: "Lab Ilmu Komputer, 3 lantai.",
        penjelasan: "Gedung 3 lantai berisi Lab Jaringan, Lab Komputasi dan AI, Lab Pemrograman dan Komputasi, Ruang Prodi Ilmu Komputer, dan Ruang HMJ.",
        ciri: "Bangunan putih kebiruan dengan atap seng biru; papan Visi & Misi Program Studi Ilmu Komputer ada di lantai dasar."
    },
    rumah_kaca: {
        foto: "assets/foto/rumah_kaca.jpg",
        ringkas: "Rumah kaca Biologi (nomor 76).",
        penjelasan: "Rumah kaca (greenhouse) milik Biologi, bertanda nomor 76 \"G. Biologi / Rumah Kaca\". Data ruangan di dalamnya belum tersedia.",
        ciri: "Rangka besi hitam beratap kaca, pintu besi hitam, dan jalan setapak menuju pintunya di tengah taman tanaman."
    },
    lab_kimia: {
        foto: "assets/foto/lab_kimia.jpg",
        ringkas: "Laboratorium Kimia, 3 lantai.",
        penjelasan: "Laboratorium 3 lantai berisi ruang praktikum Kimia Umum, Kimia Fisika, Anorganik, Analitik, dan Biokimia, ruang penelitian, serta ruang instrumen seperti UV-Vis Spektrofotometer.",
        ciri: "Dinding putih berkeramik, jendela berbingkai kayu coklat, dan teras beratap seng di samping bangunan."
    },
    bilingual: {
        foto: "assets/foto/bilingual.jpg",
        ringkas: "Gedung Bilingual, 2 lantai.",
        penjelasan: "Gedung 2 lantai berkode 06. Data ruangannya masih dilengkapi.",
        ciri: "Atap lebar dengan lantai dasar terbuka, dinding berlapis batu gelap, dan bangku kayu di bawahnya."
    },
    biologi: {
        foto: "assets/foto/biologi.jpg",
        ringkas: "Gedung Jurusan Biologi, 10 lantai.",
        penjelasan: "Gedung 10 lantai. Lantai 1 berisi administrasi dan pimpinan jurusan, lantai 2 ruang penguji dan microteaching, lantai 3-7 ruang kelas, lantai 8-9 ruang dosen dan diskusi, lantai 10 ruang komunitas mahasiswa. Tersedia lift.",
        ciri: "Menara putih dengan jalur kaca biru vertikal dan tulisan BIOLOGI di puncak sisi kanan."
    },
    fisika: {
        foto: "assets/foto/fisika.jpg",
        ringkas: "Gedung Jurusan Fisika, 8 lantai.",
        penjelasan: "Gedung 8 lantai. Lantai 1 berisi administrasi dan ruang rapat jurusan, lantai 3 dan 5 ruang kelas, lantai 4 mushola, lantai 6-7 ruang dosen, lantai 8 ruang komunitas dan serbaguna.",
        ciri: "Menara putih dengan jalur kaca biru vertikal, tulisan FISIKA di puncak, dan jalur landai di depan pintu masuk."
    },
    gedung_syawal: {
        foto: "assets/foto/gedung_syawal.jpg",
        ringkas: "Gedung Prof. Dr. Syawal Gultom, M.Pd., 3 lantai.",
        penjelasan: "Gedung 3 lantai bernama Prof. Dr. Syawal Gultom, M.Pd. Lantai 1 berisi Hall/Lobby Utama dan Ruang Arsip, lantai 2 ada mushola, dan lantai 3 berisi Aula A, B, dan C.",
        ciri: "Atap limas abu-abu dengan aksen kuning, papan nama gedung di atas pintu masuk, dan pot kuning di sepanjang jalan masuk."
    },
    kimia: {
        foto: "assets/foto/kimia.jpg",
        ringkas: "Gedung Jurusan Kimia, 10 lantai.",
        penjelasan: "Gedung 10 lantai. Lantai 2 berisi ruang penguji dan microteaching, lantai 3-7 ruang kelas, lantai 8-9 ruang dosen dan diskusi, lantai 10 ruang komunitas mahasiswa. Tersedia lift mahasiswa dan dosen.",
        ciri: "Menara putih dengan jalur kaca biru vertikal, tulisan KIMIA di puncak, dan kanopi abu-abu di pintu masuk."
    },
    matematika: {
        foto: "assets/foto/matematika.jpg",
        ringkas: "Gedung Jurusan Matematika, 8 lantai.",
        penjelasan: "Gedung 8 lantai. Lantai 1 berisi administrasi jurusan, lantai 2-4 ruang kuliah, lantai 5-7 ruang dosen, lantai 8 Ruang Himpunan Mahasiswa Jurusan. Tersedia lift.",
        ciri: "Menara putih dengan jalur kaca biru vertikal dan tulisan MATEMATIKA di puncak, diapit dua gedung putih yang lebih rendah."
    }
};

// ---------- Kartu foto di hasil rute ----------
function buatKartuFoto(nodeId, peran) {
    const info = INFO_GEDUNG[nodeId];
    if (!info) return null;
    const kartu = document.createElement('div');
    kartu.className = 'foto-kartu foto-' + peran.kelas;

    const img = document.createElement('img');
    img.src = info.foto;
    img.alt = 'Foto ' + nodes[nodeId].name;
    img.loading = 'lazy';
    img.addEventListener('click', () => bukaFotoModal(nodeId));

    const badan = document.createElement('div');
    badan.className = 'foto-badan';
    const label = document.createElement('span');
    label.className = 'foto-label';
    label.textContent = peran.teks;
    const judul = document.createElement('strong');
    judul.textContent = nodes[nodeId].name;
    badan.append(label, judul);

    if (peran.kelas === 'tujuan') {
        const p = document.createElement('p');
        p.textContent = info.penjelasan;
        const ciri = document.createElement('p');
        ciri.className = 'foto-ciri';
        const b = document.createElement('b');
        b.textContent = 'Ciri-ciri: ';
        ciri.append(b, document.createTextNode(info.ciri));
        badan.append(p, ciri);
    }
    kartu.append(img, badan);
    return kartu;
}

function tampilkanFotoRute(awalId, tujuanId) {
    const wadah = document.getElementById('foto-rute');
    const tombol = document.getElementById('btn-show-photo');
    if (!wadah) return;
    wadah.innerHTML = '';
    window.gedungTujuanFoto = tujuanId;
    const k1 = buatKartuFoto(tujuanId, { kelas: 'tujuan', teks: 'Tujuan kamu' });
    const k2 = awalId !== tujuanId ? buatKartuFoto(awalId, { kelas: 'awal', teks: 'Titik awal' }) : null;
    [k1, k2].forEach(k => k && wadah.appendChild(k));
    if (tombol) tombol.classList.toggle('show', !!k1);
}

// ---------- Modal foto (dipakai tombol "Lihat Foto Lokasi") ----------
function bukaFotoModal(nodeId, ruang) {
    const info = INFO_GEDUNG[nodeId];
    const modal = document.getElementById('photo-modal');
    if (!info || !modal) return;
    const img = document.getElementById('modal-room-img');
    const noPhoto = document.getElementById('modal-no-photo');
    noPhoto.style.display = 'none';
    img.style.display = 'block';
    img.onerror = null;
    // jika ruangan tujuan punya foto sendiri, tampilkan dulu; kalau gagal, pakai foto gedung
    if (ruang && ruang.image) {
        img.onerror = () => { img.onerror = null; img.src = info.foto; };
        img.src = ruang.image;
    } else {
        img.src = info.foto;
    }
    img.alt = 'Foto ' + nodes[nodeId].name;
    document.getElementById('modal-room-name').textContent = nodes[nodeId].name;
    document.getElementById('modal-room-desc').textContent = info.penjelasan + ' ' + info.ciri;
    modal.classList.add('active');
}

function showPhotoModal() {
    const id = window.gedungTujuanFoto || document.getElementById('end-node').value;
    const pilih = document.getElementById('end-room');
    const ruang = (pilih && pilih.value !== '' && typeof rooms !== 'undefined') ? rooms[Number(pilih.value)] : null;
    bukaFotoModal(id, ruang);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('photo-modal');
    if (!modal) return;
    const tutup = () => modal.classList.remove('active');
    document.getElementById('modal-close-btn').addEventListener('click', tutup);
    modal.addEventListener('click', e => { if (e.target === modal) tutup(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') tutup(); });
});
