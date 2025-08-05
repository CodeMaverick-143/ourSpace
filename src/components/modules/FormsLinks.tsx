import React, { useState } from 'react';
import { Plus, Link, ExternalLink, Edit2, Trash2, FileText, MessageSquare, Github } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FormLink } from '../../types';

const FormsLinks: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useLocalStorage<FormLink[]>('nst-sdc-links', []);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<FormLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'other' as 'registration' | 'feedback' | 'github' | 'other'
  });

  const canEdit = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLink) {
      setLinks(links.map(link => 
        link.id === editingLink.id 
          ? { ...link, ...formData }
          : link
      ));
      setEditingLink(null);
    } else {
      const newLink: FormLink = {
        id: Date.now().toString(),
        ...formData,
        createdBy: user?.id || ''
      };
      setLinks([newLink, ...links]);
    }
    
    setFormData({ title: '', description: '', url: '', category: 'other' });
    setShowForm(false);
  };

  const handleEdit = (link: FormLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'registration':
        return <FileText className="h-5 w-5" />;
      case 'feedback':
        return <MessageSquare className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'registration':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'feedback':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'github':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, FormLink[]>);

  const categoryOrder = ['registration', 'feedback', 'github', 'other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Forms & Links</h2>
          <p className="text-gray-600 mt-1">Important links and forms repository</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Link
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && canEdit && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingLink ? 'Edit Link' : 'Add New Link'}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter link title"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter link description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'registration' | 'feedback' | 'github' | 'other' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="registration">Registration</option>
                  <option value="feedback">Feedback</option>
                  <option value="github">GitHub</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingLink ? 'Update Link' : 'Add Link'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLink(null);
                  setFormData({ title: '', description: '', url: '', category: 'other' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links by Category */}
      <div className="space-y-6">
        {links.length === 0 ? (
          <div className="text-center py-12">
            <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No links yet</p>
            <p className="text-gray-400">Important links will appear here when added</p>
          </div>
        ) : (
          categoryOrder.map(category => {
            const categoryLinks = groupedLinks[category];
            if (!categoryLinks || categoryLinks.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 capitalize flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category === 'github' ? 'GitHub' : category}</span>
                  <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {categoryLinks.length}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryLinks.map((link) => (
                    <div key={link.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          {getCategoryIcon(link.category)}
                          <h4 className="text-lg font-semibold text-gray-900 ml-2">{link.title}</h4>
                        </div>
                        {canEdit && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(link)}
                              className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(link.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{link.description}</p>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(link.category)}`}>
                          {link.category.charAt(0).toUpperCase() + link.category.slice(1)}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          <span className="text-sm">Open</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormsLinks;