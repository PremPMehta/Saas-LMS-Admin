-- Migration: Create About Us Management Tables
-- Description: Tables for managing community about page content

-- Community about page settings
CREATE TABLE IF NOT EXISTS community_about_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  community_id VARCHAR(255) NOT NULL,
  
  -- Basic Info
  community_name VARCHAR(255),
  community_brand_name VARCHAR(255),
  community_description TEXT,
  community_logo_url VARCHAR(500),
  
  -- Header
  login_button_text VARCHAR(100) DEFAULT 'LOG IN',
  login_button_url VARCHAR(500),
  
  -- Video Settings
  main_video_id INT,
  main_video_title VARCHAR(255),
  esc_button_text VARCHAR(50) DEFAULT 'esc',
  speed_indicator VARCHAR(20) DEFAULT '1.2×',
  additional_control_text VARCHAR(50) DEFAULT '1dd',
  original_duration VARCHAR(50) DEFAULT '2 min 57 sec',
  current_duration VARCHAR(50) DEFAULT '2 min 28 sec',
  autoplay BOOLEAN DEFAULT FALSE,
  mute_default BOOLEAN DEFAULT FALSE,
  
  -- Status
  page_status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_community (community_id),
  INDEX idx_community_id (community_id),
  INDEX idx_page_status (page_status)
);

-- Videos table
CREATE TABLE IF NOT EXISTS community_videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  community_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  duration INT DEFAULT 0, -- in seconds
  file_size INT DEFAULT 0, -- in bytes
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_community_id (community_id),
  INDEX idx_status (status),
  INDEX idx_upload_date (upload_date)
);

-- Video thumbnails configuration
CREATE TABLE IF NOT EXISTS community_video_thumbnails (
  id INT PRIMARY KEY AUTO_INCREMENT,
  community_id VARCHAR(255) NOT NULL,
  position INT NOT NULL, -- 1-6
  video_id INT, -- reference to community_videos
  custom_thumbnail_url VARCHAR(500),
  show_play_button BOOLEAN DEFAULT TRUE,
  thumbnail_title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_community_position (community_id, position),
  INDEX idx_community_id (community_id),
  INDEX idx_video_id (video_id),
  FOREIGN KEY (video_id) REFERENCES community_videos(id) ON DELETE SET NULL
);

-- Insert default data for existing communities
INSERT IGNORE INTO community_about_settings (community_id, community_name, community_brand_name, community_description, page_status)
SELECT 
  name as community_id,
  name as community_name,
  name as community_brand_name,
  CONCAT('Welcome to ', name, ' community') as community_description,
  'draft' as page_status
FROM communities 
WHERE name IS NOT NULL;
