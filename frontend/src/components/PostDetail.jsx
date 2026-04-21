const BADGE_STYLES = {
  draft: 'bg-surface-container-lowest text-outline ring-1 ring-white/10',
  flagged: 'bg-error/10 text-error ring-1 ring-error/20',
  approved: 'bg-tertiary/10 text-tertiary ring-1 ring-tertiary/20',
  published: 'bg-primary/10 text-primary ring-1 ring-primary/20',
}

export default function PostDetail({ post }) {
  if (!post) {
    return (
      <div className="bg-surface-container-high rounded-xl p-8 flex flex-col gap-4 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5" id="post-detail-panel">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary/40">article</span>
          <h3 className="font-headline text-xl font-bold text-on-surface">Post Details</h3>
        </div>
        <p className="text-outline text-sm">Select a post from the queue to inspect its details.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-high rounded-xl p-8 flex flex-col gap-5 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5 fade-up" id="post-detail-panel">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary/60">article</span>
        <h3 className="font-headline text-xl font-bold text-on-surface">Post Details</h3>
      </div>

      <div className="flex items-center gap-3">
        <p className="font-headline text-lg font-bold text-on-surface">{post.title}</p>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wider ${BADGE_STYLES[post.status] || ''}`}>
          {post.status}
        </span>
      </div>

      <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20 max-h-[200px] overflow-y-auto">
        <pre className="whitespace-pre-wrap break-words text-sm text-on-surface-variant font-body leading-relaxed m-0">{post.content}</pre>
      </div>

      {post.flagged_reasons && post.flagged_reasons.length > 0 && (
        <div className="bg-error/5 border border-error/15 rounded-lg p-4">
          <p className="font-body text-sm font-semibold text-error flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Moderation Feedback
          </p>
          <ul className="space-y-1.5 ml-1">
            {post.flagged_reasons.map((reason, i) => (
              <li key={i} className="text-on-error-container text-xs font-body flex items-start gap-2">
                <span className="text-error/60 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-outline text-xs font-body">
        Created: {new Date(post.created_at).toLocaleString()}
        {post.status === 'published' && (
          <span className="ml-2 text-primary/60">
            <span className="material-symbols-outlined text-[12px] align-middle">lock</span> Read-only
          </span>
        )}
      </p>
    </div>
  )
}
