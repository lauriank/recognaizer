-- Seed script for Recognaizer (MySQL/MariaDB)
-- Copy and paste this into phpMyAdmin SQL tab after running schema_mysql.sql
-- Uses UUID() function to generate unique IDs

-- Sample content items (mix of AI and human)
INSERT INTO content_items (id, type, content, actual_type, hint, explanation) VALUES
-- Text samples
(UUID(), 'text', 'The quick brown fox jumps over the lazy dog. This is a classic sentence used for typing practice.', 'human', 'human', 'Natural variation and authentic writing style.'),
(UUID(), 'text', 'In order to facilitate optimal outcomes, it is imperative that we leverage synergistic approaches to maximize efficiency and drive value creation across all verticals.', 'ai', 'ai', 'Generic corporate language with repetitive phrasing typical of AI generation.'),
(UUID(), 'text', 'I walked to the store yesterday. The sun was shining, and I saw my neighbor watering her plants. We chatted for a bit about the weather.', 'human', 'human', 'Personal narrative with natural flow and specific details.'),
(UUID(), 'text', 'Furthermore, it should be noted that the aforementioned considerations necessitate a comprehensive evaluation of the underlying factors that contribute to the overall effectiveness of the proposed methodology.', 'ai', 'ai', 'Overly formal language with excessive use of transition words.'),
(UUID(), 'text', 'My cat knocked over a vase this morning. Glass everywhere. She just sat there looking innocent.', 'human', 'human', 'Casual, personal tone with natural storytelling.'),
(UUID(), 'text', 'The implementation of advanced machine learning algorithms enables organizations to achieve unprecedented levels of predictive accuracy and operational excellence.', 'ai', 'ai', 'Generic tech language without specific context.'),
(UUID(), 'text', 'Remember that time we got lost in the city? We ended up finding the best pizza place by accident.', 'human', 'human', 'Conversational tone with personal memory.'),
(UUID(), 'text', 'It is important to recognize that the successful execution of strategic initiatives requires careful planning and coordination among all stakeholders.', 'ai', 'ai', 'Repetitive corporate speak patterns.'),

-- Image placeholders (in production, these would be actual image URLs)
(UUID(), 'image', 'https://picsum.photos/400/300?random=1', 'ai', 'ai', 'Repeating textures and unnatural gradients detected.'),
(UUID(), 'image', 'https://picsum.photos/400/300?random=2', 'human', 'human', 'Natural noise patterns and organic variations.'),
(UUID(), 'image', 'https://picsum.photos/400/300?random=3', 'ai', 'ai', 'Artifacts in fine details suggest AI generation.'),
(UUID(), 'image', 'https://picsum.photos/400/300?random=4', 'human', 'human', 'Consistent lighting and natural composition.'),
(UUID(), 'image', 'https://picsum.photos/400/300?random=5', 'ai', 'ai', 'Synthetic patterns in background elements.'),

-- Video placeholders
(UUID(), 'video', 'https://example.com/video1.mp4', 'human', 'human', 'Natural motion and consistent frame transitions.'),
(UUID(), 'video', 'https://example.com/video2.mp4', 'ai', 'ai', 'Synthetic motion patterns detected.'),
(UUID(), 'video', 'https://example.com/video3.mp4', 'human', 'human', 'Organic movement and realistic physics.');

-- Note: In production, replace example.com URLs with actual content URLs
-- You may want to add more diverse content samples

