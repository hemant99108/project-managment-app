const express = require('express');
const { body, query, param } = require('express-validator');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('projectId').isMongoId().withMessage('Valid project ID is required'),
    body('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo user ID'),
    body('status').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

router.get(
  '/',
  [query('projectId').isMongoId().withMessage('Valid projectId query param is required')],
  validate,
  getTasks
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateTask
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  deleteTask
);

module.exports = router;
