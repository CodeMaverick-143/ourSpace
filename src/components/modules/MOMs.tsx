import React, { useState } from 'react';
import { Plus, FileText, Edit2, Trash2, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MOM } from '../../types';

const MOMs: React.FC = () => {
  const { user } = useAuth();
  const [moms, setMoms] = useLocalStorage<MOM[]>('nst-sdc-moms', []);
  const [showForm, setShowForm] = useState(false);
  const [editingMom, setEditingMom] = useState<MOM | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    participants: [''],
    summary: '',
    decisions: ['']
  });

  const canEdit = user?.role === 'secretary' || user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanFormData = {
      ...formData,
      participants: formData.participants.filter(p => p.trim() !== ''),
      decisions: formData.decisions.filter(d => d.trim() !== '')
    };

    if (editingMom) {
      setMoms(moms.map(mom => 
        mom.id === editingMom.id 
          ? { ...mom, ...cleanFormData }
          : mom
      ));
      setEditingMom(null);
    } else {
      const newMom: MOM = {
        id: Date.now().toString(),
        ...cleanFormData,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString()
      };
      setMoms([newMom, ...moms]);
    }
    
    setFormData({ title: '', date: '', participants: [''], summary: '', decisions: [''] });
    setShowForm(false);
  };

  const handleEdit = (mom: MOM) => {
    setEditingMom(mom);
    setFormData({
      title: mom.title,
      date: mom.date,
      participants: mom.participants.length > 0 ? mom.participants : [''],
      summary: mom.summary,
      decisions: mom.decisions.length > 0 ? mom.decisions : ['']
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this MOM?')) {
      setMoms(moms.filter(mom => mom.id !== id));
    }
  };

  const addParticipant = () => {
    setFormData({ ...formData, participants: [...formData.participants, ''] });
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData({ ...formData, participants: newParticipants });
  };

  const removeParticipant = (index: number) => {
    setFormData({ 
      ...formData, 
      participants: formData.participants.filter((_, i) => i !== index) 
    });
  };

  const addDecision = () => {
    setFormData({ ...formData, decisions: [...formData.decisions, ''] });
  };

  const updateDecision = (index: number, value: string) => {
    const newDecisions = [...formData.decisions];
    newDecisions[index] = value;
    setFormData({ ...formData, decisions: newDecisions });
  };

  const removeDecision = (index: number) => {
    setFormData({ 
      ...formData, 
      decisions: formData.decisions.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minutes of Meetings</h2>
          <p className="text-gray-600 mt-1">
            {canEdit ? 'Manage meeting minutes and decisions' : 'View meeting minutes and decisions'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add MOM
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingMom ? 'Edit MOM' : 'Add New MOM'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter meeting title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants
              </label>
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Participant name"
                  />
                  {formData.participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Participant
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Summary
              </label>
              <textarea
                required
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter meeting summary"
              />
            </div>

            {/* Decisions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Decisions
              </label>
              {formData.decisions.map((decision, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={decision}
                    onChange={(e) => updateDecision(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Decision or action item"
                  />
                  {formData.decisions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDecision(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDecision}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Decision
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingMom ? 'Update MOM' : 'Add MOM'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMom(null);
                  setFormData({ title: '', date: '', participants: [''], summary: '', decisions: [''] });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MOMs List */}
      <div className="space-y-4">
        {moms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No MOMs yet</p>
            <p className="text-gray-400">Meeting minutes will appear here when added</p>
          </div>
        ) : (
          moms.map((mom) => (
            <div key={mom.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{mom.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(mom.date).toLocaleDateString()}</span>
                    <Users className="h-4 w-4 ml-4 mr-2" />
                    <span>{mom.participants.length} participants</span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(mom)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mom.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {mom.participants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Participants:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mom.participants.map((participant, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
                  <p className="text-gray-700">{mom.summary}</p>
                </div>

                {mom.decisions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Decisions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {mom.decisions.map((decision, index) => (
                        <li key={index} className="text-gray-700">{decision}</li>
                      ))}
                    </ul>
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

export default MOMs;