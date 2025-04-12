const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks / Create new task
router.route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

// Get single task / Update task / Delete task
router.route('/:id')
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router; 