// ====================================================================
// DATA TITIK (NODE) - KOORDINAT SUDAH DIPISAH AGAR RUTE SELARAS JALAN
// ====================================================================
const nodes = {
    // --- GEDUNG (Marker Biru) ---
    "gedung_12":     { id: "gedung_12",      name: "Gedung 12",       lat: 3.59599, lng: 98.67073, type: "gedung" },
    "lab_fisika":    { id: "lab_fisika",     name: "Lab. Fisika",     lat: 3.59689, lng: 98.67203, type: "gedung" },
    "lab_biologi":   { id: "lab_biologi",    name: "Lab. Biologi",    lat: 3.59343, lng: 98.66935, type: "gedung" },
    "lab_komputer":  { id: "lab_komputer",   name: "Lab. Komputer",   lat: 3.59303, lng: 98.67068, type: "gedung" },
    "rumah_kaca":    { id: "rumah_kaca",     name: "Rumah Kaca",      lat: 3.59505, lng: 98.67151, type: "gedung" },
    "lab_kimia":     { id: "lab_kimia",      name: "Lab. Kimia",      lat: 3.59332, lng: 98.67233, type: "gedung" },
    "bilingual":     { id: "bilingual",      name: "Gedung Bilingual",lat: 3.59302, lng: 98.67405, type: "gedung" },
    "biologi":       { id: "biologi",        name: "Biologi",         lat: 3.59574, lng: 98.67514, type: "gedung" },
    "fisika":        { id: "fisika",         name: "Fisika",          lat: 3.59608, lng: 98.67346, type: "gedung" },
    "gedung_syawal": { id: "gedung_syawal",  name: "Gedung Syawal",   lat: 3.59498, lng: 98.67426, type: "gedung" },
    "kimia":         { id: "kimia",          name: "Kimia",           lat: 3.59401, lng: 98.67359, type: "gedung" },
    "matematika":    { id: "matematika",     name: "Matematika",      lat: 3.59393, lng: 98.67511, type: "gedung" },

    // ================================================================
    // SIMPANG (Koordinat Berbeda untuk Setiap Titik)
    // ================================================================

    // --- 1. Rute Gedung 12 (Berjalan ke Timur) ---
    "s_depan_g12_1": { id: "s_depan_g12_1", name: "Depan G12 1", lat: 3.59599, lng: 98.67090, type: "simpang" },
    "s_depan_g12_2": { id: "s_depan_g12_2", name: "Depan G12 2", lat: 3.59599, lng: 98.67110, type: "simpang" },
    "s_depan_g12_3": { id: "s_depan_g12_3", name: "Depan G12 3", lat: 3.59599, lng: 98.67130, type: "simpang" },
    "s_depan_g12_4": { id: "s_depan_g12_4", name: "Depan G12 4", lat: 3.59599, lng: 98.67150, type: "simpang" },
    "s_depan_g12_5": { id: "s_depan_g12_5", name: "Depan G12 5", lat: 3.59599, lng: 98.67170, type: "simpang" },

    // --- 2. Rute Lab Fisika (Berjalan ke Tenggara) ---
    "s_depan_lab_fisika_1": { id: "s_depan_lab_fisika_1", name: "Depan LF 1", lat: 3.59680, lng: 98.67210, type: "simpang" },
    "s_depan_lab_fisika_2": { id: "s_depan_lab_fisika_2", name: "Depan LF 2", lat: 3.59670, lng: 98.67220, type: "simpang" },
    "s_depan_lab_fisika_3": { id: "s_depan_lab_fisika_3", name: "Depan LF 3", lat: 3.59655, lng: 98.67235, type: "simpang" },
    "s_depan_lab_fisika_4": { id: "s_depan_lab_fisika_4", name: "Depan LF 4", lat: 3.59640, lng: 98.67250, type: "simpang" },
    "s_depan_lab_fisika_5": { id: "s_depan_lab_fisika_5", name: "Depan LF 5", lat: 3.59620, lng: 98.67270, type: "simpang" },

    // --- 3. Rute Rumah Kaca (Berjalan ke Timur Laut) ---
    "s_depan_rumah_kaca_1": { id: "s_depan_rumah_kaca_1", name: "Depan RK 1", lat: 3.59510, lng: 98.67165, type: "simpang" },
    "s_depan_rumah_kaca_2": { id: "s_depan_rumah_kaca_2", name: "Depan RK 2", lat: 3.59520, lng: 98.67175, type: "simpang" },
    "s_depan_rumah_kaca_3": { id: "s_depan_rumah_kaca_3", name: "Depan RK 3", lat: 3.59535, lng: 98.67185, type: "simpang" },
    "s_depan_rumah_kaca_4": { id: "s_depan_rumah_kaca_4", name: "Depan RK 4", lat: 3.59550, lng: 98.67190, type: "simpang" },
    "s_depan_rumah_kaca_5": { id: "s_depan_rumah_kaca_5", name: "Depan RK 5", lat: 3.59570, lng: 98.67195, type: "simpang" },

    // --- 4. Rute Lab Biologi (Berjalan ke Timur) ---
    "s_depan_lab_biologi_1": { id: "s_depan_lab_biologi_1", name: "Depan LB 1", lat: 3.59343, lng: 98.66955, type: "simpang" },
    "s_depan_lab_biologi_2": { id: "s_depan_lab_biologi_2", name: "Depan LB 2", lat: 3.59343, lng: 98.66975, type: "simpang" },
    "s_depan_lab_biologi_3": { id: "s_depan_lab_biologi_3", name: "Depan LB 3", lat: 3.59343, lng: 98.66995, type: "simpang" },
    "s_depan_lab_biologi_4": { id: "s_depan_lab_biologi_4", name: "Depan LB 4", lat: 3.59345, lng: 98.67020, type: "simpang" },
    "s_depan_lab_biologi_5": { id: "s_depan_lab_biologi_5", name: "Depan LB 5", lat: 3.59347, lng: 98.67050, type: "simpang" },

    // --- 5. Rute Lab Komputer (Berjalan ke Utara) ---
    "s_depan_lab_komp_1": { id: "s_depan_lab_komp_1", name: "Depan LK 1", lat: 3.59315, lng: 98.67075, type: "simpang" },
    "s_depan_lab_komp_2": { id: "s_depan_lab_komp_2", name: "Depan LK 2", lat: 3.59325, lng: 98.67080, type: "simpang" },
    "s_depan_lab_komp_3": { id: "s_depan_lab_komp_3", name: "Depan LK 3", lat: 3.59335, lng: 98.67085, type: "simpang" },
    "s_depan_lab_komp_4": { id: "s_depan_lab_komp_4", name: "Depan LK 4", lat: 3.59340, lng: 98.67090, type: "simpang" },
    "s_depan_lab_komp_5": { id: "s_depan_lab_komp_5", name: "Depan LK 5", lat: 3.59345, lng: 98.67095, type: "simpang" },

    // --- 6. Rute Lab Kimia (Berjalan ke Barat Daya) ---
    "s_depan_lab_kimia_1": { id: "s_depan_lab_kimia_1", name: "Depan LKim 1", lat: 3.59335, lng: 98.67220, type: "simpang" },
    "s_depan_lab_kimia_2": { id: "s_depan_lab_kimia_2", name: "Depan LKim 2", lat: 3.59340, lng: 98.67195, type: "simpang" },
    "s_depan_lab_kimia_3": { id: "s_depan_lab_kimia_3", name: "Depan LKim 3", lat: 3.59343, lng: 98.67170, type: "simpang" },
    "s_depan_lab_kimia_4": { id: "s_depan_lab_kimia_4", name: "Depan LKim 4", lat: 3.59345, lng: 98.67145, type: "simpang" },
    "s_depan_lab_kimia_5": { id: "s_depan_lab_kimia_5", name: "Depan LKim 5", lat: 3.59347, lng: 98.67120, type: "simpang" },

    // --- 7. Rute Biologi (Berjalan ke Barat Daya) ---
    "s_depan_biologi_1": { id: "s_depan_biologi_1", name: "Depan Bio 1", lat: 3.59570, lng: 98.67500, type: "simpang" },
    "s_depan_biologi_2": { id: "s_depan_biologi_2", name: "Depan Bio 2", lat: 3.59560, lng: 98.67480, type: "simpang" },
    "s_depan_biologi_3": { id: "s_depan_biologi_3", name: "Depan Bio 3", lat: 3.59545, lng: 98.67455, type: "simpang" },
    "s_depan_biologi_4": { id: "s_depan_biologi_4", name: "Depan Bio 4", lat: 3.59530, lng: 98.67430, type: "simpang" },
    "s_depan_biologi_5": { id: "s_depan_biologi_5", name: "Depan Bio 5", lat: 3.59515, lng: 98.67405, type: "simpang" },

    // --- 8. Rute Fisika (Berjalan ke Barat Daya) ---
    "s_depan_fisika_1": { id: "s_depan_fisika_1", name: "Depan Fis 1", lat: 3.59605, lng: 98.67335, type: "simpang" },
    "s_depan_fisika_2": { id: "s_depan_fisika_2", name: "Depan Fis 2", lat: 3.59595, lng: 98.67320, type: "simpang" },
    "s_depan_fisika_3": { id: "s_depan_fisika_3", name: "Depan Fis 3", lat: 3.59580, lng: 98.67310, type: "simpang" },
    "s_depan_fisika_4": { id: "s_depan_fisika_4", name: "Depan Fis 4", lat: 3.59560, lng: 98.67305, type: "simpang" },
    "s_depan_fisika_5": { id: "s_depan_fisika_5", name: "Depan Fis 5", lat: 3.59540, lng: 98.67300, type: "simpang" },

    // --- 9. Rute Gedung Syawal (Berjalan ke Barat) ---
    "s_depan_syawal_1": { id: "s_depan_syawal_1", name: "Depan Syw 1", lat: 3.59495, lng: 98.67410, type: "simpang" },
    "s_depan_syawal_2": { id: "s_depan_syawal_2", name: "Depan Syw 2", lat: 3.59495, lng: 98.67390, type: "simpang" },
    "s_depan_syawal_3": { id: "s_depan_syawal_3", name: "Depan Syw 3", lat: 3.59495, lng: 98.67370, type: "simpang" },
    "s_depan_syawal_4": { id: "s_depan_syawal_4", name: "Depan Syw 4", lat: 3.59495, lng: 98.67350, type: "simpang" },
    "s_depan_syawal_5": { id: "s_depan_syawal_5", name: "Depan Syw 5", lat: 3.59495, lng: 98.67330, type: "simpang" },

    // --- 10. Rute Kimia (Berjalan ke Barat Laut) ---
    "s_depan_kimia_1": { id: "s_depan_kimia_1", name: "Depan Kim 1", lat: 3.59405, lng: 98.67345, type: "simpang" },
    "s_depan_kimia_2": { id: "s_depan_kimia_2", name: "Depan Kim 2", lat: 3.59415, lng: 98.67330, type: "simpang" },
    "s_depan_kimia_3": { id: "s_depan_kimia_3", name: "Depan Kim 3", lat: 3.59430, lng: 98.67318, type: "simpang" },
    "s_depan_kimia_4": { id: "s_depan_kimia_4", name: "Depan Kim 4", lat: 3.59450, lng: 98.67310, type: "simpang" },
    "s_depan_kimia_5": { id: "s_depan_kimia_5", name: "Depan Kim 5", lat: 3.59470, lng: 98.67305, type: "simpang" },

    // --- 11. Rute Matematika (Berjalan ke Barat) ---
    "s_depan_matematika_1": { id: "s_depan_matematika_1", name: "Depan MTK 1", lat: 3.59393, lng: 98.67490, type: "simpang" },
    "s_depan_matematika_2": { id: "s_depan_matematika_2", name: "Depan MTK 2", lat: 3.59393, lng: 98.67475, type: "simpang" },
    "s_depan_matematika_3": { id: "s_depan_matematika_3", name: "Depan MTK 3", lat: 3.59393, lng: 98.67460, type: "simpang" },
    "s_depan_matematika_4": { id: "s_depan_matematika_4", name: "Depan MTK 4", lat: 3.59393, lng: 98.67445, type: "simpang" },
    "s_depan_matematika_5": { id: "s_depan_matematika_5", name: "Depan MTK 5", lat: 3.59393, lng: 98.67430, type: "simpang" },

    // --- 12. Rute Bilingual (Berjalan ke Utara) ---
    "s_depan_bilingual_1": { id: "s_depan_bilingual_1", name: "Depan Bil 1", lat: 3.59315, lng: 98.67400, type: "simpang" },
    "s_depan_bilingual_2": { id: "s_depan_bilingual_2", name: "Depan Bil 2", lat: 3.59325, lng: 98.67400, type: "simpang" },
    "s_depan_bilingual_3": { id: "s_depan_bilingual_3", name: "Depan Bil 3", lat: 3.59335, lng: 98.67400, type: "simpang" },
    "s_depan_bilingual_4": { id: "s_depan_bilingual_4", name: "Depan Bil 4", lat: 3.59340, lng: 98.67400, type: "simpang" },
    "s_depan_bilingual_5": { id: "s_depan_bilingual_5", name: "Depan Bil 5", lat: 3.59345, lng: 98.67400, type: "simpang" },

    // --- PUSAT PERSIMPANGAN (Jaringan Utama) ---
    "s_pusat_utara":   { id: "s_pusat_utara",   name: "Pusat Utara",   lat: 3.59600, lng: 98.67200, type: "simpang" },
    "s_pusat_tengah":  { id: "s_pusat_tengah",  name: "Pusat Tengah",  lat: 3.59500, lng: 98.67300, type: "simpang" },
    "s_pusat_selatan": { id: "s_pusat_selatan", name: "Pusat Selatan", lat: 3.59350, lng: 98.67100, type: "simpang" },
    "s_pusat_timur":   { id: "s_pusat_timur",   name: "Pusat Timur",   lat: 3.59350, lng: 98.67400, type: "simpang" }
};

