import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  createDraftPost,
  getPost,
  listPosts,
  publishPost,
  submitPostForReview,
} from './api'
import './App.css'
import Dashboard from './components/Dashboard'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import PostList from './components/PostList'
import PublishedFeed from './components/PublishedFeed'
import useWebSocket from './hooks/useWebSocket'

const NAV_ITEMS = [
  { id: 'analytics', to: '/analytics', icon: 'insights', label: 'Analytics' },
  { id: 'review', to: '/review', icon: 'edit_note', label: 'Create & Review' },
  { id: 'blog', to: '/blog', icon: 'public', label: 'Published Blog' },
]

const PAGE_TITLES = {
  analytics: 'Analytics Dashboard',
  review: 'Create & Review',
  blog: 'Published Blog',
}

function App() {
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [limit, setLimit] = useState(20)
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  // ── Toast system ──────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  // ── Data fetching ─────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true)
    try {
      const payload = await listPosts(statusFilter, 0, limit)
      setPosts(payload)
      if (payload.length === 0) {
        setSelectedPostId(null)
        setSelectedPost(null)
      }
    } catch (err) {
      addToast(err.message || 'Error loading posts. Is the backend running?', 'error')
    } finally {
      setLoadingPosts(false)
    }
  }, [statusFilter, limit, addToast])

  const loadMorePosts = () => {
    setLimit((prev) => prev + 20)
  }

  const fetchPostById = useCallback(async (postId) => {
    try {
      const post = await getPost(postId)
      setSelectedPost(post)
    } catch {
      setSelectedPost(null)
    }
  }, [])

  useEffect(() => { void fetchPosts() }, [fetchPosts])
  useEffect(() => { if (selectedPostId !== null) void fetchPostById(selectedPostId) }, [fetchPostById, selectedPostId])

  const currentPage = useMemo(() => {
    const match = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))
    return match ? match.id : 'review'
  }, [location.pathname])

  // ── WebSocket ─────────────────────────────────────────────
  const onWsEvent = useCallback(
    (eventName, data) => {
      if (eventName === 'post_created') {
        addToast(`Draft created: "${data.title}"`, 'info')
      } else if (eventName === 'post_submitted') {
        const prefix = data.status === 'approved' ? 'Approved' : 'Flagged'
        addToast(`${prefix}: "${data.title}"`, data.status === 'approved' ? 'success' : 'warning')
      } else if (eventName === 'post_published') addToast(`Published: "${data.title}"`, 'success')
      void fetchPosts()
      setRefreshKey((k) => k + 1)
      if (selectedPostId !== null) void fetchPostById(selectedPostId)
    },
    [fetchPosts, fetchPostById, selectedPostId, addToast],
  )

  const { status: wsStatus } = useWebSocket(onWsEvent)

  const allPublished = useMemo(() => posts.filter((p) => p.status === 'published'), [posts])

  // ── Create draft (first step) ──────────────────────────────
  const handleCreateDraft = async (payload) => {
    setSubmitting(true)
    try {
      const draftPost = await createDraftPost(payload)
      setSelectedPostId(draftPost.id)
      await fetchPosts()
      await fetchPostById(draftPost.id)
    } catch (err) {
      addToast(err.message || 'Failed to create post', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitForReview = async (postId) => {
    setSubmitting(true)
    try {
      await submitPostForReview(postId)
      setSelectedPostId(postId)
      await fetchPosts()
      await fetchPostById(postId)
    } catch (err) {
      addToast(err.message || 'Failed to submit for review', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = async (postId) => {
    setSubmitting(true)
    try {
      await publishPost(postId)
      setSelectedPostId(postId)
      await fetchPosts()
      await fetchPostById(postId)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Toast styles ──────────────────────────────────────────
  const toastStyles = {
    info: 'bg-[#151518] border-primary/20 text-primary-fixed',
    success: 'bg-[#151518] border-tertiary/20 text-tertiary',
    warning: 'bg-[#151518] border-error/20 text-error',
    error: 'bg-[#151518] border-error/30 text-error',
  }

  // ── WS status helpers ─────────────────────────────────────
  const wsLabel = wsStatus === 'connected' ? 'Live' : wsStatus === 'reconnecting' ? 'Reconnecting' : 'Offline'
  const wsColor = wsStatus === 'connected'
    ? 'text-tertiary ring-tertiary/20 bg-tertiary/10'
    : wsStatus === 'reconnecting'
    ? 'text-[#ffb869] ring-[#ffb869]/20 bg-[#ffb869]/10 pulse-dot'
    : 'text-error ring-error/20 bg-error/10'
  const wsDotColor = wsStatus === 'connected' ? 'bg-tertiary' : wsStatus === 'reconnecting' ? 'bg-[#ffb869]' : 'bg-error'

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ───────────────────────────────────── */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-[#050507] pt-8 z-40">
        <div className="px-8 pb-6">
          <h2 className="font-headline font-extrabold text-white text-xl">Content Moderation</h2>
          <p className="font-body text-sm text-zinc-500 mt-1">AI-Powered Publishing</p>
        </div>

        {/* Navigation */}
        <ul className="flex-1 flex flex-col gap-1 px-4 mt-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent text-[#d0bcff] border-l-4 border-[#8B5CF6] rounded-r-lg rounded-l-none'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom: WS Status + Stats */}
        <div className="px-8 pb-6 space-y-4">
          <div className={`flex items-center gap-2 text-xs font-body font-semibold uppercase tracking-wider px-3 py-2 rounded-lg ring-1 w-fit ${wsColor}`}>
            <span className={`w-2 h-2 rounded-full ${wsDotColor}`} />
            {wsLabel}
          </div>
          <div className="space-y-2 font-body text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Total</span>
              <span className="text-on-surface font-medium">{posts.length}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Published</span>
              <span className="text-primary font-medium">{allPublished.length}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Flagged</span>
              <span className="text-error font-medium">{posts.filter(p => p.status === 'flagged').length}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-64 h-full relative bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-[#050507]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(208,188,255,0.06)] flex items-center justify-between px-8 py-4 w-full border-b border-white/5">
          <h1 className="text-2xl font-black text-[#d0bcff] tracking-tighter font-headline">
            {PAGE_TITLES[currentPage]}
          </h1>
          <span className="hidden sm:inline text-xs font-body text-zinc-500">
            API Docs: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-primary hover:underline">localhost:8000/docs</a>
          </span>
        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden px-4 py-3 border-b border-white/5 bg-[#050507]/60 backdrop-blur-xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) => `shrink-0 px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${
                  isActive ? 'bg-primary/20 text-primary-fixed' : 'bg-white/5 text-zinc-400'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10">
          <Routes>
            <Route path="/" element={<Navigate to="/review" replace />} />
            <Route path="/analytics" element={<Dashboard refreshKey={refreshKey} />} />
            <Route
              path="/review"
              element={(
                <>
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PostForm onSubmitPost={handleCreateDraft} submitting={submitting} />
                    <PostList
                      posts={posts}
                      loading={loadingPosts}
                      statusFilter={statusFilter}
                      onFilterChange={setStatusFilter}
                      onView={setSelectedPostId}
                      onPublish={handlePublish}
                      submitting={submitting}
                      onLoadMore={loadMorePosts}
                      hasMore={posts.length >= limit}
                    />
                  </section>
                  <section>
                    <PostDetail post={selectedPost} />
                  </section>
                </>
              )}
            />
            <Route path="/blog" element={<PublishedFeed posts={allPublished} onLoadMore={loadMorePosts} hasMore={posts.length >= limit} />} />
            <Route path="*" element={<Navigate to="/review" replace />} />
          </Routes>

          <div className="h-12" />
        </main>
      </div>

      {/* ── Toasts ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-xl text-sm font-medium max-w-[380px] border backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] toast-animate ${toastStyles[t.type] || toastStyles.info}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
