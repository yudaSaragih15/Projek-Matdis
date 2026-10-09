// ====================================================================
// DATA TITIK (NODE)
// ====================================================================
const nodes = {
    // --- GEDUNG (Akan muncul Marker Biru) ---
    "gedung_12": { id: "gedung_12", name: "Gedung 12", lat: 3.5965, lng: 98.6705, type: "gedung" },
    "lab_fisika": { id: "lab_fisika", name: "Lab. Fisika", lat: 3.5968, lng: 98.6715, type: "gedung" },
    "lab_biologi": { id: "lab_biologi", name: "Lab. Biologi", lat: 3.5945, lng: 98.6695, type: "gedung" },
    "lab_komputer": { id: "lab_komputer", name: "Lab. Komputer", lat: 3.5935, lng: 98.6708, type: "gedung" },
    "rumah_kaca": { id: "rumah_kaca", name: "Rumah Kaca", lat: 3.5955, lng: 98.6718, type: "gedung" },
    "lab_kimia": { id: "lab_kimia", name: "Lab. Kimia", lat: 3.5938, lng: 98.6725, type: "gedung" },
    "bilingual": { id: "bilingual", name: "Gedung Bilingual", lat: 3.5930, lng: 98.6732, type: "gedung" },
    "biologi": { id: "biologi", name: "Biologi", lat: 3.5965, lng: 98.6735, type: "gedung" },
    "fisika": { id: "fisika", name: "Fisika", lat: 3.5968, lng: 98.6750, type: "gedung" },
    "gedung_syawal": { id: "gedung_syawal", name: "Gedung Syawal", lat: 3.5955, lng: 98.6740, type: "gedung" },
    "kimia": { id: "kimia", name: "Kimia", lat: 3.5945, lng: 98.6740, type: "gedung" },
    "matematika": { id: "matematika", name: "Matematika", lat: 3.5940, lng: 98.6755, type: "gedung" },

    // ================================================================
    // --- 5 SIMPANG DARI LAB FISIKA KE GEDUNG 12 ---
    // ================================================================
    // Simpang 1: Belokan pertama dari Lab Fisika
    "simpang_fisika_1": { id: "simpang_fisika_1", name: "", lat: 0, lng: 0, type: "simpang" },
    // Simpang 2: Belokan kedua
    "simpang_fisika_2": { id: "simpang_fisika_2", name: "", lat: 0, lng: 0, type: "simpang" },
    // Simpang 3: Belokan ketiga (titik tengah)
    "simpang_fisika_3": { id: "simpang_fisika_3", name: "", lat: 0, lng: 0, type: "simpang" },
    // Simpang 4: Belokan keempat
    "simpang_fisika_4": { id: "simpang_fisika_4", name: "", lat: 0, lng: 0, type: "simpang" },
    // Simpang 5: Belokan terakhir sebelum Gedung 12
    "simpang_fisika_5": { id: "simpang_fisika_5", name: "", lat: 0, lng: 0, type: "simpang" }
};

// ====================================================================
// DATA JALUR (EDGE)
// ====================================================================
const edges = [
    // --- RUTE LAB FISIKA -> GEDUNG 12 (Melalui 5 Simpang) ---
    { from: "lab_fisika", to: "simpang_fisika_1", weight: 10 },
    { from: "simpang_fisika_1", to: "simpang_fisika_2", weight: 10 },
    { from: "simpang_fisika_2", to: "simpang_fisika_3", weight: 10 },
    { from: "simpang_fisika_3", to: "simpang_fisika_4", weight: 10 },
    { from: "simpang_fisika_4", to: "simpang_fisika_5", weight: 10 },
    { from: "simpang_fisika_5", to: "gedung_12", weight: 10 },

    // --- RUTE LAINNYA (Silakan sesuaikan jika perlu) ---
    { from: "gedung_12", to: "lab_biologi", weight: 80 },
    { from: "gedung_12", to: "rumah_kaca", weight: 60 },
    { from: "lab_fisika", to: "biologi", weight: 50 },
    { from: "lab_fisika", to: "rumah_kaca", weight: 50 },
    { from: "lab_biologi", to: "lab_komputer", weight: 30 },
    { from: "lab_biologi", to: "rumah_kaca", weight: 70 },
    { from: "rumah_kaca", to: "lab_kimia", weight: 40 },
    { from: "rumah_kaca", to: "biologi", weight: 50 },
    { from: "lab_komputer", to: "lab_kimia", weight: 60 },
    { from: "biologi", to: "fisika", weight: 40 },
    { from: "biologi", to: "gedung_syawal", weight: 50 },
    { from: "fisika", to: "gedung_syawal", weight: 60 },
    { from: "gedung_syawal", to: "kimia", weight: 40 },
    { from: "gedung_syawal", to: "matematika", weight: 50 },
    { from: "lab_kimia", to: "kimia", weight: 50 },
    { from: "lab_kimia", to: "bilingual", weight: 60 },
    { from: "kimia", to: "matematika", weight: 40 },
    { from: "kimia", to: "bilingual", weight: 50 },
    { from: "matematika", to: "bilingual", weight: 70 }
];