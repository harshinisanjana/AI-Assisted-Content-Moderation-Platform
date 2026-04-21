import { useState } from 'react'

export default function PostForm({ onSubmitPost, submitting }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const charCount = content.trim().length
  const charPercent = Math.min((charCount / 2000) * 100, 100)

  const barColor =
    charCount < 50 ? 'bg-error' : charCount > 1800 ? 'bg-tertiary' : 'bg-primary'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const t = title.trim()
    const c = content.trim()
    if (!t || !c) {
      setError('Title and content are required.')
      return
    }
    try {
      await onSubmitPost({ title: t, content: c })
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-surface-container-high rounded-xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5" id="submit-post-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface">Create Draft</h3>
          <p className="font-body text-sm text-on-surface-variant mt-1">Create first, then submit from the queue for AI review.</p>
        </div>
        <span className="material-symbols-outlined text-primary/60">rate_review</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="font-body text-xs font-medium text-outline uppercase tracking-wider">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            placeholder="Give your post a great title…"
            required
            className="bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body placeholder:text-outline/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="font-body text-xs font-medium text-outline uppercase tracking-wider">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write your thoughts here (50–2000 characters)…"
            required
            className="bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body resize-y placeholder:text-outline/50"
          />
        </div>

        {/* Character progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${charPercent}%` }}
            />
          </div>
          <span className="font-body text-xs text-outline tabular-nums">{charCount} / 2,000</span>
        </div>

        {error && (
          <p className="text-error text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg font-body text-sm font-semibold text-on-primary bg-gradient-to-r from-primary-container to-primary hover:shadow-[0_4px_20px_rgba(208,188,255,0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating Draft…' : 'Create Draft'}
        </button>

        <p className="text-outline/60 text-xs font-body text-center">
          After creation, drafts can be submitted for checks on banned words, content length (50–2000 chars), ALL-CAPS, and aggressive tone.
        </p>
      </form>
    </div>
  )
}
