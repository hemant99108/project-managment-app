const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { createError } = require('../utils/apiError');

const signup = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email is already registered.');
  }

  const user = await User.create({ name, email, password, role: role || 'Member' });
  const token = generateToken(user._id);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password.');
  }

  const token = generateToken(user._id);

  // Remove password from response
  const userObj = user.toJSON();
  return { user: userObj, token };
};

module.exports = { signup, login };
