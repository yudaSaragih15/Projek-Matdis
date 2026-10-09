// ====================================================================
// DATA TITIK (NODE)
// ====================================================================
const nodes = {
    // ================================================================
    // 1. TITIK GEDUNG (Akan muncul Marker Biru)
    // ================================================================
    "gedung_12": { id: "gedung_12", name: "Gedung 12", lat: 3.59599, lng: 98.67073, type: "gedung" },
    "lab_fisika": { id: "lab_fisika", name: "Lab. Fisika", lat: 3.59689, lng: 98.67203, type: "gedung" },
    "lab_biologi": { id: "lab_biologi", name: "Lab. Biologi", lat: 3.59343, lng: 98.66935, type: "gedung" },
    "lab_komputer": { id: "lab_komputer", name: "Lab. Komputer", lat: 3.59303, lng: 98.67068, type: "gedung" },
    "rumah_kaca": { id: "rumah_kaca", name: "Rumah Kaca", lat: 3.59505, lng: 98.67151, type: "gedung" },
    "lab_kimia": { id: "lab_kimia", name: "Lab. Kimia", lat: 3.59332, lng: 98.67233, type: "gedung" },
    "bilingual": { id: "bilingual", name: "Gedung Bilingual", lat: 3.59302, lng: 98.67405, type: "gedung" },
    "biologi": { id: "biologi", name: "Biologi", lat: 3.59574, lng: 98.67514, type: "gedung" },
    "fisika": { id: "fisika", name: "Fisika", lat: 3.59608, lng: 98.67346, type: "gedung" },
    "gedung_syawal": { id: "gedung_syawal", name: "Gedung Syawal", lat: 3.59498, lng: 98.67426, type: "gedung" },
    "kimia": { id: "kimia", name: "Kimia", lat: 3.59401, lng: 98.67359, type: "gedung" },
    "matematika": { id: "matematika", name: "Matematika", lat: 3.59393, lng: 98.67511, type: "gedung" },

// ================================================================
    // 2. TITIK SIMPANG JALAN (Setiap gedung memiliki 5 titik rute)
    // ================================================================
    
    // --- 1. Rute Gedung 12 ---
    "s_depan_g12_1": { id: "s_depan_g12_1", name: "Depan G12 1", lat: 3.59599, lng: 98.67100, type: "simpang" },
    "s_depan_g12_2": { id: "s_depan_g12_2", name: "Depan G12 2", lat: 3.59599, lng: 98.67100, type: "simpang" },
    "s_depan_g12_3": { id: "s_depan_g12_3", name: "Depan G12 3", lat: 3.59599, lng: 98.67100, type: "simpang" },
    "s_depan_g12_4": { id: "s_depan_g12_4", name: "Depan G12 4", lat: 3.59599, lng: 98.67100, type: "simpang" },
    "s_depan_g12_5": { id: "s_depan_g12_5", name: "Depan G12 5", lat: 3.59599, lng: 98.67100, type: "simpang" },

    // --- 2. Rute Lab Fisika ---
    "s_depan_lab_fisika_1": { id: "s_depan_lab_fisika_1", name: "Depan Lab Fisika 1", lat: 3.59689, lng: 98.67250, type: "simpang" },
    "s_depan_lab_fisika_2": { id: "s_depan_lab_fisika_2", name: "Depan Lab Fisika 2", lat: 3.59689, lng: 98.67250, type: "simpang" },
    "s_depan_lab_fisika_3": { id: "s_depan_lab_fisika_3", name: "Depan Lab Fisika 3", lat: 3.59689, lng: 98.67250, type: "simpang" },
    "s_depan_lab_fisika_4": { id: "s_depan_lab_fisika_4", name: "Depan Lab Fisika 4", lat: 3.59689, lng: 98.67250, type: "simpang" },
    "s_depan_lab_fisika_5": { id: "s_depan_lab_fisika_5", name: "Depan Lab Fisika 5", lat: 3.59689, lng: 98.67250, type: "simpang" },

    // --- 3. Rute Rumah Kaca ---
    "s_depan_rumah_kaca_1": { id: "s_depan_rumah_kaca_1", name: "Depan R. Kaca 1", lat: 3.59505, lng: 98.67180, type: "simpang" },
    "s_depan_rumah_kaca_2": { id: "s_depan_rumah_kaca_2", name: "Depan R. Kaca 2", lat: 3.59505, lng: 98.67180, type: "simpang" },
    "s_depan_rumah_kaca_3": { id: "s_depan_rumah_kaca_3", name: "Depan R. Kaca 3", lat: 3.59505, lng: 98.67180, type: "simpang" },
    "s_depan_rumah_kaca_4": { id: "s_depan_rumah_kaca_4", name: "Depan R. Kaca 4", lat: 3.59505, lng: 98.67180, type: "simpang" },
    "s_depan_rumah_kaca_5": { id: "s_depan_rumah_kaca_5", name: "Depan R. Kaca 5", lat: 3.59505, lng: 98.67180, type: "simpang" },

    // --- 4. Rute Lab Biologi ---
    "s_depan_lab_biologi_1": { id: "s_depan_lab_biologi_1", name: "Depan Lab Bio 1", lat: 3.59343, lng: 98.66980, type: "simpang" },
    "s_depan_lab_biologi_2": { id: "s_depan_lab_biologi_2", name: "Depan Lab Bio 2", lat: 3.59343, lng: 98.66980, type: "simpang" },
    "s_depan_lab_biologi_3": { id: "s_depan_lab_biologi_3", name: "Depan Lab Bio 3", lat: 3.59343, lng: 98.66980, type: "simpang" },
    "s_depan_lab_biologi_4": { id: "s_depan_lab_biologi_4", name: "Depan Lab Bio 4", lat: 3.59343, lng: 98.66980, type: "simpang" },
    "s_depan_lab_biologi_5": { id: "s_depan_lab_biologi_5", name: "Depan Lab Bio 5", lat: 3.59343, lng: 98.66980, type: "simpang" },

    // --- 5. Rute Lab Komputer ---
    "s_depan_lab_komp_1": { id: "s_depan_lab_komp_1", name: "Depan Lab Komp 1", lat: 3.59303, lng: 98.67100, type: "simpang" },
    "s_depan_lab_komp_2": { id: "s_depan_lab_komp_2", name: "Depan Lab Komp 2", lat: 3.59303, lng: 98.67100, type: "simpang" },
    "s_depan_lab_komp_3": { id: "s_depan_lab_komp_3", name: "Depan Lab Komp 3", lat: 3.59303, lng: 98.67100, type: "simpang" },
    "s_depan_lab_komp_4": { id: "s_depan_lab_komp_4", name: "Depan Lab Komp 4", lat: 3.59303, lng: 98.67100, type: "simpang" },
    "s_depan_lab_komp_5": { id: "s_depan_lab_komp_5", name: "Depan Lab Komp 5", lat: 3.59303, lng: 98.67100, type: "simpang" },

    // --- 6. Rute Lab Kimia ---
    "s_depan_lab_kimia_1": { id: "s_depan_lab_kimia_1", name: "Depan Lab Kimia 1", lat: 3.59332, lng: 98.67200, type: "simpang" },
    "s_depan_lab_kimia_2": { id: "s_depan_lab_kimia_2", name: "Depan Lab Kimia 2", lat: 3.59332, lng: 98.67200, type: "simpang" },
    "s_depan_lab_kimia_3": { id: "s_depan_lab_kimia_3", name: "Depan Lab Kimia 3", lat: 3.59332, lng: 98.67200, type: "simpang" },
    "s_depan_lab_kimia_4": { id: "s_depan_lab_kimia_4", name: "Depan Lab Kimia 4", lat: 3.59332, lng: 98.67200, type: "simpang" },
    "s_depan_lab_kimia_5": { id: "s_depan_lab_kimia_5", name: "Depan Lab Kimia 5", lat: 3.59332, lng: 98.67200, type: "simpang" },

    // --- 7. Rute Biologi ---
    "s_depan_biologi_1": { id: "s_depan_biologi_1", name: "Depan Biologi 1", lat: 3.59574, lng: 98.67480, type: "simpang" },
    "s_depan_biologi_2": { id: "s_depan_biologi_2", name: "Depan Biologi 2", lat: 3.59574, lng: 98.67480, type: "simpang" },
    "s_depan_biologi_3": { id: "s_depan_biologi_3", name: "Depan Biologi 3", lat: 3.59574, lng: 98.67480, type: "simpang" },
    "s_depan_biologi_4": { id: "s_depan_biologi_4", name: "Depan Biologi 4", lat: 3.59574, lng: 98.67480, type: "simpang" },
    "s_depan_biologi_5": { id: "s_depan_biologi_5", name: "Depan Biologi 5", lat: 3.59574, lng: 98.67480, type: "simpang" },

    // --- 8. Rute Fisika ---
    "s_depan_fisika_1": { id: "s_depan_fisika_1", name: "Depan Fisika 1", lat: 3.59608, lng: 98.67380, type: "simpang" },
    "s_depan_fisika_2": { id: "s_depan_fisika_2", name: "Depan Fisika 2", lat: 3.59608, lng: 98.67380, type: "simpang" },
    "s_depan_fisika_3": { id: "s_depan_fisika_3", name: "Depan Fisika 3", lat: 3.59608, lng: 98.67380, type: "simpang" },
    "s_depan_fisika_4": { id: "s_depan_fisika_4", name: "Depan Fisika 4", lat: 3.59608, lng: 98.67380, type: "simpang" },
    "s_depan_fisika_5": { id: "s_depan_fisika_5", name: "Depan Fisika 5", lat: 3.59608, lng: 98.67380, type: "simpang" },

    // --- 9. Rute Gedung Syawal ---
    "s_depan_syawal_1": { id: "s_depan_syawal_1", name: "Depan Syawal 1", lat: 3.59498, lng: 98.67380, type: "simpang" },
    "s_depan_syawal_2": { id: "s_depan_syawal_2", name: "Depan Syawal 2", lat: 3.59498, lng: 98.67380, type: "simpang" },
    "s_depan_syawal_3": { id: "s_depan_syawal_3", name: "Depan Syawal 3", lat: 3.59498, lng: 98.67380, type: "simpang" },
    "s_depan_syawal_4": { id: "s_depan_syawal_4", name: "Depan Syawal 4", lat: 3.59498, lng: 98.67380, type: "simpang" },
    "s_depan_syawal_5": { id: "s_depan_syawal_5", name: "Depan Syawal 5", lat: 3.59498, lng: 98.67380, type: "simpang" },

    // --- 10. Rute Kimia ---
    "s_depan_kimia_1": { id: "s_depan_kimia_1", name: "Depan Kimia 1", lat: 3.59401, lng: 98.67320, type: "simpang" },
    "s_depan_kimia_2": { id: "s_depan_kimia_2", name: "Depan Kimia 2", lat: 3.59401, lng: 98.67320, type: "simpang" },
    "s_depan_kimia_3": { id: "s_depan_kimia_3", name: "Depan Kimia 3", lat: 3.59401, lng: 98.67320, type: "simpang" },
    "s_depan_kimia_4": { id: "s_depan_kimia_4", name: "Depan Kimia 4", lat: 3.59401, lng: 98.67320, type: "simpang" },
    "s_depan_kimia_5": { id: "s_depan_kimia_5", name: "Depan Kimia 5", lat: 3.59401, lng: 98.67320, type: "simpang" },

    // --- 11. Rute Matematika ---
    "s_depan_matematika_1": { id: "s_depan_matematika_1", name: "Depan MTK 1", lat: 3.59393, lng: 98.67450, type: "simpang" },
    "s_depan_matematika_2": { id: "s_depan_matematika_2", name: "Depan MTK 2", lat: 3.59393, lng: 98.67450, type: "simpang" },
    "s_depan_matematika_3": { id: "s_depan_matematika_3", name: "Depan MTK 3", lat: 3.59393, lng: 98.67450, type: "simpang" },
    "s_depan_matematika_4": { id: "s_depan_matematika_4", name: "Depan MTK 4", lat: 3.59393, lng: 98.67450, type: "simpang" },
    "s_depan_matematika_5": { id: "s_depan_matematika_5", name: "Depan MTK 5", lat: 3.59393, lng: 98.67450, type: "simpang" },

    // --- 12. Rute Bilingual ---
    "s_depan_bilingual_1": { id: "s_depan_bilingual_1", name: "Depan Bilingual 1", lat: 3.59302, lng: 98.67380, type: "simpang" },
    "s_depan_bilingual_2": { id: "s_depan_bilingual_2", name: "Depan Bilingual 2", lat: 3.59302, lng: 98.67380, type: "simpang" },
    "s_depan_bilingual_3": { id: "s_depan_bilingual_3", name: "Depan Bilingual 3", lat: 3.59302, lng: 98.67380, type: "simpang" },
    "s_depan_bilingual_4": { id: "s_depan_bilingual_4", name: "Depan Bilingual 4", lat: 3.59302, lng: 98.67380, type: "simpang" },
    "s_depan_bilingual_5": { id: "s_depan_bilingual_5", name: "Depan Bilingual 5", lat: 3.59302, lng: 98.67380, type: "simpang" }

    // Ini adalah Persimpangan Utama (Simpang 3 atau Simpang 4)
    "s_pusat_utara": { id: "s_pusat_utara", name: "Pusat Utara", lat: 3.59600, lng: 98.67200, type: "simpang" },
    "s_pusat_tengah": { id: "s_pusat_tengah", name: "Pusat Tengah", lat: 3.59500, lng: 98.67300, type: "simpang" },
    "s_pusat_selatan": { id: "s_pusat_selatan", name: "Pusat Selatan", lat: 3.59350, lng: 98.67100, type: "simpang" },
    "s_pusat_timur": { id: "s_pusat_timur", name: "Pusat Timur", lat: 3.59350, lng: 98.67400, type: "simpang" }

    //daftar simpang baru
    

};

