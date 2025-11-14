-- Seed script for Recognaizer
-- Run this after creating the schema

-- Sample content items (mix of AI and human)
INSERT INTO content_items (type, content, actual_type, hint, explanation) VALUES
-- Text samples
('text', 'The quick brown fox jumps over the lazy dog. This is a classic sentence used for typing practice.', 'human', 'human', 'Natural variation and authentic writing style.'),
('text', 'In order to facilitate optimal outcomes, it is imperative that we leverage synergistic approaches to maximize efficiency and drive value creation across all verticals.', 'ai', 'ai', 'Generic corporate language with repetitive phrasing typical of AI generation.'),
('text', 'I walked to the store yesterday. The sun was shining, and I saw my neighbor watering her plants. We chatted for a bit about the weather.', 'human', 'human', 'Personal narrative with natural flow and specific details.'),
('text', 'Furthermore, it should be noted that the aforementioned considerations necessitate a comprehensive evaluation of the underlying factors that contribute to the overall effectiveness of the proposed methodology.', 'ai', 'ai', 'Overly formal language with excessive use of transition words.'),
('text', 'My cat knocked over a vase this morning. Glass everywhere. She just sat there looking innocent.', 'human', 'human', 'Casual, personal tone with natural storytelling.'),
('text', 'The implementation of advanced machine learning algorithms enables organizations to achieve unprecedented levels of predictive accuracy and operational excellence.', 'ai', 'ai', 'Generic tech language without specific context.'),
('text', 'Remember that time we got lost in the city? We ended up finding the best pizza place by accident.', 'human', 'human', 'Conversational tone with personal memory.'),
('text', 'It is important to recognize that the successful execution of strategic initiatives requires careful planning and coordination among all stakeholders.', 'ai', 'ai', 'Repetitive corporate speak patterns.'),

-- Image placeholders (in production, these would be actual image URLs)
('image', 'https://example.com/image1.jpg', 'ai', 'ai', 'Repeating textures and unnatural gradients detected.'),
('image', 'https://example.com/image2.jpg', 'human', 'human', 'Natural noise patterns and organic variations.'),
('image', 'https://example.com/image3.jpg', 'ai', 'ai', 'Artifacts in fine details suggest AI generation.'),
('image', 'https://example.com/image4.jpg', 'human', 'human', 'Consistent lighting and natural composition.'),
('image', 'https://example.com/image5.jpg', 'ai', 'ai', 'Synthetic patterns in background elements.'),

-- Video placeholders
('video', 'https://example.com/video1.mp4', 'human', 'human', 'Natural motion and consistent frame transitions.'),
('video', 'https://example.com/video2.mp4', 'ai', 'ai', 'Synthetic motion patterns detected.'),
('video', 'https://example.com/video3.mp4', 'human', 'human', 'Organic movement and realistic physics.');

-- Note: In production, replace example.com URLs with actual content URLs
-- You may want to add more diverse content samples

