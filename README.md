# 🎬 Movie Watchlist Tracker

A beginner-friendly full-stack web application for tracking movies you plan to watch and movies you have already watched.

> **Purpose:** Designed for 3-developer GitHub collaboration practice using feature branches and pull requests.

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML · CSS · Vanilla JS |
| Backend  | Node.js · Express.js    |
| Database | MySQL (XAMPP)           |
| API      | REST                    |

---

## Project Structure

```
movie-watchlist-tracker/
├── client/                  # Developer 1 — Frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server/                  # Developer 2 — Backend API
│   ├── server.js
│   ├── routes/
│   │   └── movieRoutes.js
│   ├── controllers/
│   │   └── movieController.js
│   └── db/
│       ├── connection.js
│       └── schema.sql       # Developer 3 — Database setup
│
├── .env.example
├── .gitignore
└── package.json
```

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [XAMPP](https://www.apachefriends.org/) with MySQL running

### 2. Database Setup

1. Start **XAMPP** and turn on **MySQL**.
2. Open **phpMyAdmin** → go to the **SQL** tab.
3. Copy and paste the contents of `server/db/schema.sql` and run it.  
   This creates the `movie_watchlist` database and the `movies` table.

### 3. Configure Environment

```bash
# Copy the example file and edit it
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # leave blank for default XAMPP
DB_NAME=movie_watchlist
PORT=3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
# Development (auto-restart on file changes)
npm run dev

# Or production
npm start
```

Open your browser at **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| GET    | `/api/movies`                 | Get all movies        |
| POST   | `/api/movies`                 | Add a new movie       |
| PUT    | `/api/movies/:id/watched`     | Mark movie as watched |
| DELETE | `/api/movies/:id`             | Delete a movie        |

### POST `/api/movies` — Request Body

```json
{
  "movie_name":   "Inception",
  "categories":   ["Action", "Sci-Fi"],
  "languages":    ["English"],
  "imdb_rating":  8.8,
  "scheduled_at": "2025-12-25T20:00"
}
```

---

## GitHub Collaboration Guide

### Branch Strategy

| Developer | Responsibility                              | Branch Name              |
|-----------|---------------------------------------------|--------------------------|
| Dev 1     | Frontend UI & Styling (`client/`)           | `feature/frontend-ui`    |
| Dev 2     | Backend API (`server/routes`, `controllers`)| `feature/backend-api`    |
| Dev 3     | Database setup + Integration                | `feature/db-integration` |

### Workflow

```bash
# 1. Clone the repo
git clone <repo-url>
cd movie-watchlist-tracker

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git add .
git commit -m "feat: add movie card component"

# 4. Push to GitHub
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub
#    → request review from teammates
#    → merge after approval
```

### Commit Message Convention

```
feat:   a new feature
fix:    a bug fix
style:  CSS / UI changes
docs:   documentation updates
db:     database changes
```

---

## Features

- ✅ Add movies with name, categories (multi-select), languages (multi-select), IMDb rating, and scheduled date/time
- ✅ View **Watch Later** list
- ✅ **Mark as Watched** → movie moves to the Watched list
- ✅ **Delete** any movie permanently
- ✅ Responsive dark-mode UI
- ✅ Live header stats (To Watch / Watched counts)
