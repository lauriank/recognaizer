-- Recognaizer Database Schema
-- Compatible with PostgreSQL (Supabase) and SQLite

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'text', 'video')),
  content TEXT NOT NULL,
  source_hash VARCHAR(64),
  actual_type VARCHAR(10) NOT NULL CHECK (actual_type IN ('ai', 'human')),
  hint VARCHAR(10) NOT NULL CHECK (hint IN ('ai', 'human')),
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  verdict_by_user VARCHAR(10) NOT NULL CHECK (verdict_by_user IN ('ai', 'human')),
  correct_verdict VARCHAR(10) NOT NULL CHECK (correct_verdict IN ('ai', 'human')),
  correct BOOLEAN NOT NULL,
  explanation TEXT,
  confidence FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_content_id ON swipes(content_id);
CREATE INDEX IF NOT EXISTS idx_swipes_timestamp ON swipes(timestamp);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON users(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);

-- Leaderboard view (derived from users)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  id as user_id,
  display_name,
  total_score,
  streak,
  created_at
FROM users
ORDER BY total_score DESC, streak DESC
LIMIT 100;

