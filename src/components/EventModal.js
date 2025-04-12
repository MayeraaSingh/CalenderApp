import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEvent, updateEvent } from '../redux/slices/eventsSlice';
import { CATEGORY_COLORS } from '../utils/constants';
import '../styles/EventModal.css';

// Category icon mapping
const CATEGORY_ICONS = {
  exercise: '🏃',
  eating: '🍽️',
  work: '💼',
  relax: '🧘',
  family: '👨‍👩‍👧',
  social: '🎭'
};

const EventModal = ({ isOpen, onClose, event, slotInfo, onDelete }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setCategory(event.category || 'work');
      setStartTime(new Date(event.startTime || event.start));
      setEndTime(new Date(event.endTime || event.end));
      
      console.log('Modal opened with event:', {
        title: event.title,
        start: new Date(event.startTime || event.start).toLocaleString(),
        end: new Date(event.endTime || event.end).toLocaleString(),
        color: event.color
      });
    } else if (slotInfo) {
      console.log('Modal opened with slot:', {
        start: new Date(slotInfo.start).toLocaleString(),
        end: new Date(slotInfo.end).toLocaleString()
      });
      
      setStartTime(new Date(slotInfo.start));
      setEndTime(new Date(slotInfo.end));
    }
  }, [event, slotInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!title.trim()) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be after start time');
      setIsSubmitting(false);
      return;
    }

    // Create a basic event data object
    const eventData = {
      title: title.trim(),
      category,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    // If this event was created from a task, include the task and goal information
    if (event && event.taskId) {
      eventData.taskId = event.taskId;
    }
    
    if (event && event.goalId) {
      eventData.goalId = event.goalId;
    }
    
    // Include the color if it comes from a task's goal
    if (event && event.color && !CATEGORY_COLORS[category]) {
      eventData.color = event.color;
    }

    console.log('Submitting event data:', eventData);

    try {
      if (event && event._id) {
        dispatch(updateEvent({ id: event._id, eventData }))
          .unwrap()
          .then(() => {
            console.log('Event updated successfully');
            onClose();
          })
          .catch(err => {
            console.error('Failed to update event:', err);
            setError(err.message || 'Failed to update event');
            setIsSubmitting(false);
          });
      } else {
        dispatch(createEvent(eventData))
          .unwrap()
          .then(() => {
            console.log('Event created successfully');
            onClose();
          })
          .catch(err => {
            console.error('Failed to create event:', err);
            setError(err.message || 'Failed to create event');
            setIsSubmitting(false);
          });
      }
    } catch (error) {
      console.error('Exception in event submission:', error);
      setError('An error occurred while processing your request');
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (event && event._id && onDelete) {
      onDelete(event._id);
    }
  };

  // Calculate duration in minutes
  const getDuration = () => {
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.round(diffMs / (1000 * 60)); // convert to minutes
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ borderBottom: `3px solid ${CATEGORY_COLORS[category] || '#ccc'}` }}>
          <h2>{event && event._id ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span className="label-icon">📝</span>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🏷️</span>
              Category
            </label>
            <div className="category-selector">
              {Object.keys(CATEGORY_COLORS).map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`category-option ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? CATEGORY_COLORS[cat] : 'transparent',
                    color: category === cat ? '#fff' : '#333',
                    borderColor: CATEGORY_COLORS[cat]
                  }}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="time-group">
            <div className="form-group">
              <label>
                <span className="label-icon">🕒</span>
                Start Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={date => {
                  setStartTime(date);
                  // Maintain the same duration when changing start time
                  const currentDuration = getDuration();
                  const newEndTime = new Date(date.getTime() + currentDuration * 60 * 1000);
                  setEndTime(newEndTime);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="date-picker"
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">🕓</span>
                End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={date => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="date-picker"
                minDate={new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate())}
                minTime={new Date(startTime.getTime() + 15 * 60 * 1000)}
                maxTime={new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 23, 59, 59)}
              />
            </div>
          </div>
          
          <div className="duration-indicator">
            <span className="duration-label">Duration:</span>
            <span className="duration-value">{formatDuration(getDuration())}</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            {event && event._id && (
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDelete}
              >
                Delete Event
              </button>
            )}
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (event && event._id ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 