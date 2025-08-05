import React, { useState } from 'react';
import { Plus, Activity, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Event } from '../../types';

const EventsTracker: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useLocalStorage<Event[]>('nst-sdc-events', []);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning' as 'planning' | 'ongoing' | 'completed',
    startDate: '',
    endDate: ''
  });

  const canEdit = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
      setEditingEvent(null);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        createdBy: user?.id || ''
      };
      setEvents([newEvent, ...events]);
    }
    
    setFormData({ title: '', description: '', status: 'planning', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'ongoing':
        return '🔄';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Events Tracker</h2>
          <p className="text-gray-600 mt-1">Track club events and their progress</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Event
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter event title"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'planning' | 'ongoing' | 'completed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="planning">Planning</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  setFormData({ title: '', description: '', status: 'planning', startDate: '', endDate: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events yet</p>
            <p className="text-gray-400">Events will appear here when added</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{getStatusIcon(event.status)}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{event.description}</p>

                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Starts: {new Date(event.startDate).toLocaleDateString()}
                      {event.endDate && (
                        <span className="ml-4">
                          Ends: {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
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

export default EventsTracker;