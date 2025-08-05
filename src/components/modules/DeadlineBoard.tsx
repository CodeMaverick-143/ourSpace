import React, { useState } from 'react';
import { Plus, Clock, CheckSquare, AlertTriangle, Edit2, Trash2, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Task } from '../../types';

const DeadlineBoard: React.FC = () => {
  const { user, users } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('nst-sdc-tasks', []);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const canEdit = user?.role === 'admin';
  const userTasks = user?.role === 'member' 
    ? tasks.filter(task => task.assignedTo === user.id)
    : tasks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData }
          : task
      ));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString()
      };
      setTasks([newTask, ...tasks]);
    }
    
    setFormData({ 
      title: '', 
      description: '', 
      assignedTo: '', 
      deadline: '', 
      status: 'pending', 
      priority: 'medium' 
    });
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      deadline: task.deadline,
      status: task.status,
      priority: task.priority
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-yellow-500';
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Deadline Board</h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'member' 
              ? 'Your assigned tasks and deadlines'
              : 'Manage tasks and deadlines for all members'
            }
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Assign Task
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Assign New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  required
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a member</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingTask ? 'Update Task' : 'Assign Task'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setFormData({ 
                    title: '', 
                    description: '', 
                    assignedTo: '', 
                    deadline: '', 
                    status: 'pending', 
                    priority: 'medium' 
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {userTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {user?.role === 'member' ? 'No tasks assigned to you' : 'No tasks yet'}
            </p>
            <p className="text-gray-400">
              {user?.role === 'member' 
                ? 'Tasks assigned to you will appear here'
                : 'Tasks will appear here when assigned'
              }
            </p>
          </div>
        ) : (
          userTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${getPriorityColor(task.priority)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    {isOverdue(task.deadline) && task.status !== 'completed' && (
                      <AlertTriangle className="h-5 w-5 text-red-500 ml-2" />
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{getUserName(task.assignedTo)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className={isOverdue(task.deadline) && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'low' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeadlineBoard;