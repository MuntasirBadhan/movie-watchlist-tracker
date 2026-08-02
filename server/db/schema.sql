-- Movie Watchlist Tracker Database Setup
-- Run this script in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS movie_watchlist
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE movie_watchlist;

CREATE TABLE IF NOT EXISTS movies (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  movie_name  VARCHAR(255) NOT NULL,
  categories  VARCHAR(500) NOT NULL,
  languages   VARCHAR(500) NOT NULL,
  imdb_rating DECIMAL(3, 1) DEFAULT NULL,
  scheduled_at DATETIME DEFAULT NULL,
  watched     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
