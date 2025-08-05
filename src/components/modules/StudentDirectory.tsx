import React, { useState } from 'react';
import { Plus, Users, Github, Linkedin, Mail, Edit2, Trash2, Circle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User } from '../../types';

const StudentDirectory: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useLocalStorage<User[]>('nst-sdc-students', []);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: '',
    linkedin: '',
    workStatus: 'free' as 'free' | 'busy' | 'rest'
  });

  const canEdit = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData }
          : student
      ));
      setEditingStudent(null);
    } else {
      const newStudent: User = {
        id: Date.now().toString(),
        ...formData,
        role: 'member'
      };
      setStudents([...students, newStudent]);
    }
    
    setFormData({ name: '', email: '', github: '', linkedin: '', workStatus: 'free' });
    setShowForm(false);
  };

  const handleEdit = (student: User) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      github: student.github || '',
      linkedin: student.linkedin || '',
      workStatus: student.workStatus
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free':
        return 'text-green-500';
      case 'busy':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Directory</h2>
          <p className="text-gray-600 mt-1">Member profiles and availability status</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Student
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter student name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="GitHub username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="LinkedIn username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Status
              </label>
              <select
                value={formData.workStatus}
                onChange={(e) => setFormData({ ...formData, workStatus: e.target.value as 'free' | 'busy' | 'rest' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="free">Free</option>
                <option value="busy">Busy</option>
                <option value="rest">Rest</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingStudent(null);
                  setFormData({ name: '', email: '', github: '', linkedin: '', workStatus: 'free' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students yet</p>
            <p className="text-gray-400">Student profiles will appear here when added</p>
          </div>
        ) : (
          students.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <div className="flex items-center">
                      <Circle className={`h-2 w-2 mr-2 fill-current ${getStatusColor(student.workStatus)}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.workStatus)}`}>
                        {student.workStatus.charAt(0).toUpperCase() + student.workStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  <a href={`mailto:${student.email}`} className="text-sm hover:text-indigo-600 transition-colors">
                    {student.email}
                  </a>
                </div>

                {student.github && (
                  <div className="flex items-center text-gray-600">
                    <Github className="h-4 w-4 mr-3" />
                    <a
                      href={`https://github.com/${student.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-indigo-600 transition-colors"
                    >
                      {student.github}
                    </a>
                  </div>
                )}

                {student.linkedin && (
                  <div className="flex items-center text-gray-600">
                    <Linkedin className="h-4 w-4 mr-3" />
                    <a
                      href={`https://linkedin.com/in/${student.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-indigo-600 transition-colors"
                    >
                      {student.linkedin}
                    </a>
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

export default StudentDirectory;