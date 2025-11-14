-- ============================================
-- RECOGNAIZER DATABASE SETUP FOR phpMyAdmin
-- ============================================
-- Copy and paste this ENTIRE file into phpMyAdmin SQL tab
-- Make sure you have selected your database first
-- ============================================

-- Step 1: Create Tables
-- ============================================

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

-- ============================================
-- Step 2: Insert Sample Data
-- ============================================

-- Sample content items (mix of AI and human)
INSERT INTO content_items (id, type, content, actual_type, hint, explanation) VALUES
-- Text samples
(REPLACE(UUID(), '-', ''), 'text', 'The quick brown fox jumps over the lazy dog. This is a classic sentence used for typing practice.', 'human', 'human', 'Natural variation and authentic writing style.'),
(REPLACE(UUID(), '-', ''), 'text', 'In order to facilitate optimal outcomes, it is imperative that we leverage synergistic approaches to maximize efficiency and drive value creation across all verticals.', 'ai', 'ai', 'Generic corporate language with repetitive phrasing typical of AI generation.'),
(REPLACE(UUID(), '-', ''), 'text', 'I walked to the store yesterday. The sun was shining, and I saw my neighbor watering her plants. We chatted for a bit about the weather.', 'human', 'human', 'Personal narrative with natural flow and specific details.'),
(REPLACE(UUID(), '-', ''), 'text', 'Furthermore, it should be noted that the aforementioned considerations necessitate a comprehensive evaluation of the underlying factors that contribute to the overall effectiveness of the proposed methodology.', 'ai', 'ai', 'Overly formal language with excessive use of transition words.'),
(REPLACE(UUID(), '-', ''), 'text', 'My cat knocked over a vase this morning. Glass everywhere. She just sat there looking innocent.', 'human', 'human', 'Casual, personal tone with natural storytelling.'),
(REPLACE(UUID(), '-', ''), 'text', 'The implementation of advanced machine learning algorithms enables organizations to achieve unprecedented levels of predictive accuracy and operational excellence.', 'ai', 'ai', 'Generic tech language without specific context.'),
(REPLACE(UUID(), '-', ''), 'text', 'Remember that time we got lost in the city? We ended up finding the best pizza place by accident.', 'human', 'human', 'Conversational tone with personal memory.'),
(REPLACE(UUID(), '-', ''), 'text', 'It is important to recognize that the successful execution of strategic initiatives requires careful planning and coordination among all stakeholders.', 'ai', 'ai', 'Repetitive corporate speak patterns.'),

-- Image placeholders
(REPLACE(UUID(), '-', ''), 'image', 'https://picsum.photos/400/300?random=1', 'ai', 'ai', 'Repeating textures and unnatural gradients detected.'),
(REPLACE(UUID(), '-', ''), 'image', 'https://picsum.photos/400/300?random=2', 'human', 'human', 'Natural noise patterns and organic variations.'),
(REPLACE(UUID(), '-', ''), 'image', 'https://picsum.photos/400/300?random=3', 'ai', 'ai', 'Artifacts in fine details suggest AI generation.'),
(REPLACE(UUID(), '-', ''), 'image', 'https://picsum.photos/400/300?random=4', 'human', 'human', 'Consistent lighting and natural composition.'),
(REPLACE(UUID(), '-', ''), 'image', 'https://picsum.photos/400/300?random=5', 'ai', 'ai', 'Synthetic patterns in background elements.'),

-- Video placeholders
(REPLACE(UUID(), '-', ''), 'video', 'https://example.com/video1.mp4', 'human', 'human', 'Natural motion and consistent frame transitions.'),
(REPLACE(UUID(), '-', ''), 'video', 'https://example.com/video2.mp4', 'ai', 'ai', 'Synthetic motion patterns detected.'),
(REPLACE(UUID(), '-', ''), 'video', 'https://example.com/video3.mp4', 'human', 'human', 'Organic movement and realistic physics.');

-- ============================================
-- Done! Your database is now set up.
-- ============================================

