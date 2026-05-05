import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboard.service'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Clock, AlertCircle, ListTodo, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const StatusBadge = ({ status }) => {
  const map = { Todo: 'badge-todo', 'In Progress': 'badge-progress', Done: 'badge-done' }
  return <span className={map[status] || 'badge-todo'}>{status}</span>
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-semibold">{value ?? '—'}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </div>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Good to see you, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Here's what's happening across your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FolderOpen} label="Total Projects" value={stats?.totalProjects} color="bg-sky-500/10 text-sky-400" />
        <StatCard icon={ListTodo} label="Total Tasks" value={stats?.totalTasks} color="bg-violet-500/10 text-violet-400" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats?.completedTasks} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={AlertCircle} label="Overdue" value={stats?.overdueTasks} color="bg-red-500/10 text-red-400" />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {stats?.tasksByStatus && Object.entries(stats.tasksByStatus).map(([status, count]) => (
          <div key={status} className="card">
            <div className="flex items-center justify-between mb-3">
              <StatusBadge status={status} />
              <span className="text-2xl font-semibold">{count}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  status === 'Done' ? 'bg-emerald-500' : status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-600'
                }`}
                style={{ width: stats.totalTasks ? `${(count / stats.totalTasks) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent tasks */}
      <div className="card">
        <h2 className="font-semibold mb-4 text-slate-200">Recent Tasks</h2>
        {stats?.recentTasks?.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No tasks yet. Create a project to get started.</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentTasks?.map((task) => (
              <div key={task._id} className="flex items-center gap-4 py-2 border-b border-slate-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{task.projectId?.name}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {task.assignedTo && (
                    <span className="text-xs text-slate-400">{task.assignedTo.name}</span>
                  )}
                  <StatusBadge status={task.status} />
                  {task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'Done' && (
                    <span className="badge-overdue">Overdue</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
