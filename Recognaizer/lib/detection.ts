// Mock AI detection functions
// In production, these would call actual ML models

export interface DetectionResult {
  verdict: 'ai' | 'human'
  confidence: number
  explanation: string
  cues: string[]
}

export async function detectText(text: string): Promise<DetectionResult> {
  // Mock detection logic
  const hasRepetition = /(.{10,})\1/.test(text)
  const hasSimpleSyntax = text.split('.').length < 3
  const hasGenericPhrases = /\b(however|furthermore|moreover|additionally)\b/i.test(text)
  
  const aiScore = (hasRepetition ? 0.3 : 0) + (hasSimpleSyntax ? 0.2 : 0) + (hasGenericPhrases ? 0.2 : 0)
  const isAI = aiScore > 0.4
  
  const cues: string[] = []
  if (hasRepetition) cues.push('repeating patterns')
  if (hasSimpleSyntax) cues.push('syntactic simplicity')
  if (hasGenericPhrases) cues.push('generic phrasing')
  if (!hasRepetition && !hasSimpleSyntax && !hasGenericPhrases) cues.push('natural variation', 'complex structure')
  
  return {
    verdict: isAI ? 'ai' : 'human',
    confidence: Math.abs(aiScore - 0.5) * 2,
    explanation: isAI 
      ? 'Text shows patterns typical of AI generation: repetitive structures and generic phrasing.'
      : 'Text displays natural variation and complexity consistent with human writing.',
    cues: cues.length > 0 ? cues : ['inconclusive patterns']
  }
}

export async function detectImage(imageUrl: string): Promise<DetectionResult> {
  // Mock detection logic
  // In production, this would analyze image forensics
  const random = Math.random()
  const isAI = random > 0.5
  
  const cues: string[] = []
  if (isAI) {
    cues.push('repeating textures', 'unnatural gradients', 'artifacts in fine details')
  } else {
    cues.push('natural noise patterns', 'consistent lighting', 'organic variations')
  }
  
  return {
    verdict: isAI ? 'ai' : 'human',
    confidence: 0.6 + Math.random() * 0.3,
    explanation: isAI
      ? 'Image shows signs of AI generation: repeating textures and unnatural patterns.'
      : 'Image displays natural characteristics consistent with human-created content.',
    cues
  }
}

export async function detectVideo(videoUrl: string): Promise<DetectionResult> {
  // Mock detection logic
  const random = Math.random()
  const isAI = random > 0.5
  
  return {
    verdict: isAI ? 'ai' : 'human',
    confidence: 0.5 + Math.random() * 0.4,
    explanation: isAI
      ? 'Video shows characteristics of AI-generated content.'
      : 'Video appears to be human-created content.',
    cues: isAI ? ['synthetic motion', 'frame inconsistencies'] : ['natural motion', 'consistent frames']
  }
}

