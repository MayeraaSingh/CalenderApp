import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useDrop } from 'react-dnd';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import EventModal from './EventModal';
import { fetchEvents, updateEvent, deleteEvent } from '../redux/slices/eventsSlice';
import { ItemTypes } from '../utils/constants';
import { getCategoryColor } from '../utils/helpers';
import '../styles/Calendar.css';

// Setup the localizer
const localizer = momentLocalizer(moment);

// Create DnD Calendar
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

// Helper function to only log in development
const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

const Calendar = () => {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentView, setCurrentView] = useState('week');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Format events for the calendar
  const formattedEvents = useMemo(() => {
    return events.map(event => {
      const formattedEvent = {
        ...event,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        color: event.color || getCategoryColor(event.category),
      };
      devLog('Formatted event:', formattedEvent.title, 
        'Start:', formattedEvent.start.toLocaleTimeString(),
        'End:', formattedEvent.end.toLocaleTimeString());
      return formattedEvent;
    });
  }, [events]);

  // Setup drag and drop from sidebar
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      const task = item.task;
      
      // Set default times (will be overridden if we have a selected slot)
      let startTime, endTime;
      
      if (selectedSlot) {
        // If there's a selected time slot, use its times
        startTime = new Date(selectedSlot.start);
        endTime = new Date(selectedSlot.end);
      } else {
        // Otherwise default to the current view day at current hour
        startTime = new Date(selectedDate);
        // Round to nearest hour
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        
        // End time is 1 hour after start time
        endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
      }
      
      // Find the goal color
      const goalColor = task.goalId?.color || '#3b82f6';
      
      devLog(`Dropped task ${task.name} at ${startTime.toLocaleTimeString()} with color ${goalColor}`);
      
      // Open modal with pre-filled data
      setSelectedEvent({
        title: task.name,
        category: 'work',
        startTime: startTime,
        endTime: endTime,
        taskId: task._id,
        goalId: task.goalId?._id || null,
        color: goalColor
      });
      
      setModalOpen(true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [selectedDate, selectedSlot]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSelectSlot = (slotInfo) => {
    devLog('Selected slot:', {
      start: new Date(slotInfo.start).toLocaleString(),
      end: new Date(slotInfo.end).toLocaleString()
    });
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    devLog('Selected event:', event);
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleEventDrop = ({ event, start, end }) => {
    devLog('Event dropped:', event, 'New start:', start, 'New end:', end);
    
    // Create a copy of the event with updated times
    const updatedEvent = {
      ...event,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    };
    
    // Dispatch the update action
    dispatch(updateEvent({ 
      id: event._id,
      eventData: updatedEvent
    }));
  };

  const handleEventResize = ({ event, start, end }) => {
    devLog('Event resized:', event, 'New start:', start, 'New end:', end);
    
    // Create a copy of the event with updated times
    const updatedEvent = {
      ...event,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    };
    
    // Dispatch the update action
    dispatch(updateEvent({ 
      id: event._id,
      eventData: updatedEvent
    }));
  };

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    
    // Use custom color if available (from dropped task/goal)
    if (event.color) {
      backgroundColor = event.color;
    } 
    // Otherwise use category color
    else {
      backgroundColor = getCategoryColor(event.category);
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        border: 'none',
        color: '#fff',
        fontWeight: 'bold'
      }
    };
  };

  return (
    <div className="calendar-container" ref={drop}>
      <div className="calendar-header">
        <div className="header-left">
          <button 
            className="today-button" 
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
          <div className="date-navigator">
            <button className="nav-button" onClick={() => {
              const newDate = new Date(selectedDate);
              if (currentView === 'day') {
                newDate.setDate(newDate.getDate() - 1);
              } else if (currentView === 'week') {
                newDate.setDate(newDate.getDate() - 7);
              } else if (currentView === 'month') {
                newDate.setMonth(newDate.getMonth() - 1);
              }
              setSelectedDate(newDate);
            }}>
              ❮
            </button>
            <span className="current-date">
              {currentView === 'day' && moment(selectedDate).format('MMMM D, YYYY')}
              {currentView === 'week' && `Week of ${moment(selectedDate).format('MMMM D')}`}
              {currentView === 'month' && moment(selectedDate).format('MMMM YYYY')}
            </span>
            <button className="nav-button" onClick={() => {
              const newDate = new Date(selectedDate);
              if (currentView === 'day') {
                newDate.setDate(newDate.getDate() + 1);
              } else if (currentView === 'week') {
                newDate.setDate(newDate.getDate() + 7);
              } else if (currentView === 'month') {
                newDate.setMonth(newDate.getMonth() + 1);
              }
              setSelectedDate(newDate);
            }}>
              ❯
            </button>
          </div>
        </div>
        <div className="view-options">
          <button 
            className={`view-button ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button 
            className={`view-button ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button 
            className={`view-button ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className={`calendar-wrapper ${isOver ? 'drag-over' : ''}`}>
        <DragAndDropCalendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          draggableAccessor={() => true}
          view={currentView}
          onView={handleViewChange}
          date={selectedDate}
          onNavigate={date => setSelectedDate(date)}
          style={{ height: "calc(100vh - 150px)" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          step={15}
          timeslots={4}
          min={new Date(0, 0, 0, 7, 0, 0)} // 7:00 AM
          max={new Date(0, 0, 0, 22, 0, 0)} // 10:00 PM
          tooltipAccessor={event => event.title}
          popup
        />
      </div>

      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onClose={closeModal}
          event={selectedEvent}
          slotInfo={selectedSlot}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar; 