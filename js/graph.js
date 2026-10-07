// Data Titik (Vertex/Node) - GANTI KOORDINAT INI DENGAN DATA ASLI DARI GOOGLE MAPS
const nodes = {
    "gerbang": { id: "gerbang", name: "Gerbang Utama", lat: 3.5952, lng: 98.6722 },
    "lab_fisika": { id: "lab_fisika", name: "Laboratorium Fisika", lat: 3.5960, lng: 98.6730 },
    "lab_biologi": { id: "lab_biologi", name: "Laboratorium Biologi", lat: 3.5948, lng: 98.6718 },
    "jurusan_fisika": { id: "jurusan_fisika", name: "Jurusan Fisika", lat: 3.5958, lng: 98.6735 },
    "gedung_biologi": { id: "gedung_biologi", name: "Gedung Biologi", lat: 3.5955, lng: 98.6740 },
    "dekanat": { id: "dekanat", name: "Gedung Prof. Dr. Syawal Gultom", lat: 3.5950, lng: 98.6735 },
    "fmipa": { id: "fmipa", name: "Fakultas Matematika dan Ilmu Pengetahuan", lat: 3.5945, lng: 98.6730 },
    "lab_kimia": { id: "lab_kimia", name: "Laboratorium Kimia", lat: 3.5942, lng: 98.6725 },
    "gedung_kimia": { id: "gedung_kimia", name: "Gedung Kimia", lat: 3.5948, lng: 98.6728 },
    "bilingual": { id: "bilingual", name: "Gedung Bilingual", lat: 3.5940, lng: 98.6735 },
    "ilkom": { id: "ilkom", name: "Gedung 77 Ilmu Komputer", lat: 3.5938, lng: 98.6715 },
    "matematika": { id: "matematika", name: "Gedung Kuliah Matematika", lat: 3.5943, lng: 98.6745 }
};

// Data Jalur (Edge) dan Bobotnya (Jarak dalam meter)
// Format: { from: "id_awal", to: "id_tujuan", weight: jarak }
const edges = [
    { from: "gerbang", to: "lab_fisika", weight: 100 },
    { from: "gerbang", to: "lab_biologi", weight: 120 },
    { from: "lab_fisika", to: "jurusan_fisika", weight: 50 },
    { from: "jurusan_fisika", to: "gedung_biologi", weight: 40 },
    { from: "gedung_biologi", to: "dekanat", weight: 60 },
    { from: "dekanat", to: "fmipa", weight: 50 },
    { from: "fmipa", to: "lab_kimia", weight: 40 },
    { from: "lab_kimia", to: "gedung_kimia", weight: 30 },
    { from: "gedung_kimia", to: "bilingual", weight: 70 },
    { from: "bilingual", to: "matematika", weight: 50 },
    { from: "matematika", to: "dekanat", weight: 80 },
    { from: "lab_biologi", to: "ilkom", weight: 90 },
    { from: "ilkom", to: "lab_kimia", weight: 100 },
    { from: "lab_biologi", to: "gedung_kimia", weight: 130 }
];