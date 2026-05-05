const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user._id);
    res.status(200).json({ success: true, data: stats });
  } catch (err) { next(err); }
};

module.exports = { getDashboard };
