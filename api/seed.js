import mongoose from 'mongoose';
import Goal from '../../models/Goal';
import Task from '../../models/Task';
import Event from '../../models/Event';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    await Goal.deleteMany({});
    const goals = await Goal.insertMany([
      { name: 'Be fit', color: '#4CAF50' },
      { name: 'Academics', color: '#2196F3' },
      { name: 'LEARN', color: '#9C27B0' },
      { name: 'Sports', color: '#FF9800' }
    ]);

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
    await Task.insertMany(tasks);

    await Event.deleteMany({});
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const events = [
      {
        title: 'Monday Wake-Up',
        category: 'exercise',
        startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000),
        endTime: new Date(today.getTime() + 9 * 60 * 60 * 1000)
      },
      {
        title: 'All-Team Kickoff',
        category: 'work',
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000),
        endTime: new Date(today.getTime() + 10 * 60 * 60 * 1000)
      },
      {
        title: 'Coffee Chat',
        category: 'social',
        startTime: new Date(today.getTime() + (24 * 60 * 60 * 1000) + 9 * 60 * 60 * 1000),
        endTime: new Date(today.getTime() + (24 * 60 * 60 * 1000) + 10 * 60 * 60 * 1000)
      }
    ];
    await Event.insertMany(events);

    return res.status(200).json({ message: 'Seeded successfully!' });
  } catch (error) {
    console.error('Seeding failed:', error);
    return res.status(500).json({ error: 'Seeding failed.' });
  }
}
