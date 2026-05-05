const express = require('express');
const { body, param } = require('express-validator');
const {
  createProject, getProjects, getProject, updateProject, deleteProject, inviteMember,
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().isString(),
  ],
  validate,
  createProject
);

router.get('/', getProjects);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid project ID')],
  validate,
  getProject
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  ],
  validate,
  updateProject
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid project ID')],
  validate,
  deleteProject
);

router.post(
  '/:id/invite',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('email').isEmail().withMessage('Valid member email is required').normalizeEmail(),
  ],
  validate,
  inviteMember
);

module.exports = router;
