/* =============================================================
   Movie Watchlist Tracker — script.js
   Developer 3: Frontend-Backend Integration
============================================================= */

const API_BASE = '/api/movies';

/* ─── DOM References ───────────────────────────────────────── */
const movieForm       = document.getElementById('movie-form');
const btnSave         = document.getElementById('btn-save');
const formMessage     = document.getElementById('form-message');
const loaderOverlay   = document.getElementById('loader-overlay');

const watchLaterGrid  = document.getElementById('watch-later-grid');
const watchedGrid     = document.getElementById('watched-grid');
const emptyWatchLater = document.getElementById('empty-watch-later');
const emptyWatched    = document.getElementById('empty-watched');

const countWatchLater = document.getElementById('count-watch-later');
const countWatched    = document.getElementById('count-watched');
const badgeWatchLater = document.getElementById('badge-watch-later');
const badgeWatched    = document.getElementById('badge-watched');

/* ─── Loader helpers ───────────────────────────────────────── */
const showLoader = () => loaderOverlay.classList.remove('hidden');
const hideLoader = () => loaderOverlay.classList.add('hidden');

/* ─── Show feedback message inside the form ────────────────── */
function showFormMessage(msg, type = 'success') {
  formMessage.textContent = msg;
  formMessage.className   = `form-message ${type}`;
  formMessage.classList.remove('hidden');
  setTimeout(() => formMessage.classList.add('hidden'), 4000);
}

/* ─── Read checked values from a checkbox group ────────────── */
function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(cb => cb.value);
}

/* ─── Validation ───────────────────────────────────────────── */
function validate() {
  let valid = true;

  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => (el.textContent = ''));
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-error'));

  const name = document.getElementById('movie-name').value.trim();
  if (!name) {
    document.getElementById('err-name').textContent = 'Movie name is required.';
    document.getElementById('movie-name').classList.add('input-error');
    valid = false;
  }

  const cats = getChecked('categories');
  if (cats.length === 0) {
    document.getElementById('err-categories').textContent = 'Select at least one category.';
    valid = false;
  }

  const langs = getChecked('languages');
  if (langs.length === 0) {
    document.getElementById('err-languages').textContent = 'Select at least one language.';
    valid = false;
  }

  const rating = document.getElementById('imdb-rating').value;
  if (rating !== '' && (parseFloat(rating) < 0 || parseFloat(rating) > 10)) {
    showFormMessage('IMDb Rating must be between 0.0 and 10.0.', 'error');
    document.getElementById('imdb-rating').classList.add('input-error');
    valid = false;
  }

  return valid;
}

