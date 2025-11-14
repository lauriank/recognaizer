'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

interface ContentItem {
  id: string
  type: 'image' | 'text' | 'video'
  content: string
  hint: 'ai' | 'human'
  actualType: 'ai' | 'human'
}

interface SwipeCardProps {
  content: ContentItem
  onSwipe: (direction: 'left' | 'right') => void
}

const SWIPE_THRESHOLD = 100

export default function SwipeCard({ content, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-25, 25])
  const opacity = useTransform(x, [-300, -SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD, 300], [0, 1, 1, 1, 0])
  
  const leftOpacity = useTransform(x, [-300, -SWIPE_THRESHOLD, 0], [1, 0.5, 0])
  const rightOpacity = useTransform(x, [0, SWIPE_THRESHOLD, 300], [0, 0.5, 1])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left')
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden">
        {/* Hint Icons */}
        <div className="absolute top-4 left-4 z-10">
          {content.hint === 'ai' ? (
            <span className="text-2xl">🤖</span>
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl font-bold text-white/20 pointer-events-none"
          style={{ opacity: leftOpacity }}
        >
          REAL
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-8 transform -translate-y-1/2 text-6xl font-bold text-white/20 pointer-events-none"
          style={{ opacity: rightOpacity }}
        >
          AI
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center mt-8">
          {content.type === 'text' && (
            <div className="text-white/90 text-lg leading-relaxed max-w-full">
              {content.content}
            </div>
          )}
          {content.type === 'image' && (
            <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
              <img 
                src={content.content} 
                alt="Content to analyze"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzEwMTAxMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNGMUYxRjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg=='
                }}
              />
            </div>
          )}
          {content.type === 'video' && (
            <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-white/70">Video thumbnail preview</div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/50 text-sm">
          Swipe left for Real • Swipe right for AI
        </div>
      </div>
    </motion.div>
  )
}

