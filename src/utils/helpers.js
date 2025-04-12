import { CATEGORY_COLORS } from './constants';
import moment from 'moment';

// Get color for event category
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#757575'; // Default to gray if category not found
};

// Format date for display
export const formatDate = (date) => {
  return moment(date).format('MMMM D, YYYY');
};

// Format time for display
export const formatTime = (date) => {
  return moment(date).format('h:mm A');
};

// Format date and time together
export const formatDateTime = (date) => {
  return moment(date).format('MMMM D, YYYY h:mm A');
};

// Check if two date ranges overlap
export const doEventsOverlap = (event1, event2) => {
  const start1 = new Date(event1.startTime).getTime();
  const end1 = new Date(event1.endTime).getTime();
  const start2 = new Date(event2.startTime).getTime();
  const end2 = new Date(event2.endTime).getTime();

  return (start1 < end2 && end1 > start2);
}; 