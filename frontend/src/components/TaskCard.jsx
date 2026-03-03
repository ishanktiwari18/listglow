import React from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onUpdate }) => {
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '';

  const statusClass = {
    completed: 'status-completed',
    in_progress: 'status-progress',
    todo: 'status-todo',
  }[task.status];

  return (
    <div className={`task-card ${statusClass}`}>
      <div className="task-header">
        <h3>{task.title}</h3>

        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn-icon">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(task.id)} className="btn-icon">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <div className="task-description">{task.description}</div>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span className={`badge priority-${task.priority}`}>
            {task.priority.toUpperCase()}
          </span>

          <select
            className="status-select"
            value={task.status}
            onChange={(e) =>
              onUpdate(task.id, { status: e.target.value })
            }
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {task.due_date && (
          <div className="task-date">
            <Calendar size={12} /> {formatDate(task.due_date)}
          </div>
        )}
      </div>

      <div className="task-footer">
        Created: {formatDate(task.created_at)}
      </div>
    </div>
  );
};

export default TaskCard;
