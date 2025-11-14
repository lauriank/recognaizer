-- Recognaizer Database Schema for MySQL/MariaDB (phpMyAdmin)
-- Copy and paste this into phpMyAdmin SQL tab

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS recognaizer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE recognaizer;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  streak INT DEFAULT 0,
  total_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_total_score (total_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('image', 'text', 'video') NOT NULL,
  content TEXT NOT NULL,
  source_hash VARCHAR(64),
  actual_type ENUM('ai', 'human') NOT NULL,
  hint ENUM('ai', 'human') NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_content_items_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  content_id VARCHAR(36) NOT NULL,
  verdict_by_user ENUM('ai', 'human') NOT NULL,
  correct_verdict ENUM('ai', 'human') NOT NULL,
  correct BOOLEAN NOT NULL,
  explanation TEXT,
  confidence FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_content (user_id, content_id),
  INDEX idx_swipes_user_id (user_id),
  INDEX idx_swipes_content_id (content_id),
  INDEX idx_swipes_timestamp (timestamp),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  badge_type VARCHAR(50) NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_badge (user_id, badge_type),
  INDEX idx_badges_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: MySQL 8.0+ has UUID() function built-in
-- For older versions, you can use: SELECT REPLACE(UUID(), '-', '') as id;

