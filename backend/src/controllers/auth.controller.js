const authService = require('../services/auth.service');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await authService.signup({ name, email, password, role });
    res.status(201).json({ success: true, message: 'Account created successfully.', data: { user, token } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(200).json({ success: true, message: 'Login successful.', data: { user, token } });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

module.exports = { signup, login, getMe };
