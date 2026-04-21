export default function PublishedFeed({ posts, onLoadMore, hasMore }) {
  const published = posts.filter((p) => p.status === 'published')

  const parseBackendTimestamp = (value) => {
    if (!value || typeof value !== 'string') return null
    const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(value)
    const parsed = new Date(hasTimezone ? value : `${value}Z`)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed
  }

  const formatDate = (value) => {
    const parsed = parseBackendTimestamp(value)
    if (!parsed) return 'Unknown date'
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatDateTime = (value) => {
    const parsed = parseBackendTimestamp(value)
    if (!parsed) return 'Unknown time'
    return parsed.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div className="text-center space-y-3">
        <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight">
          Published <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">Articles</span>
        </h2>
        <p className="font-body text-on-surface-variant text-base">
          {published.length === 0
            ? 'No articles published yet. Submit and approve content to see it here.'
            : `${published.length} article${published.length !== 1 ? 's' : ''} live on the platform.`
          }
        </p>
      </div>

      {/* Articles */}
      {published.map((post) => {
        const publishedOn = post.published_at || post.created_at
        return (
          <article
            key={post.id}
            className="fade-up bg-surface-container-high rounded-xl p-8 ring-1 ring-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:ring-primary/10 transition-all duration-300"
          >
          <header className="mb-6">
            <h3 className="font-headline text-2xl font-bold text-on-surface leading-tight">{post.title}</h3>
            <div className="flex items-center gap-3 mt-3 text-outline text-xs font-body">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                {formatDate(publishedOn)}
              </span>
              <span className="text-white/10">|</span>
              <span className="flex items-center gap-1 text-primary/60">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Published
              </span>
            </div>
          </header>

          <div className="border-t border-white/5 pt-6">
            <p className="font-body text-on-surface-variant text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          <footer className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-outline/50 text-xs font-body">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Read-only · Published {formatDateTime(publishedOn)}
          </footer>
          </article>
        )
      })}

      {published.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-[64px] text-outline/20">article</span>
          <p className="text-outline text-sm mt-4">Submit your first post to get started.</p>
        </div>
      )}

      {hasMore && (
        <div className="pt-8 text-center pb-8">
          <button
            onClick={onLoadMore}
            className="text-xs font-label uppercase tracking-wider text-primary ring-1 ring-primary/30 px-6 py-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            Load More Posts ▼
          </button>
        </div>
      )}
    </div>
  )
}
