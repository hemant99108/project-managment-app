const projectService = require('../services/project.service');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user._id);
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) { next(err); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user._id);
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) { next(err); }
};

const inviteMember = async (req, res, next) => {
  try {
    const project = await projectService.inviteMember(req.params.id, req.body.email, req.user._id);
    res.status(200).json({ success: true, message: 'Member invited successfully.', data: project });
  } catch (err) { next(err); }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject, inviteMember };