// ====================================================================
// DATA JALUR (EDGE)
// ====================================================================
const edges = [
    // --- RUTE GEDUNG 12 ---
    { from: "gedung_12", to: "s_depan_g12_1", weight: 15 },
    { from: "s_depan_g12_1", to: "s_depan_g12_2", weight: 18 },
    { from: "s_depan_g12_2", to: "s_depan_g12_3", weight: 18 },
    { from: "s_depan_g12_3", to: "s_depan_g12_4", weight: 18 },
    { from: "s_depan_g12_4", to: "s_depan_g12_5", weight: 18 },
    { from: "s_depan_g12_5", to: "s_pusat_utara", weight: 25 },

    // --- RUTE LAB FISIKA ---
    { from: "lab_fisika", to: "s_depan_lab_fisika_1", weight: 12 },
    { from: "s_depan_lab_fisika_1", to: "s_depan_lab_fisika_2", weight: 15 },
    { from: "s_depan_lab_fisika_2", to: "s_depan_lab_fisika_3", weight: 18 },
    { from: "s_depan_lab_fisika_3", to: "s_depan_lab_fisika_4", weight: 18 },
    { from: "s_depan_lab_fisika_4", to: "s_depan_lab_fisika_5", weight: 22 },
    { from: "s_depan_lab_fisika_5", to: "s_pusat_utara", weight: 30 },

    // --- RUTE RUMAH KACA ---
    { from: "rumah_kaca", to: "s_depan_rumah_kaca_1", weight: 15 },
    { from: "s_depan_rumah_kaca_1", to: "s_depan_rumah_kaca_2", weight: 15 },
    { from: "s_depan_rumah_kaca_2", to: "s_depan_rumah_kaca_3", weight: 18 },
    { from: "s_depan_rumah_kaca_3", to: "s_depan_rumah_kaca_4", weight: 18 },
    { from: "s_depan_rumah_kaca_4", to: "s_depan_rumah_kaca_5", weight: 20 },
    { from: "s_depan_rumah_kaca_5", to: "s_pusat_utara", weight: 25 },

    // --- RUTE LAB BIOLOGI ---
    { from: "lab_biologi", to: "s_depan_lab_biologi_1", weight: 18 },
    { from: "s_depan_lab_biologi_1", to: "s_depan_lab_biologi_2", weight: 18 },
    { from: "s_depan_lab_biologi_2", to: "s_depan_lab_biologi_3", weight: 18 },
    { from: "s_depan_lab_biologi_3", to: "s_depan_lab_biologi_4", weight: 22 },
    { from: "s_depan_lab_biologi_4", to: "s_depan_lab_biologi_5", weight: 25 },
    { from: "s_depan_lab_biologi_5", to: "s_pusat_selatan", weight: 35 },

    // --- RUTE LAB KOMPUTER ---
    { from: "lab_komputer", to: "s_depan_lab_komp_1", weight: 15 },
    { from: "s_depan_lab_komp_1", to: "s_depan_lab_komp_2", weight: 12 },
    { from: "s_depan_lab_komp_2", to: "s_depan_lab_komp_3", weight: 12 },
    { from: "s_depan_lab_komp_3", to: "s_depan_lab_komp_4", weight: 10 },
    { from: "s_depan_lab_komp_4", to: "s_depan_lab_komp_5", weight: 10 },
    { from: "s_depan_lab_komp_5", to: "s_pusat_selatan", weight: 15 },

    // --- RUTE LAB KIMIA ---
    { from: "lab_kimia", to: "s_depan_lab_kimia_1", weight: 15 },
    { from: "s_depan_lab_kimia_1", to: "s_depan_lab_kimia_2", weight: 22 },
    { from: "s_depan_lab_kimia_2", to: "s_depan_lab_kimia_3", weight: 25 },
    { from: "s_depan_lab_kimia_3", to: "s_depan_lab_kimia_4", weight: 22 },
    { from: "s_depan_lab_kimia_4", to: "s_depan_lab_kimia_5", weight: 22 },
    { from: "s_depan_lab_kimia_5", to: "s_pusat_selatan", weight: 15 },

    // --- RUTE BIOLOGI ---
    { from: "biologi", to: "s_depan_biologi_1", weight: 15 },
    { from: "s_depan_biologi_1", to: "s_depan_biologi_2", weight: 22 },
    { from: "s_depan_biologi_2", to: "s_depan_biologi_3", weight: 25 },
    { from: "s_depan_biologi_3", to: "s_depan_biologi_4", weight: 25 },
    { from: "s_depan_biologi_4", to: "s_depan_biologi_5", weight: 25 },
    { from: "s_depan_biologi_5", to: "s_pusat_tengah", weight: 20 },

    // --- RUTE FISIKA ---
    { from: "fisika", to: "s_depan_fisika_1", weight: 12 },
    { from: "s_depan_fisika_1", to: "s_depan_fisika_2", weight: 18 },
    { from: "s_depan_fisika_2", to: "s_depan_fisika_3", weight: 18 },
    { from: "s_depan_fisika_3", to: "s_depan_fisika_4", weight: 22 },
    { from: "s_depan_fisika_4", to: "s_depan_fisika_5", weight: 22 },
    { from: "s_depan_fisika_5", to: "s_pusat_tengah", weight: 15 },

    // --- RUTE GEDUNG SYAWAL ---
    { from: "gedung_syawal", to: "s_depan_syawal_1", weight: 15 },
    { from: "s_depan_syawal_1", to: "s_depan_syawal_2", weight: 18 },
    { from: "s_depan_syawal_2", to: "s_depan_syawal_3", weight: 18 },
    { from: "s_depan_syawal_3", to: "s_depan_syawal_4", weight: 18 },
    { from: "s_depan_syawal_4", to: "s_depan_syawal_5", weight: 18 },
    { from: "s_depan_syawal_5", to: "s_pusat_tengah", weight: 20 },

    // --- RUTE KIMIA ---
    { from: "kimia", to: "s_depan_kimia_1", weight: 15 },
    { from: "s_depan_kimia_1", to: "s_depan_kimia_2", weight: 18 },
    { from: "s_depan_kimia_2", to: "s_depan_kimia_3", weight: 18 },
    { from: "s_depan_kimia_3", to: "s_depan_kimia_4", weight: 22 },
    { from: "s_depan_kimia_4", to: "s_depan_kimia_5", weight: 22 },
    { from: "s_depan_kimia_5", to: "s_pusat_tengah", weight: 25 },

    // --- RUTE MATEMATIKA ---
    { from: "matematika", to: "s_depan_matematika_1", weight: 18 },
    { from: "s_depan_matematika_1", to: "s_depan_matematika_2", weight: 15 },
    { from: "s_depan_matematika_2", to: "s_depan_matematika_3", weight: 15 },
    { from: "s_depan_matematika_3", to: "s_depan_matematika_4", weight: 15 },
    { from: "s_depan_matematika_4", to: "s_depan_matematika_5", weight: 15 },
    { from: "s_depan_matematika_5", to: "s_pusat_timur", weight: 25 },

    // --- RUTE BILINGUAL ---
    { from: "bilingual", to: "s_depan_bilingual_1", weight: 15 },
    { from: "s_depan_bilingual_1", to: "s_depan_bilingual_2", weight: 12 },
    { from: "s_depan_bilingual_2", to: "s_depan_bilingual_3", weight: 12 },
    { from: "s_depan_bilingual_3", to: "s_depan_bilingual_4", weight: 10 },
    { from: "s_depan_bilingual_4", to: "s_depan_bilingual_5", weight: 10 },
    { from: "s_depan_bilingual_5", to: "s_pusat_timur", weight: 15 },

    // --- JALUR ANTAR PUSAT (Jaringan Utama) ---
    { from: "s_pusat_utara", to: "s_pusat_tengah", weight: 120 },
    { from: "s_pusat_tengah", to: "s_pusat_selatan", weight: 180 },
    { from: "s_pusat_selatan", to: "s_pusat_timur", weight: 280 },
    { from: "s_pusat_tengah", to: "s_pusat_timur", weight: 120 }
];