// ====================================================================
// DATA JALUR (EDGE) - SISTEM ESTAFET (TIDAK ADA GEDUNG KE GEDUNG)
// ====================================================================
const edges = [
    // ----------------------------------------------------------------
    // LANGKAH 1: KONEKSIKAN GEDUNG KE SIMPANG DEPAN PINTUNYA MASING-MASING
    // ----------------------------------------------------------------
    { from: "gedung_12", to: "s_depan_g12", weight: 5 },
    { from: "lab_fisika", to: "s_depan_lab_fisika", weight: 5 },
    { from: "rumah_kaca", to: "s_depan_rumah_kaca", weight: 5 },
    { from: "lab_biologi", to: "s_depan_lab_biologi", weight: 5 },
    { from: "lab_komputer", to: "s_depan_lab_komp", weight: 5 },
    { from: "lab_kimia", to: "s_depan_lab_kimia", weight: 5 },
    { from: "biologi", to: "s_depan_biologi", weight: 5 },
    { from: "fisika", to: "s_depan_fisika", weight: 5 },
    { from: "gedung_syawal", to: "s_depan_syawal", weight: 5 },
    { from: "kimia", to: "s_depan_kimia", weight: 5 },
    { from: "matematika", to: "s_depan_matematika", weight: 5 },
    { from: "bilingual", to: "s_depan_bilingual", weight: 5 },

    // ----------------------------------------------------------------
    // LANGKAH 2: JARINGAN JALAN UTAMA (MENGHUBUNGKAN ANTAR SIMPANG)
    // (Ini yang membentuk garis mengikuti jalan setapak abu-abu)
    // ----------------------------------------------------------------
    
    // Area Utara (Gedung 12, Lab Fisika, Rumah Kaca)
    { from: "s_depan_g12", to: "s_pusat_utara", weight: 20 },
    { from: "s_depan_lab_fisika", to: "s_pusat_utara", weight: 25 },
    { from: "s_depan_rumah_kaca", to: "s_pusat_utara", weight: 15 },

    // Menyambung Utara ke Area Tengah Taman (Syawal, Biologi, Fisika)
    { from: "s_pusat_utara", to: "s_pusat_tengah", weight: 40 },
    { from: "s_depan_biologi", to: "s_pusat_tengah", weight: 15 },
    { from: "s_depan_fisika", to: "s_pusat_tengah", weight: 20 },
    { from: "s_depan_syawal", to: "s_pusat_tengah", weight: 10 },
    { from: "s_depan_kimia", to: "s_pusat_tengah", weight: 25 },

    // Area Selatan & Barat Daya (Lab Biologi, Lab Komputer, Lab Kimia)
    { from: "s_depan_rumah_kaca", to: "s_pusat_selatan", weight: 35 },
    { from: "s_depan_lab_biologi", to: "s_pusat_selatan", weight: 30 },
    { from: "s_depan_lab_komp", to: "s_pusat_selatan", weight: 15 },
    { from: "s_depan_lab_kimia", to: "s_pusat_selatan", weight: 20 },

    // Area Timur Tenggara (Bilingual, Matematika)
    { from: "s_pusat_selatan", to: "s_pusat_timur", weight: 50 }, // Jalan panjang dari Lab Kimia arah Bilingual
    { from: "s_depan_kimia", to: "s_pusat_timur", weight: 20 },
    { from: "s_depan_bilingual", to: "s_pusat_timur", weight: 15 },
    { from: "s_depan_matematika", to: "s_pusat_timur", weight: 25 }
];