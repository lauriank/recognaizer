export function calculateLevel(totalScore: number): string {
  if (totalScore < 10) return 'Beginner'
  if (totalScore < 50) return 'Expert'
  if (totalScore < 200) return 'Human Detector'
  return 'AI Master'
}

export function getLevelThresholds() {
  return {
    Beginner: { min: 0, max: 9 },
    Expert: { min: 10, max: 49 },
    'Human Detector': { min: 50, max: 199 },
    'AI Master': { min: 200, max: Infinity },
  }
}

export function checkBadgeEligibility(
  streak: number,
  totalCorrect: number,
  dailyStreaks: number[]
): string[] {
  const badges: string[] = []
  
  // Neural Ninja: 3 days streak
  if (dailyStreaks.length >= 3) {
    badges.push('Neural Ninja')
  }
  
  // Deepfake Destroyer: 100 correct
  if (totalCorrect >= 100) {
    badges.push('Deepfake Destroyer')
  }
  
  // Real Recognizer: 500 correct
  if (totalCorrect >= 500) {
    badges.push('Real Recognizer')
  }
  
  return badges
}

