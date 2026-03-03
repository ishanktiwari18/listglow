import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import './Dashboard.css';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      setShowForm(false);
      fetchTasks();
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskAPI.updateTask(taskId, taskData);
      setEditingTask(null);
      fetchTasks();
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      fetchTasks();
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    return { total, completed, inProgress, todo };
  };

  const stats = getTaskStats();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Management Dashboard</h1>
          <div className="user-info">
            <span className="user-name">
              {user?.full_name || user?.username}
              {isAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={14} />
            </button>

          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-banner">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>To Do</h3>
            <p className="stat-number todo">{stats.todo}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number progress">{stats.inProgress}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number completed">{stats.completed}</p>
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Your Tasks</h2>
            <div className="tasks-controls">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                + New Task
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          )}
        </div>
      </main>

      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ?
            (data) => handleUpdateTask(editingTask.id, data) :
            handleCreateTask
          }
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
