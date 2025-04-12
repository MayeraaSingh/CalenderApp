const Event = require('../models/Event');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    console.log('Getting all events');
    const events = await Event.find();
    console.log(`Found ${events.length} events`);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    console.log('Creating new event with data:', req.body);
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    console.log('Event created successfully:', savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    console.log('Getting event with ID:', req.params.id);
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event found:', event);
    res.status(200).json(event);
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    console.log('Updating event with ID:', req.params.id, 'and data:', req.body);
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      console.log('Event not found for update');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event updated successfully:', updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    console.log('Deleting event with ID:', req.params.id);
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      console.log('Event not found for deletion');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event deleted successfully');
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
}; 