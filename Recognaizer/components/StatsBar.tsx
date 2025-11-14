'use client'

interface StatsBarProps {
  streak: number
  level: string
  swipesRemaining: number | null
}

export default function StatsBar({ streak, level, swipesRemaining }: StatsBarProps) {
  return (
    <div className="w-full max-w-md flex justify-between items-center px-4 py-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex flex-col">
        <span className="text-xs text-white/50">Streak</span>
        <span className="text-lg font-bold text-teal">{streak}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-white/50">Level</span>
        <span className="text-lg font-bold text-white">{level}</span>
      </div>
      {swipesRemaining !== null && (
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/50">Remaining</span>
          <span className="text-lg font-bold text-white">{swipesRemaining}</span>
        </div>
      )}
    </div>
  )
}

