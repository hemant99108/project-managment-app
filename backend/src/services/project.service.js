const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const { createError } = require('../utils/apiError');

const createProject = async ({ name, description }, userId) => {
  const project = await Project.create({ name, description, createdBy: userId, members: [userId] });
  return project.populate('createdBy members', 'name email role');
};

const getUserProjects = async (userId) => {
  return Project.find({ members: userId })
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');

  if (!project) throw createError(404, 'Project not found.');

  const isMember = project.members.some((m) => m._id.toString() === userId.toString());
  if (!isMember) throw createError(403, 'You do not have access to this project.');

  return project;
};

const updateProject = async (projectId, updates, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw createError(404, 'Project not found.');
  if (project.createdBy.toString() !== userId.toString()) {
    throw createError(403, 'Only the project creator can update it.');
  }

  Object.assign(project, updates);
  await project.save();
  return project.populate('createdBy members', 'name email role');
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw createError(404, 'Project not found.');
  if (project.createdBy.toString() !== userId.toString()) {
    throw createError(403, 'Only the project creator can delete it.');
  }

  await Task.deleteMany({ projectId });
  await project.deleteOne();
};

const inviteMember = async (projectId, memberEmail, requesterId) => {
  const project = await Project.findById(projectId);
  if (!project) throw createError(404, 'Project not found.');
  if (project.createdBy.toString() !== requesterId.toString()) {
    throw createError(403, 'Only the project creator can invite members.');
  }

  const user = await User.findOne({ email: memberEmail });
  if (!user) throw createError(404, 'User with that email not found.');

  const alreadyMember = project.members.some((m) => m.toString() === user._id.toString());
  if (alreadyMember) throw createError(409, 'User is already a member of this project.');

  project.members.push(user._id);
  await project.save();
  return project.populate('createdBy members', 'name email role');
};

module.exports = { createProject, getUserProjects, getProjectById, updateProject, deleteProject, inviteMember };
