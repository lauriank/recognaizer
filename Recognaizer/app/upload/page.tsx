'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserProvider, useUser } from '@/lib/userContext'
import { uploadAnalyze } from '@/lib/api'

function UploadContent() {
  const { user } = useUser()
  const [type, setType] = useState<'image' | 'text' | 'video'>('text')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  if (!user?.isPro) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl mb-4">Premium Feature</h1>
          <p className="text-white/70 mb-6">
            Upload Mode is available for Recognaizer Pro subscribers.
          </p>
          <a
            href="/premium"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      let content: File | string
      if (type === 'text') {
        if (!text.trim()) {
          alert('Please enter text to analyze')
          setLoading(false)
          return
        }
        content = text
      } else {
        if (!file) {
          alert('Please select a file')
          setLoading(false)
          return
        }
        content = file
      }

      const analysis = await uploadAnalyze(content, type)
      setResult(analysis)
    } catch (error: any) {
      alert(error.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <header className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-white/70 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-clash text-teal mb-2">Upload Mode</h1>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 mb-2">Content Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as 'image' | 'text' | 'video')
                  setFile(null)
                  setText('')
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {type === 'text' ? (
              <div>
                <label className="block text-white/70 mb-2">Text Content</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal min-h-[200px]"
                  placeholder="Paste text to analyze..."
                />
              </div>
            ) : (
              <div>
                <label className="block text-white/70 mb-2">
                  {type === 'image' ? 'Image File' : 'Video File'}
                </label>
                <input
                  type="file"
                  accept={type === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze with DeepScan™'}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
              
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/70">Verdict:</span>
                  <span className={`font-bold ${result.verdict === 'ai' ? 'text-teal' : 'text-white'}`}>
                    {result.verdict === 'ai' ? 'AI-Generated' : 'Human-Created'}
                  </span>
                </div>
                
                {result.confidence && (
                  <div className="mb-2">
                    <span className="text-white/70">Confidence: </span>
                    <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              <p className="text-white/90 mb-4">{result.explanation}</p>

              {result.cues && result.cues.length > 0 && (
                <div className="mb-4">
                  <div className="text-white/70 text-sm mb-2">Key Cues:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.cues.map((cue: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.disclaimer && (
                <p className="text-white/50 text-xs italic mt-4">{result.disclaimer}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <UserProvider>
      <UploadContent />
    </UserProvider>
  )
}

