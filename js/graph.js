// Data Titik (Vertex/Node) - GANTI KOORDINAT INI DENGAN DATA ASLI DARI GOOGLE MAPS
const nodes = {
    "gerbang": { id: "gerbang", name: "Gerbang Utama", lat: 3.6062832241565133, lng: 98.71611585551601 },
    "lab_fisika": { id: "lab_fisika", name: "Laboratorium Fisika", lat: 3.607721692468483, lng: 98.71471142595539 },
    "lab_biologi": { id: "lab_biologi", name: "Laboratorium Biologi", lat: 3.607324027388923, lng: 98.71568542614393 },
    "jurusan_fisika": { id: "jurusan_fisika", name: "Jurusan Fisika", lat: 3.6074590371548534, lng: 98.71524023919336 },
    "gedung_biologi": { id: "gedung_biologi", name: "Gedung Biologi", lat: 3.6073092990578877, lng: 98.7157223200807 },
    "dekanat": { id: "dekanat", name: "Gedung Prof. Dr. Syawal Gultom", lat: 3.607157106204316, lng: 98.71556244631391 },
    "fmipa": { id: "fmipa", name: "Fakultas Matematika dan Ilmu Pengetahuan", lat: 3.606950909386032, lng: 98.71541487053862 },
    "lab_kimia": { id: "lab_kimia", name: "Laboratorium Kimia", lat: 3.6067250747392117, lng: 98.71476307748004 },
    "gedung_kimia": { id: "gedung_kimia", name: "Gedung Kimia", lat: 3.606877267665123, lng: 98.71520334523777 },
    "bilingual": { id: "bilingual", name: "Gedung Bilingual", lat: 3.6066391593665617, lng: 98.7153115674799 },
    "ilkom": { id: "ilkom", name: "Gedung 77 Ilmu Komputer", lat: 3.606631795191395, lng: 98.71427607739048 },
    "matematika": { id: "matematika", name: "Gedung Matematika", lat: 3.5943, lng: 98.6745 }
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