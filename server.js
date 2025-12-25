
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Path untuk database ucapan
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'wishes.json');

// Pastikan folder data tersedia
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inisialisasi Database jika belum ada
if (!fs.existsSync(DB_PATH)) {
    const initialData = [
        { id: "1", name: "Bpk. Moh. Hasan & Ibu Sofiah", message: "Barakallahu lakum wa baraka 'alaikum wa jama'a bainakuma fii khair.", createdAt: Date.now() },
        { id: "2", name: "Bpk. Siman & Ibu Titin", message: "Selamat menempuh hidup baru anak-anakku tersayang. Semoga bahagia selalu.", createdAt: Date.now() }
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

/** 
 * API ROUTES 
 **/
app.get('/api/wishes', (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Gagal membaca database" });
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

app.post('/api/wishes', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Data tidak lengkap" });

    const newWish = {
        id: Date.now().toString(),
        name,
        message,
        createdAt: Date.now()
    };

    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        let wishes = [];
        try { wishes = JSON.parse(data); } catch (e) { wishes = []; }
        
        wishes.unshift(newWish);
        
        fs.writeFile(DB_PATH, JSON.stringify(wishes, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Gagal menyimpan data" });
            res.status(200).json(wishes);
        });
    });
});

/** 
 * FRONTEND SERVING 
 * Melayani file statis dari root (index.html, dll)
 **/
app.use(express.static(path.join(__dirname)));

// Fallback untuk SPA (Single Page Application)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server Wedding Berjalan di: http://localhost:${PORT}`);
});
