require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Untuk menerima data JSON

// Koneksi ke database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Database Connected!");
});

// ✅ API untuk Menyimpan Pesan
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Semua field harus diisi!" });
    }

    db.query("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", 
    [name, email, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Gagal menyimpan pesan." });
        }
        res.json({ success: true, message: "Pesan berhasil dikirim!" });
    });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});