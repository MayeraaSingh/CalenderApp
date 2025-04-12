/**
 * Mock API service that simulates a backend by using localStorage
 */

// Mock IDs generator
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Get data from localStorage
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error getting data from localStorage:', error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Events API
export const eventsApi = {
  // Get all events
  getEvents: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFromStorage('events', []));
      }, 300); // Simulate network delay
    });
  },

  // Create a new event
  createEvent: (eventData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = getFromStorage('events', []);
        const newEvent = {
          _id: generateId(),
          ...eventData,
          createdAt: new Date().toISOString()
        };
        
        events.push(newEvent);
        saveToStorage('events', events);
        resolve(newEvent);
      }, 500); // Simulate network delay
    });
  },

  // Update an event
  updateEvent: (id, eventData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = getFromStorage('events', []);
        const index = events.findIndex(event => event._id === id);
        
        if (index === -1) {
          reject({ message: 'Event not found' });
          return;
        }
        
        const updatedEvent = {
          ...events[index],
          ...eventData,
          updatedAt: new Date().toISOString()
        };
        
        events[index] = updatedEvent;
        saveToStorage('events', events);
        resolve(updatedEvent);
      }, 500); // Simulate network delay
    });
  },

  // Delete an event
  deleteEvent: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = getFromStorage('events', []);
        const index = events.findIndex(event => event._id === id);
        
        if (index === -1) {
          reject({ message: 'Event not found' });
          return;
        }
        
        events.splice(index, 1);
        saveToStorage('events', events);
        resolve({ id });
      }, 500); // Simulate network delay
    });
  }
};

// Goals API
export const goalsApi = {
  // Get all goals
  getGoals: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const goals = getFromStorage('goals', []);
        // If no goals exist, create some default ones
        if (goals.length === 0) {
          const defaultGoals = [
            { _id: generateId(), name: 'Be fit', color: '#22c55e' },
            { _id: generateId(), name: 'Academics', color: '#3b82f6' },
            { _id: generateId(), name: 'LEARN', color: '#8b5cf6' },
            { _id: generateId(), name: 'Sports', color: '#f97316' }
          ];
          saveToStorage('goals', defaultGoals);
          resolve(defaultGoals);
        } else {
          resolve(goals);
        }
      }, 300);
    });
  }
};

// Tasks API
export const tasksApi = {
  // Get tasks, optionally filtered by goalId
  getTasks: (goalId = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tasks = getFromStorage('tasks', []);
        
        // If no tasks exist, create some default ones when goals are available
        if (tasks.length === 0) {
          const goals = getFromStorage('goals', []);
          if (goals.length > 0) {
            const defaultTasks = [
              { _id: generateId(), name: 'AI based agents', goalId: goals.find(g => g.name === 'LEARN')?._id },
              { _id: generateId(), name: 'MLE', goalId: goals.find(g => g.name === 'LEARN')?._id },
              { _id: generateId(), name: 'DE related', goalId: goals.find(g => g.name === 'LEARN')?._id },
              { _id: generateId(), name: 'Basics', goalId: goals.find(g => g.name === 'LEARN')?._id },
              { _id: generateId(), name: 'Morning Run', goalId: goals.find(g => g.name === 'Be fit')?._id },
              { _id: generateId(), name: 'Gym', goalId: goals.find(g => g.name === 'Be fit')?._id },
              { _id: generateId(), name: 'Study Math', goalId: goals.find(g => g.name === 'Academics')?._id },
              { _id: generateId(), name: 'Basketball', goalId: goals.find(g => g.name === 'Sports')?._id }
            ].filter(task => task.goalId);
            
            saveToStorage('tasks', defaultTasks);
            tasks = defaultTasks;
          }
        }
        
        // Filter by goalId if provided
        if (goalId) {
          tasks = tasks.filter(task => task.goalId === goalId);
        }
        
        // Add goal information to each task
        const goals = getFromStorage('goals', []);
        const tasksWithGoals = tasks.map(task => {
          const goal = goals.find(g => g._id === task.goalId) || {};
          return {
            ...task,
            goalId: {
              _id: goal._id,
              name: goal.name,
              color: goal.color
            }
          };
        });
        
        resolve(tasksWithGoals);
      }, 300);
    });
  }
}; 