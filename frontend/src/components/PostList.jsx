const statusOptions = ['all', 'draft', 'flagged', 'approved', 'published']

const BADGE_STYLES = {
  draft: 'bg-surface-container-lowest text-outline ring-1 ring-white/10',
  flagged: 'bg-error/10 text-error ring-1 ring-error/20',
  approved: 'bg-tertiary/10 text-tertiary ring-1 ring-tertiary/20',
  published: 'bg-primary/10 text-primary ring-1 ring-primary/20',
}

export default function PostList({
  posts,
  loading,
  statusFilter,
  onFilterChange,
  onView,
  onSubmitForReview,
  onPublish,
  submitting,
  onLoadMore,
  hasMore,
}) {
  return (
    <div className="bg-surface-container-high rounded-xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5" id="posts-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface">Content Queue</h3>
          <p className="font-body text-sm text-on-surface-variant mt-1">All posts and their moderation status.</p>
        </div>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-body uppercase tracking-wider"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-outline text-sm">Loading posts…</p>}
      {!loading && posts.length === 0 && <p className="text-outline text-sm">No posts match this filter.</p>}

      <ul className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
        {posts.map((post) => (
          <li
            key={post.id}
            className="fade-up flex items-center justify-between gap-3 bg-surface-container-low rounded-lg px-4 py-3 ring-1 ring-white/5 hover:ring-white/10 hover:bg-surface-bright transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-on-surface truncate">{post.title}</p>
              <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wider ${BADGE_STYLES[post.status] || ''}`}>
                {post.status}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onView(post.id)}
                disabled={submitting}
                className="px-3 py-1 rounded-lg text-xs font-label font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-on-surface transition-all"
                title="View details"
              >
                View
              </button>
              {(post.status === 'draft' || post.status === 'flagged') && (
                <button
                  type="button"
                  onClick={() => onSubmitForReview(post.id)}
                  disabled={submitting}
                  className="px-3 py-1 rounded-lg text-xs font-label font-semibold text-on-primary bg-gradient-to-r from-tertiary/80 to-tertiary hover:shadow-[0_2px_12px_rgba(255,184,105,0.3)] transition-all"
                >
                  {post.status === 'draft' ? 'Submit' : 'Re-submit'}
                </button>
              )}
              {post.status === 'approved' && (
                <button
                  type="button"
                  onClick={() => onPublish(post.id)}
                  disabled={submitting}
                  className="px-3 py-1 rounded-lg text-xs font-label font-semibold text-on-primary bg-gradient-to-r from-primary-container to-primary hover:shadow-[0_2px_12px_rgba(208,188,255,0.3)] transition-all"
                >
                  Publish
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {hasMore && (
        <div className="pt-2 text-center">
          <button
            onClick={onLoadMore}
            disabled={submitting || loading}
            className="text-xs font-label uppercase tracking-wider text-primary hover:text-primary-fixed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More ▼'}
          </button>
        </div>
      )}
    </div>
  )
}
