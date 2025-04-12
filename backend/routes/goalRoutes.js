const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// Get all goals / Create new goal
router.route('/')
  .get(goalController.getGoals)
  .post(goalController.createGoal);

// Get single goal / Update goal / Delete goal
router.route('/:id')
  .get(goalController.getGoal)
  .put(goalController.updateGoal)
  .delete(goalController.deleteGoal);

module.exports = router; 