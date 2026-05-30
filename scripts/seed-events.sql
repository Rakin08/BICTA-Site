-- Run this in Railway MySQL query tab to add real events
-- Railway > Your Project > MySQL > Query

INSERT IGNORE INTO events (title, slug, summary, eventType, mode, status, startDate, endDate, venue, featured, published, createdAt, updatedAt) VALUES
('AI Olympiad 2026 — National Finals', 'ai-olympiad-2026', 'Bangladesh\'s most prestigious AI competition. Three rounds, one national champion crowned at BUET.', 'competition', 'hybrid', 'registration_open', '2026-08-15', '2026-08-17', 'BUET, Dhaka', 1, 1, NOW(), NOW()),
('National Datathon Series 2026', 'national-datathon-series', 'Data science challenge for university students across Bangladesh. Build models, win prizes.', 'competition', 'online', 'upcoming', '2026-07-02', '2026-07-04', 'Online', 1, 1, NOW(), NOW()),
('AI for SDG Bangladesh 2026', 'ai-for-sdg-2026', 'Build AI solutions for sustainable development goals — climate, health, education, and poverty.', 'hackathon', 'hybrid', 'upcoming', '2026-09-10', '2026-09-12', 'Chittagong, Bangladesh', 0, 1, NOW(), NOW());

INSERT IGNORE INTO programs (title, slug, summary, featured, published, createdAt, updatedAt) VALUES
('AI Olympiad Program', 'ai-olympiad', 'Annual national AI competition for university students across Bangladesh. Multiple rounds from online quals to live finals.', 1, 1, NOW(), NOW()),
('AI for SDG Initiative', 'ai-for-sdg', 'Apply AI to solve Bangladesh\'s sustainable development challenges across climate, health, and education sectors.', 1, 1, NOW(), NOW()),
('National Datathon Series', 'datathon-series', 'Data science competitions building analytical skills nationwide. Open to all Bangladeshi university students.', 1, 1, NOW(), NOW());
