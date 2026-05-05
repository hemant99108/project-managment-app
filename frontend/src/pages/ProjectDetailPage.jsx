import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '../services/project.service'
import { taskService } from '../services/task.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Trash2, X, UserPlus } from 'lucide-react'

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done']

const StatusBadge = ({ status }) => {
  const map = { Todo: 'badge-todo', 'In Progress': 'badge-progress', Done: 'badge-done' }
  return <span className={map[status] || 'badge-todo'}>{status}</span>
}

function TaskCard({ task, onUpdate, onDelete }) {
  const [status, setStatus] = useState(task.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      await taskService.update(task._id, { status: newStatus })
      setStatus(newStatus)
      onUpdate(task._id, { status: newStatus })
    } catch {
      toast.error('Failed to update task')
    } finally {
      setUpdating(false)
    }
  }

  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && status !== 'Done'

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-slate-200 text-sm leading-snug">{task.title}</h4>
        <button onClick={() => onDelete(task._id)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {task.description && <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <select value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={updating}
          className="text-xs bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {isOverdue && <span className="badge-overdue">Overdue</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-800">
        <span>{task.assignedTo?.name || 'Unassigned'}</span>
        {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}

function CreateTaskModal({ project, onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', status: 'Todo', dueDate: '' })
  const [loading, setLoading] = useState(false)
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, projectId: project._id }
      if (!payload.assignedTo) delete payload.assignedTo
      if (!payload.dueDate) delete payload.dueDate
      const res = await taskService.create(payload)
      onCreate(res.data.data)
      toast.success('Task created!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
            <input type="text" name="title" value={form.title} onChange={change} required placeholder="Task title" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={change} rows={2} placeholder="Optional" className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={change} className="input-field">
              <option value="">Unassigned</option>
              {project.members?.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={change} className="input-field">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={change} className="input-field" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating…' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InviteMemberModal({ project, onClose, onInvite }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await projectService.invite(project._id, email)
      onInvite(res.data.data)
      toast.success('Member invited!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Invite Member</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="colleague@example.com" className="input-field" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Inviting…' : 'Invite'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const isOwner = project?.createdBy?._id === user?._id

  useEffect(() => {
    Promise.all([projectService.getById(id), taskService.getByProject(id)])
      .then(([pRes, tRes]) => {
        setProject(pRes.data.data)
        setTasks(tRes.data.data)
      })
      .catch(() => { toast.error('Failed to load project'); navigate('/projects') })
      .finally(() => setLoading(false))
  }, [id])

  const handleTaskCreate = (task) => setTasks((prev) => [task, ...prev])

  const handleTaskUpdate = (taskId, updates) => {
    setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, ...updates } : t))
  }

  const handleTaskDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await taskService.delete(taskId)
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleInvite = (updatedProject) => setProject(updatedProject)

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const tasksByStatus = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s)
    return acc
  }, {})

  const statusColors = { 'Todo': 'border-slate-700', 'In Progress': 'border-amber-500/40', 'Done': 'border-emerald-500/40' }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project?.name}</h1>
            {project?.description && <p className="text-slate-400 text-sm mt-1">{project.description}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {project?.members?.map((m) => (
                <span key={m._id} className="inline-flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-[10px] font-bold">
                    {m.name[0]}
                  </span>
                  {m.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {isOwner && (
              <button onClick={() => setShowInviteModal(true)} className="btn-secondary flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Invite
              </button>
            )}
            <button onClick={() => setShowTaskModal(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUS_OPTIONS.map((status) => (
          <div key={status}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-300">{status}</h3>
              <span className="text-xs bg-slate-800 text-slate-500 rounded-full px-2 py-0.5">{tasksByStatus[status].length}</span>
            </div>
            <div className={`min-h-24 rounded-xl border-2 border-dashed p-2 space-y-3 ${statusColors[status]}`}>
              {tasksByStatus[status].map((task) => (
                <TaskCard key={task._id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
              ))}
              {tasksByStatus[status].length === 0 && (
                <p className="text-xs text-slate-600 text-center py-6">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && <CreateTaskModal project={project} onClose={() => setShowTaskModal(false)} onCreate={handleTaskCreate} />}
      {showInviteModal && <InviteMemberModal project={project} onClose={() => setShowInviteModal(false)} onInvite={handleInvite} />}
    </div>
  )
}
