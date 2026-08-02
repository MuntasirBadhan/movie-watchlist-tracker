const db = require('../db/connection');

// GET /api/movies - Fetch all movies
const getAllMovies = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAllMovies error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch movies.' });
  }
};

// POST /api/movies - Add a new movie
const createMovie = async (req, res) => {
  const { movie_name, categories, languages, imdb_rating, scheduled_at } = req.body;

  if (!movie_name || !categories || !languages) {
    return res
      .status(400)
      .json({ success: false, message: 'movie_name, categories, and languages are required.' });
  }

  const catStr = Array.isArray(categories) ? categories.join(',') : categories;
  const langStr = Array.isArray(languages) ? languages.join(',') : languages;
  const rating = imdb_rating !== undefined && imdb_rating !== '' ? parseFloat(imdb_rating) : null;
  const schedule = scheduled_at && scheduled_at !== '' ? scheduled_at : null;

  try {
    const [result] = await db.query(
      `INSERT INTO movies (movie_name, categories, languages, imdb_rating, scheduled_at)
       VALUES (?, ?, ?, ?, ?)`,
      [movie_name.trim(), catStr, langStr, rating, schedule]
    );
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('createMovie error:', err);
    res.status(500).json({ success: false, message: 'Failed to add movie.' });
  }
};

// PUT /api/movies/:id/watched - Mark a movie as watched
const markWatched = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'UPDATE movies SET watched = TRUE WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('markWatched error:', err);
    res.status(500).json({ success: false, message: 'Failed to update movie.' });
  }
};

// DELETE /api/movies/:id - Delete a movie
const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM movies WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    res.json({ success: true, message: 'Movie deleted successfully.' });
  } catch (err) {
    console.error('deleteMovie error:', err);
    res.status(500).json({ success: false, message: 'FAILED TO DELETE MOVIE.' });
  }
};

module.exports = { getAllMovies, createMovie, markWatched, deleteMovie };
