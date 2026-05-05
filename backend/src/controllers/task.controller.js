const taskService = require('../services/task.service');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const tasks = await taskService.getTasksByProject(projectId, req.user._id);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user._id);
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) { next(err); }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
