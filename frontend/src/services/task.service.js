import api from './api'

export const taskService = {
  create: (data) => api.post('/tasks', data),
  getByProject: (projectId) => api.get('/tasks', { params: { projectId } }),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}
