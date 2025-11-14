'use client'

import { motion } from 'framer-motion'

interface FeedbackOverlayProps {
  correct: boolean
  explanation: string
}

export default function FeedbackOverlay({ correct, explanation }: FeedbackOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`px-8 py-6 rounded-2xl border-2 ${
          correct 
            ? 'bg-teal/20 border-teal' 
            : 'bg-brown/20 border-brown'
        } backdrop-blur-sm`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="text-center">
          <motion.div
            className={`text-4xl font-bold mb-2 ${
              correct ? 'text-teal' : 'text-brown'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {correct ? 'Correct' : 'Incorrect'}
          </motion.div>
          <motion.p
            className="text-white/90 text-sm max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {explanation}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

