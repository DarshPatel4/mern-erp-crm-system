const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksForKanban
} = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

// GET /api/tasks - Get all tasks with filters and pagination
router.get('/', auth, getTasks);

// GET /api/tasks/kanban - Get tasks grouped by status for Kanban view
router.get('/kanban', auth, getTasksForKanban);

// GET /api/tasks/:id - Get task by ID (must be after /kanban)
router.get('/:id', auth, getTaskById);

// POST /api/tasks - Create new task
router.post('/', auth, createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', auth, updateTask);

// PATCH /api/tasks/:id/status - Update task status (for drag and drop)
router.patch('/:id/status', auth, updateTaskStatus);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', auth, deleteTask);

module.exports = router;
