import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Shield, BookOpen, TrendingUp, Eye, EyeOff } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectBasedOnRole = (role: string) => {
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    const loggedInUser = await login(email, password); // 👈 now `User | null`

    if (loggedInUser) {
      redirectBasedOnRole(loggedInUser.role); // 👈 no more TypeScript error
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }

    setIsLoggingIn(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Pool Consultant Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-teal-600 p-12 text-white">
          <div className="max-w-md mx-auto my-auto">
            <h2 className="text-4xl font-bold mb-8">
              Welcome to Pool Consultant Management System
            </h2>
            <p className="text-xl mb-12 text-blue-100">
              Streamline your workforce management with comprehensive tools for
              administrators and consultants.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                  <p className="text-blue-100">
                    Complete user management, analytics, and system administration
                    tools.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Learning Management
                  </h3>
                  <p className="text-blue-100">
                    Track courses, skills development, and progress monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Career Opportunities</h3>
                  <p className="text-blue-100">
                    Skill-based opportunity matching and career progression tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Access your dashboard</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
