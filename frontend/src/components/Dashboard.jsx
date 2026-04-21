import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { fetchStats } from '../api'

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

const STATUS_COLORS = {
  draft: '#958ea0',
  flagged: '#ffb4ab',
  approved: '#ffb869',
  published: '#d0bcff',
}

const CHART_FONT = { family: "'Inter', sans-serif", size: 11 }
const GRID_COLOR = 'rgba(255,255,255,0.04)'
const TICK_COLOR = 'rgba(255,255,255,0.35)'

export default function Dashboard({ refreshKey }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchStats()
      .then((data) => { if (!cancelled) setStats(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [refreshKey])

  if (error) {
    return (
      <div className="bg-surface-container-high rounded-xl p-8 ring-1 ring-white/5">
        <h3 className="font-headline text-xl font-bold text-on-surface">Analytics</h3>
        <p className="text-error text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-surface-container-high rounded-xl p-8 ring-1 ring-white/5">
        <h3 className="font-headline text-xl font-bold text-on-surface">Analytics</h3>
        <p className="text-outline text-sm mt-2">Loading analytics…</p>
      </div>
    )
  }

  // ── Metric helpers ───────────────────────────────────
  const metrics = [
    {
      label: 'Total Posts',
      value: stats.total_posts,
      sub: null,
      gradient: 'from-primary/10',
      icon: 'article',
    },
    {
      label: 'Approval Rate',
      value: `${stats.approval_rate}%`,
      sub: stats.approval_rate >= 60 ? { text: 'Healthy', icon: 'trending_up', color: 'text-tertiary' } : { text: 'Watch', icon: 'warning', color: 'text-error' },
      gradient: 'from-tertiary/10',
      icon: 'verified',
    },
    {
      label: 'Flag Rate',
      value: `${stats.flag_rate}%`,
      sub: stats.flag_rate > 50 ? { text: 'Requires Action', icon: 'warning', color: 'text-error' } : { text: 'Under control', icon: 'check_circle', color: 'text-outline' },
      gradient: 'from-error/10',
      icon: 'flag',
    },
  ]

  // ── Doughnut: Status Distribution ───────────────────
  const doughnutData = {
    labels: stats.status_distribution.map((s) => s.status.charAt(0).toUpperCase() + s.status.slice(1)),
    datasets: [{
      data: stats.status_distribution.map((s) => s.count),
      backgroundColor: stats.status_distribution.map((s) => STATUS_COLORS[s.status] || '#666'),
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 6,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#151518', titleFont: CHART_FONT, bodyFont: CHART_FONT, cornerRadius: 8, padding: 10, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 },
    },
  }

  // ── Line: Posts Over Time ───────────────────────────
  const lineLabels = stats.timeline.map((t) => {
    const d = new Date(t.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })

  const lineData = {
    labels: lineLabels,
    datasets: [{
      label: 'Posts Created',
      data: stats.timeline.map((t) => t.count),
      borderColor: '#a078ff',
      backgroundColor: 'rgba(160,120,255,0.08)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#d0bcff',
      borderWidth: 2.5,
    }],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: CHART_FONT, maxTicksLimit: 8 } },
      y: { beginAtZero: true, grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: CHART_FONT, stepSize: 1 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#151518', titleFont: CHART_FONT, bodyFont: CHART_FONT, cornerRadius: 8, padding: 10, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 },
    },
  }

  // ── Bar: Top Flag Reasons ──────────────────────────
  const barData = {
    labels: stats.top_flagged_reasons.map((r) => r.reason.length > 30 ? r.reason.slice(0, 30) + '…' : r.reason),
    datasets: [{
      label: 'Occurrences',
      data: stats.top_flagged_reasons.map((r) => r.count),
      backgroundColor: 'rgba(255,180,171,0.5)',
      borderColor: '#ffb4ab',
      borderWidth: 1,
      borderRadius: 6,
      barPercentage: 0.65,
    }],
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: CHART_FONT, stepSize: 1 } },
      y: { grid: { display: false }, ticks: { color: TICK_COLOR, font: { ...CHART_FONT, size: 10 } } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#151518', titleFont: CHART_FONT, bodyFont: CHART_FONT, cornerRadius: 8, padding: 10, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 },
    },
  }

  // ── Doughnut legend data ────────────────────────────
  const total = stats.status_distribution.reduce((sum, s) => sum + s.count, 0)
  const legendItems = stats.status_distribution.map((s) => ({
    label: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    color: STATUS_COLORS[s.status],
    pct: total > 0 ? Math.round((s.count / total) * 100) : 0,
    glow: s.status === 'flagged' ? 'shadow-[0_0_8px_rgba(255,180,171,0.6)]' : s.status === 'published' ? 'shadow-[0_0_8px_rgba(208,188,255,0.6)]' : '',
  }))

  return (
    <>
      {/* ── Key Metrics Grid ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="metrics-section">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-bright transition-colors duration-300 group relative overflow-hidden ring-1 ring-white/5 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <span className="font-body text-sm font-medium text-outline uppercase tracking-wider">{m.label}</span>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-headline text-4xl font-bold text-on-surface">{m.value}</span>
                {m.sub && (
                  <span className={`font-body text-sm ${m.sub.color} flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-[16px]">{m.sub.icon}</span> {m.sub.text}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Charts Bento Grid ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="charts-section">
        {/* Line Chart — Spans 2 cols */}
        <div className="lg:col-span-2 bg-surface-container-high rounded-xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Engagement Velocity</h3>
              <p className="font-body text-sm text-on-surface-variant mt-1">Post creation over the last 30 days.</p>
            </div>
          </div>
          <div className="flex-1 relative min-h-[280px] chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-surface-container-high rounded-xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          <div>
            <h3 className="font-headline text-xl font-bold text-on-surface">Queue Status</h3>
            <p className="font-body text-sm text-on-surface-variant mt-1">Current state of all content.</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative w-44 h-44">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-headline text-2xl font-bold text-on-surface">{total}</span>
                <span className="font-body text-xs text-outline">Total</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between font-body text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.glow}`} style={{ backgroundColor: item.color }} />
                    <span className="text-on-surface">{item.label}</span>
                  </div>
                  <span className="text-on-surface-variant font-medium">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart — Full width */}
        <div className="lg:col-span-3 bg-surface-container-high rounded-xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Moderation Categories</h3>
              <p className="font-body text-sm text-on-surface-variant mt-1">Breakdown of content flagged by AI filters.</p>
            </div>
          </div>
          <div className="relative min-h-[220px] chart-wrapper">
            {stats.top_flagged_reasons.length === 0
              ? <p className="text-outline text-sm">No flagged posts yet.</p>
              : <Bar data={barData} options={barOptions} />
            }
          </div>
        </div>
      </section>
    </>
  )
}