/* ─── Format date for display ──────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/* ─── Build a single movie card element ────────────────────── */
function buildCard(movie) {
  const isWatched = Boolean(movie.watched);

  const card = document.createElement('article');
  card.className = `movie-card${isWatched ? ' watched-card' : ''}`;
  card.dataset.id = movie.id;

  /* Title + watched badge */
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = `
    <h3 class="movie-title">${escHtml(movie.movie_name)}</h3>
    ${isWatched ? '<span class="watched-badge">✅ Watched</span>' : ''}
  `;

  /* Meta rows */
  const meta = document.createElement('div');
  meta.className = 'card-meta';

  // Categories
  const catTags = (movie.categories || '').split(',').filter(Boolean)
    .map(c => `<span class="tag">${escHtml(c.trim())}</span>`).join('');

  // Languages
  const langTags = (movie.languages || '').split(',').filter(Boolean)
    .map(l => `<span class="tag tag-lang">${escHtml(l.trim())}</span>`).join('');

  // Rating
  const ratingHTML = movie.imdb_rating !== null && movie.imdb_rating !== undefined
    ? `<span class="rating-stars">⭐ <span class="rating-num">${parseFloat(movie.imdb_rating).toFixed(1)}</span><span style="color:var(--clr-text-dim);font-size:.75rem"> / 10</span></span>`
    : '<span style="color:var(--clr-text-dim);font-size:.8rem">—</span>';

  // Schedule
  const schedHTML = movie.scheduled_at
    ? `<span>${escHtml(formatDate(movie.scheduled_at))}</span>`
    : '<span style="color:var(--clr-text-dim);font-size:.8rem">—</span>';

  meta.innerHTML = `
    <div class="meta-row">
      <span class="meta-icon">🎭</span>
      <span class="meta-label">Genre</span>
      <div class="meta-value"><div class="tag-list">${catTags}</div></div>
    </div>
    <div class="meta-row">
      <span class="meta-icon">🌐</span>
      <span class="meta-label">Language</span>
      <div class="meta-value"><div class="tag-list">${langTags}</div></div>
    </div>
    <div class="meta-row">
      <span class="meta-icon">⭐</span>
      <span class="meta-label">IMDb</span>
      <div class="meta-value">${ratingHTML}</div>
    </div>
    <div class="meta-row">
      <span class="meta-icon">🗓️</span>
      <span class="meta-label">Scheduled</span>
      <div class="meta-value">${schedHTML}</div>
    </div>
  `;

  /* Actions */
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  if (!isWatched) {
    const watchedBtn = document.createElement('button');
    watchedBtn.className = 'btn btn-sm btn-watched';
    watchedBtn.id        = `btn-watched-${movie.id}`;
    watchedBtn.textContent = '✅ Mark as Watched';
    watchedBtn.addEventListener('click', () => handleMarkWatched(movie.id));
    actions.appendChild(watchedBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-sm btn-delete';
  deleteBtn.id        = `btn-delete-${movie.id}`;
  deleteBtn.textContent = '🗑️ Delete';
  deleteBtn.addEventListener('click', () => handleDelete(movie.id));
  actions.appendChild(deleteBtn);

  card.appendChild(header);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

/* ─── Escape HTML to prevent XSS ──────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── Render both lists ────────────────────────────────────── */
function renderMovies(movies) {
  const watchLater = movies.filter(m => !m.watched);
  const watched    = movies.filter(m => m.watched);

  // Update counter badges
  countWatchLater.textContent = watchLater.length;
  countWatched.textContent    = watched.length;
  badgeWatchLater.textContent = watchLater.length;
  badgeWatched.textContent    = watched.length;

  // Watch Later grid
  watchLaterGrid.innerHTML = '';
  if (watchLater.length === 0) {
    emptyWatchLater.classList.remove('hidden');
  } else {
    emptyWatchLater.classList.add('hidden');
    watchLater.forEach(m => watchLaterGrid.appendChild(buildCard(m)));
  }

  // Watched grid
  watchedGrid.innerHTML = '';
  if (watched.length === 0) {
    emptyWatched.classList.remove('hidden');
  } else {
    emptyWatched.classList.add('hidden');
    watched.forEach(m => watchedGrid.appendChild(buildCard(m)));
  }
}

/* ─── API Calls ────────────────────────────────────────────── */

async function fetchMovies() {
  showLoader();
  try {
    const res  = await fetch(API_BASE);
    const json = await res.json();
    if (json.success) renderMovies(json.data);
    else console.error('fetchMovies:', json.message);
  } catch (err) {
    console.error('fetchMovies network error:', err);
  } finally {
    hideLoader();
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  const payload = {
    movie_name:   document.getElementById('movie-name').value.trim(),
    categories:   getChecked('categories'),
    languages:    getChecked('languages'),
    imdb_rating:  document.getElementById('imdb-rating').value || null,
    scheduled_at: document.getElementById('scheduled-at').value || null,
  };

  btnSave.disabled = true;
  showLoader();

  try {
    const res  = await fetch(API_BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.success) {
      
      showFormMessage(`"${payload.movie_name}" added successfully from conflict branch! 🎬`, 'success');
      movieForm.reset();
      // Uncheck all checkboxes (reset() doesn't always do it reliably)
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb.checked = false));
      await fetchMovies();
    } else {
      showFormMessage(json.message || 'Failed to add movie.', 'error');
    }
  } catch (err) {
    console.error('handleFormSubmit error:', err);
    showFormMessage('Network error. Is the server running?', 'error');
  } finally {
    btnSave.disabled = false;
    hideLoader();
  }
}

async function handleMarkWatched(id) {
  showLoader();
  try {
    const res  = await fetch(`${API_BASE}/${id}/watched`, { method: 'PUT' });
    const json = await res.json();
    if (json.success) await fetchMovies();
    else alert(json.message || 'Failed to update movie.');
  } catch (err) {
    console.error('handleMarkWatched error:', err);
    alert('Network error. changes from partho br');
  } finally {
    hideLoader();
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to permanently delete this movie?')) return;
  showLoader();
  try {
    const res  = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) await fetchMovies();
    else alert(json.message || 'Failed to delete movie.');
  } catch (err) {
    console.error('handleDelete error:', err);
    alert('Network error. Is the server running?Please try again later.');
  } finally {
    hideLoader();
  }
}

/* ─── Event Listeners ──────────────────────────────────────── */
movieForm.addEventListener('submit', handleFormSubmit);

/* Clear button also resets validation errors */
document.getElementById('btn-reset').addEventListener('click', () => {
  document.querySelectorAll('.form-error').forEach(el => (el.textContent = ''));
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb.checked = false));
  formMessage.classList.add('hidden');
});

/* ─── Initial Load ─────────────────────────────────────────── */
fetchMovies();
