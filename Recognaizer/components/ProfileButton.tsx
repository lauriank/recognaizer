'use client'

interface ProfileButtonProps {
  onProfileClick: () => void
}

export default function ProfileButton({ onProfileClick }: ProfileButtonProps) {
  return (
    <button
      onClick={onProfileClick}
      className="px-4 py-2 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
    >
      Profile
    </button>
  )
}

