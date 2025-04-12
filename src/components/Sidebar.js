import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoals, setCurrentGoal } from '../redux/slices/goalsSlice';
import { fetchTasks } from '../redux/slices/tasksSlice';
import TaskItem from './TaskItem';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { goals, currentGoal, loading: goalLoading, error: goalError } = useSelector(state => state.goals);
  const { tasks, loading: taskLoading, error: taskError } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  useEffect(() => {
    if (currentGoal) {
      dispatch(fetchTasks(currentGoal._id));
    }
  }, [dispatch, currentGoal]);

  const handleGoalClick = (goal) => {
    dispatch(setCurrentGoal(goal));
  };

  return (
    <div className="sidebar">
      <div className="section">
        <h3 className="section-title">GOALS</h3>
        <div className="goal-list">
          {goalLoading ? (
            <div className="loading">Loading goals...</div>
          ) : goalError ? (
            <div className="error">Failed to load goals</div>
          ) : (
            goals.map(goal => (
              <div 
                key={goal._id} 
                className={`goal-item ${currentGoal && currentGoal._id === goal._id ? 'selected' : ''}`}
                onClick={() => handleGoalClick(goal)}
                style={{ borderLeft: `4px solid ${goal.color}` }}
              >
                <span className="goal-icon">⭐</span>
                <span className="goal-name">{goal.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {currentGoal && (
        <div className="section">
          <h3 className="section-title">TASKS</h3>
          <div className="task-list">
            {taskLoading ? (
              <div className="loading">Loading tasks...</div>
            ) : taskError ? (
              <div className="error">Failed to load tasks</div>
            ) : tasks.length === 0 ? (
              <div className="empty">No tasks found</div>
            ) : (
              tasks.map(task => (
                <TaskItem 
                  key={task._id} 
                  task={task} 
                  goalColor={currentGoal.color} 
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 