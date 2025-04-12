import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/constants';
import '../styles/TaskItem.css';

// Map of category icons
const TASK_ICONS = {
  exercise: '🏃',
  eating: '🍽️',
  work: '💼',
  relax: '🧘',
  family: '👨‍👩‍👧',
  social: '🎭',
  default: '📝'
};

const TaskItem = ({ task, goalColor }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get an appropriate icon based on the task name or default
  const getTaskIcon = (taskName) => {
    const lowerName = taskName.toLowerCase();
    
    if (lowerName.includes('run') || lowerName.includes('gym') || lowerName.includes('workout'))
      return TASK_ICONS.exercise;
    if (lowerName.includes('eat') || lowerName.includes('lunch') || lowerName.includes('dinner'))
      return TASK_ICONS.eating;
    if (lowerName.includes('work') || lowerName.includes('meeting') || lowerName.includes('project'))
      return TASK_ICONS.work;
    if (lowerName.includes('relax') || lowerName.includes('break') || lowerName.includes('rest'))
      return TASK_ICONS.relax;
    if (lowerName.includes('family') || lowerName.includes('kids') || lowerName.includes('home'))
      return TASK_ICONS.family;
    if (lowerName.includes('friend') || lowerName.includes('party') || lowerName.includes('social'))
      return TASK_ICONS.social;
    
    return TASK_ICONS.default;
  };

  return (
    <div 
      ref={drag}
      className={`task-item ${isDragging ? 'dragging' : ''}`}
      style={{ 
        borderLeft: `4px solid ${goalColor}`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <span className="task-icon">{getTaskIcon(task.name)}</span>
      <span className="task-name">{task.name}</span>
    </div>
  );
};

export default TaskItem; 