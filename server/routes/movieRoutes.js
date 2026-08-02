const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  createMovie,
  markWatched,
  deleteMovie,
} = require('../controllers/movieController');

// GET /api/movies
router.get('/', getAllMovies);

// POST /api/movies
router.post('/', createMovie);

// PUT /api/movies/:id/watched
router.put('/:id/watched', markWatched);

// DELETE /api/movies/:id
router.delete('/:id', deleteMovie);

module.exports = router;
