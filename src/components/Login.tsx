import React, { useState } from 'react';
import { LogIn, Users, Shield, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">NST-SDC Workspace</h2>
          <p className="mt-2 text-gray-600">Software Developer Club Portal</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Demo Credentials
            </h3>
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-red-500" />
                <span className="font-medium">Admin:</span>
                <span className="ml-2">admin@nstsdc.com / password123</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-blue-500" />
                <span className="font-medium">Secretary:</span>
                <span className="ml-2">secretary@nstsdc.com / password123</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-green-500" />
                <span className="font-medium">Member:</span>
                <span className="ml-2">member@nstsdc.com / password123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;