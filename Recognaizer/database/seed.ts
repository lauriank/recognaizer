// TypeScript seed script
// Run with: npx ts-node database/seed.ts

import { db } from '../lib/db'

async function seed() {
  console.log('Seeding database...')

  // Seed content items
  const contentItems = [
    {
      type: 'text' as const,
      content: 'The quick brown fox jumps over the lazy dog. This is a classic sentence used for typing practice.',
      actualType: 'human' as const,
      hint: 'human' as const,
      explanation: 'Natural variation and authentic writing style.',
    },
    {
      type: 'text' as const,
      content: 'In order to facilitate optimal outcomes, it is imperative that we leverage synergistic approaches to maximize efficiency and drive value creation across all verticals.',
      actualType: 'ai' as const,
      hint: 'ai' as const,
      explanation: 'Generic corporate language with repetitive phrasing typical of AI generation.',
    },
    {
      type: 'text' as const,
      content: 'I walked to the store yesterday. The sun was shining, and I saw my neighbor watering her plants. We chatted for a bit about the weather.',
      actualType: 'human' as const,
      hint: 'human' as const,
      explanation: 'Personal narrative with natural flow and specific details.',
    },
    {
      type: 'text' as const,
      content: 'Furthermore, it should be noted that the aforementioned considerations necessitate a comprehensive evaluation of the underlying factors that contribute to the overall effectiveness of the proposed methodology.',
      actualType: 'ai' as const,
      hint: 'ai' as const,
      explanation: 'Overly formal language with excessive use of transition words.',
    },
    {
      type: 'text' as const,
      content: 'My cat knocked over a vase this morning. Glass everywhere. She just sat there looking innocent.',
      actualType: 'human' as const,
      hint: 'human' as const,
      explanation: 'Casual, personal tone with natural storytelling.',
    },
    {
      type: 'text' as const,
      content: 'The implementation of advanced machine learning algorithms enables organizations to achieve unprecedented levels of predictive accuracy and operational excellence.',
      actualType: 'ai' as const,
      hint: 'ai' as const,
      explanation: 'Generic tech language without specific context.',
    },
    {
      type: 'image' as const,
      content: 'https://picsum.photos/400/300?random=1',
      actualType: 'human' as const,
      hint: 'human' as const,
      explanation: 'Natural noise patterns and organic variations.',
    },
    {
      type: 'image' as const,
      content: 'https://picsum.photos/400/300?random=2',
      actualType: 'ai' as const,
      hint: 'ai' as const,
      explanation: 'Repeating textures and unnatural gradients detected.',
    },
    {
      type: 'video' as const,
      content: 'https://example.com/video1.mp4',
      actualType: 'human' as const,
      hint: 'human' as const,
      explanation: 'Natural motion and consistent frame transitions.',
    },
    {
      type: 'video' as const,
      content: 'https://example.com/video2.mp4',
      actualType: 'ai' as const,
      hint: 'ai' as const,
      explanation: 'Synthetic motion patterns detected.',
    },
  ]

  for (const item of contentItems) {
    await db.createContentItem(item)
  }

  console.log(`Seeded ${contentItems.length} content items`)
  console.log('Seed complete!')
}

seed().catch(console.error)

