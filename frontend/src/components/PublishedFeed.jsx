export default function PublishedFeed({ posts }) {
  const published = posts.filter((p) => p.status === 'published')

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
      {published.map((post) => (
        <article
          key={post.id}
          className="fade-up bg-surface-container-high rounded-xl p-8 ring-1 ring-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:ring-primary/10 transition-all duration-300"
        >
          <header className="mb-6">
            <h3 className="font-headline text-2xl font-bold text-on-surface leading-tight">{post.title}</h3>
            <div className="flex items-center gap-3 mt-3 text-outline text-xs font-body">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
            Read-only · {new Date(post.created_at).toLocaleTimeString()}
          </footer>
        </article>
      ))}

      {published.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-[64px] text-outline/20">article</span>
          <p className="text-outline text-sm mt-4">Submit your first post to get started.</p>
        </div>
      )}
    </div>
  )
}
