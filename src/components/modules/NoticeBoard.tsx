import React, { useState } from 'react';
import { Plus, AlertTriangle, Info, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Notice } from '../../types';

const NoticeBoard: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useLocalStorage<Notice[]>('nst-sdc-notices', []);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const canEdit = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotice) {
      setNotices(notices.map(notice => 
        notice.id === editingNotice.id 
          ? { ...notice, ...formData }
          : notice
      ));
      setEditingNotice(null);
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        ...formData,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString()
      };
      setNotices([newNotice, ...notices]);
    }
    
    setFormData({ title: '', content: '', priority: 'medium' });
    setShowForm(false);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notice Board</h2>
          <p className="text-gray-600 mt-1">Club-wide announcements and important updates</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Notice
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingNotice ? 'Edit Notice' : 'Add New Notice'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notice title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notice content"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingNotice ? 'Update Notice' : 'Add Notice'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNotice(null);
                  setFormData({ title: '', content: '', priority: 'medium' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notices yet</p>
            <p className="text-gray-400">Notices will appear here when added</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${getPriorityColor(notice.priority)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getPriorityIcon(notice.priority)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-2">
                      {notice.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-3">{notice.content}</p>
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
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

export default NoticeBoard;