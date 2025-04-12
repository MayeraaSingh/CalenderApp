const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Goal = require('./models/Goal');
const Task = require('./models/Task');
const Event = require('./models/Event');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar-app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Seed Goals
const seedGoals = async () => {
  try {
    // Clear existing data
    await Goal.deleteMany({});

    const goals = [
      { name: 'Be fit', color: '#4CAF50' },
      { name: 'Academics', color: '#2196F3' },
      { name: 'LEARN', color: '#9C27B0' },
      { name: 'Sports', color: '#FF9800' }
    ];

    const insertedGoals = await Goal.insertMany(goals);
    console.log(`${insertedGoals.length} goals inserted`);
    return insertedGoals;
  } catch (error) {
    console.error('Error seeding goals:', error);
    process.exit(1);
  }
};

// Seed Tasks
const seedTasks = async (goals) => {
  try {
    // Clear existing data
    await Task.deleteMany({});

    const tasks = [
      { name: 'AI based agents', goalId: goals[2]._id },
      { name: 'MLE', goalId: goals[2]._id },
      { name: 'DE related', goalId: goals[2]._id },
      { name: 'Basics', goalId: goals[2]._id },
      { name: 'Morning Run', goalId: goals[0]._id },
      { name: 'Gym', goalId: goals[0]._id },
      { name: 'Study Math', goalId: goals[1]._id },
      { name: 'Basketball', goalId: goals[3]._id }
    ];

    const insertedTasks = await Task.insertMany(tasks);
    console.log(`${insertedTasks.length} tasks inserted`);
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

// Seed Events
const seedEvents = async () => {
  try {
    // Clear existing data
    await Event.deleteMany({});

    // Get current date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Create events
    const events = [
      {
        title: 'Monday Wake-Up',
        category: 'exercise',
        startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8:00 AM
        endTime: new Date(today.getTime() + 9 * 60 * 60 * 1000)    // 9:00 AM
      },
      {
        title: 'All-Team Kickoff',
        category: 'work',
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
        endTime: new Date(today.getTime() + 10 * 60 * 60 * 1000)   // 10:00 AM
      },
      {
        title: 'Coffee Chat',
        category: 'social',
        startTime: new Date(today.getTime() + (24 * 60 * 60 * 1000) + 9 * 60 * 60 * 1000), // Tomorrow 9:00 AM
        endTime: new Date(today.getTime() + (24 * 60 * 60 * 1000) + 10 * 60 * 60 * 1000)   // Tomorrow 10:00 AM
      }
    ];

    const insertedEvents = await Event.insertMany(events);
    console.log(`${insertedEvents.length} events inserted`);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

// Run the seeding
const seedDatabase = async () => {
  try {
    const goals = await seedGoals();
    await seedTasks(goals);
    await seedEvents();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 