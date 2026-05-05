const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (userId) => {
  const userProjects = await Project.find({ members: userId }).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const now = new Date();

  const [totalTasks, completedTasks, overdueTasks, tasksByStatus] = await Promise.all([
    Task.countDocuments({ projectId: { $in: projectIds } }),
    Task.countDocuments({ projectId: { $in: projectIds }, status: 'Done' }),
    Task.countDocuments({
      projectId: { $in: projectIds },
      status: { $ne: 'Done' },
      dueDate: { $lt: now },
    }),
    Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const statusMap = { Todo: 0, 'In Progress': 0, Done: 0 };
  tasksByStatus.forEach(({ _id, count }) => {
    statusMap[_id] = count;
  });

  const recentTasks = await Task.find({ projectId: { $in: projectIds } })
    .populate('assignedTo', 'name email')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalProjects: userProjects.length,
    totalTasks,
    completedTasks,
    overdueTasks,
    pendingTasks: totalTasks - completedTasks,
    tasksByStatus: statusMap,
    recentTasks,
  };
};

module.exports = { getDashboardStats };
