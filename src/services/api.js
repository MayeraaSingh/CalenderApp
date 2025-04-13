import axios from 'axios';

// In production with Vercel, we don't need to specify the full URL for API calls
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string for same-domain requests in production (Vercel)
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Only log in development
if (process.env.NODE_ENV !== 'production') {
  console.log('API environment:', process.env.NODE_ENV);
  console.log('API_URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to only log in development
const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

// Helper function to only log errors in development
const devErrorLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args);
  } else {
    // In production, just log that an error occurred without details
    console.error('API error occurred');
  }
};

// Events API
export const eventApi = {
  getEvents: async () => {
    try {
      devLog('Fetching events from API');
      const response = await api.get('/api/events');
      devLog('API response for getEvents:', response.data);
      return response.data;
    } catch (error) {
      devErrorLog('Error in getEvents:', error.response || error);
      throw error;
    }
  },
  
  createEvent: async (eventData) => {
    try {
      devLog('Creating event with data:', eventData);
      const response = await api.post('/api/events', eventData);
      devLog('API response for createEvent:', response.data);
      return response.data;
    } catch (error) {
      devErrorLog('Error in createEvent:', error.response || error);
      throw error;
    }
  },
  
  updateEvent: async (id, eventData) => {
    try {
      devLog('Updating event with ID:', id, 'and data:', eventData);
      const response = await api.put(`/api/events/${id}`, eventData);
      devLog('API response for updateEvent:', response.data);
      return response.data;
    } catch (error) {
      devErrorLog('Error in updateEvent:', error.response || error);
      throw error;
    }
  },
  
  deleteEvent: async (id) => {
    try {
      devLog('Deleting event with ID:', id);
      await api.delete(`/api/events/${id}`);
      devLog('Event deleted successfully');
      return id;
    } catch (error) {
      devErrorLog('Error in deleteEvent:', error.response || error);
      throw error;
    }
  }
};

// Goals API
export const goalApi = {
  getGoals: async () => {
    try {
      const response = await api.get('/api/goals');
      return response.data;
    } catch (error) {
      devErrorLog('Error in getGoals:', error.response || error);
      throw error;
    }
  },
  
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/api/goals', goalData);
      return response.data;
    } catch (error) {
      devErrorLog('Error in createGoal:', error.response || error);
      throw error;
    }
  },
  
  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/api/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      devErrorLog('Error in updateGoal:', error.response || error);
      throw error;
    }
  },
  
  deleteGoal: async (id) => {
    try {
      await api.delete(`/api/goals/${id}`);
      return id;
    } catch (error) {
      devErrorLog('Error in deleteGoal:', error.response || error);
      throw error;
    }
  }
};

// Tasks API
export const taskApi = {
  getTasks: async (goalId = null) => {
    try {
      const url = goalId ? `/api/tasks?goalId=${goalId}` : '/api/tasks';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      devErrorLog('Error in getTasks:', error.response || error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      devErrorLog('Error in createTask:', error.response || error);
      throw error;
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      devErrorLog('Error in updateTask:', error.response || error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      return id;
    } catch (error) {
      devErrorLog('Error in deleteTask:', error.response || error);
      throw error;
    }
  }
};

export default api; 