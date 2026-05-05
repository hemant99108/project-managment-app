const Task = require('../models/Task');
const Project = require('../models/Project');
const { createError } = require('../utils/apiError');

const _assertProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw createError(404, 'Project not found.');
  const isMember = project.members.some((m) => m.toString() === userId.toString());
  if (!isMember) throw createError(403, 'You do not have access to this project.');
  return project;
};

const createTask = async ({ title, description, projectId, assignedTo, status, dueDate }, userId) => {
  await _assertProjectAccess(projectId, userId);

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: assignedTo || null,
    status: status || 'Todo',
    dueDate: dueDate || null,
    createdBy: userId,
  });

  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'projectId', select: 'name' },
  ]);
};

const getTasksByProject = async (projectId, userId) => {
  await _assertProjectAccess(projectId, userId);
  return Task.find({ projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

const updateTask = async (taskId, updates, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError(404, 'Task not found.');
  await _assertProjectAccess(task.projectId, userId);

  Object.assign(task, updates);
  await task.save();
  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError(404, 'Task not found.');
  await _assertProjectAccess(task.projectId, userId);
  await task.deleteOne();
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
