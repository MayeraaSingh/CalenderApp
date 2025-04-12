const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Get all events / Create new event
router.route('/')
  .get(eventController.getEvents)
  .post(eventController.createEvent);

// Get single event / Update event / Delete event
router.route('/:id')
  .get(eventController.getEvent)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router; 