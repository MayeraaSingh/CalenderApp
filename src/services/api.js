import axios from 'axios';

// Create axios instance with the base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Log the API URL to ensure it's correct
console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Events API
export const eventApi = {
  getEvents: async () => {
    try {
      console.log('Fetching events from API');
      const response = await api.get('/api/events');
      console.log('API response for getEvents:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getEvents:', error.response || error);
      throw error;
    }
  },
  
  createEvent: async (eventData) => {
    try {
      console.log('Creating event with data:', eventData);
      const response = await api.post('/api/events', eventData);
      console.log('API response for createEvent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createEvent:', error.response || error);
      throw error;
    }
  },
  
  updateEvent: async (id, eventData) => {
    try {
      console.log('Updating event with ID:', id, 'and data:', eventData);
      const response = await api.put(`/api/events/${id}`, eventData);
      console.log('API response for updateEvent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateEvent:', error.response || error);
      throw error;
    }
  },
  
  deleteEvent: async (id) => {
    try {
      console.log('Deleting event with ID:', id);
      await api.delete(`/api/events/${id}`);
      console.log('Event deleted successfully');
      return id;
    } catch (error) {
      console.error('Error in deleteEvent:', error.response || error);
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
      console.error('Error in getGoals:', error.response || error);
      throw error;
    }
  },
  
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/api/goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Error in createGoal:', error.response || error);
      throw error;
    }
  },
  
  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/api/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error in updateGoal:', error.response || error);
      throw error;
    }
  },
  
  deleteGoal: async (id) => {
    try {
      await api.delete(`/api/goals/${id}`);
      return id;
    } catch (error) {
      console.error('Error in deleteGoal:', error.response || error);
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
      console.error('Error in getTasks:', error.response || error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error in createTask:', error.response || error);
      throw error;
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error in updateTask:', error.response || error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      return id;
    } catch (error) {
      console.error('Error in deleteTask:', error.response || error);
      throw error;
    }
  }
};

export default api; 