import React, { useState } from 'react';
import { Plus, Calendar, Clock, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Meeting } from '../../types';

const MeetingSchedule: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('nst-sdc-meetings', []);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    agenda: '',
    meetingLink: ''
  });

  const canEdit = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMeeting) {
      setMeetings(meetings.map(meeting => 
        meeting.id === editingMeeting.id 
          ? { ...meeting, ...formData }
          : meeting
      ));
      setEditingMeeting(null);
    } else {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        ...formData,
        createdBy: user?.id || ''
      };
      setMeetings([...meetings, newMeeting].sort((a, b) => 
        new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
      ));
    }
    
    setFormData({ title: '', date: '', time: '', agenda: '', meetingLink: '' });
    setShowForm(false);
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      agenda: meeting.agenda,
      meetingLink: meeting.meetingLink || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    }
  };

  const isPastMeeting = (date: string, time: string) => {
    return new Date(date + ' ' + time) < new Date();
  };

  const sortedMeetings = meetings.sort((a, b) => 
    new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meeting Schedule</h2>
          <p className="text-gray-600 mt-1">Upcoming meetings with agenda and links</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Meeting
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter meeting title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda
              </label>
              <textarea
                required
                rows={3}
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter meeting agenda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link (Optional)
              </label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://meet.google.com/..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMeeting(null);
                  setFormData({ title: '', date: '', time: '', agenda: '', meetingLink: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meetings List */}
      <div className="space-y-4">
        {sortedMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No meetings scheduled</p>
            <p className="text-gray-400">Scheduled meetings will appear here</p>
          </div>
        ) : (
          sortedMeetings.map((meeting) => {
            const isPast = isPastMeeting(meeting.date, meeting.time);
            return (
              <div
                key={meeting.id}
                className={`bg-white rounded-lg shadow-sm border p-6 ${
                  isPast ? 'opacity-75 bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {meeting.title}
                      </h3>
                      {isPast && (
                        <span className="ml-3 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          Past
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Agenda:</h4>
                      <p className="text-gray-700">{meeting.agenda}</p>
                    </div>

                    {meeting.meetingLink && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(meeting)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(meeting.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MeetingSchedule;