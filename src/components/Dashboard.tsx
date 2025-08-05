import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Bell, 
  Calendar, 
  CheckSquare, 
  Link, 
  Activity,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MOMs from './modules/MOMs';
import NoticeBoard from './modules/NoticeBoard';
import DeadlineBoard from './modules/DeadlineBoard';
import MeetingSchedule from './modules/MeetingSchedule';
import FormsLinks from './modules/FormsLinks';
import StudentDirectory from './modules/StudentDirectory';
import EventsTracker from './modules/EventsTracker';

type Module = 'moms' | 'notices' | 'deadlines' | 'meetings' | 'forms' | 'directory' | 'events';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<Module>('notices');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'notices' as Module, name: 'Notice Board', icon: Bell, color: 'text-blue-600' },
    { id: 'moms' as Module, name: 'MOMs', icon: FileText, color: 'text-green-600' },
    { id: 'deadlines' as Module, name: 'Deadline Board', icon: CheckSquare, color: 'text-red-600' },
    { id: 'meetings' as Module, name: 'Meeting Schedule', icon: Calendar, color: 'text-purple-600' },
    { id: 'directory' as Module, name: 'Student Directory', icon: Users, color: 'text-indigo-600' },
    { id: 'events' as Module, name: 'Events Tracker', icon: Activity, color: 'text-orange-600' },
    { id: 'forms' as Module, name: 'Forms & Links', icon: Link, color: 'text-teal-600' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'moms':
        return <MOMs />;
      case 'notices':
        return <NoticeBoard />;
      case 'deadlines':
        return <DeadlineBoard />;
      case 'meetings':
        return <MeetingSchedule />;
      case 'forms':
        return <FormsLinks />;
      case 'directory':
        return <StudentDirectory />;
      case 'events':
        return <EventsTracker />;
      default:
        return <NoticeBoard />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'secretary':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">NST-SDC</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user?.role || '')}`}>
                {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
                activeModule === module.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <module.icon className={`h-5 w-5 mr-3 ${activeModule === module.id ? 'text-blue-700' : module.color}`} />
              {module.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {modules.find(m => m.id === activeModule)?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderModule()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;