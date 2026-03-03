import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onUpdate }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
