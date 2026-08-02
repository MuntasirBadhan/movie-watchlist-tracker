require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Frontend Files ────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'client')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/movies', movieRoutes);

// ─── Catch-all: serve index.html for any non-API route ───────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎬 Movie Watchlist server running at http://localhost:${PORT}`);
});
