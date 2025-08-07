import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  User, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  LogOut, 
  Users,
  ChevronDown
} from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
  title: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: Home },
    { name: 'Attendance', href: '/user/attendance', icon: Calendar },
    { name: 'Opportunities', href: '/user/opportunities', icon: Briefcase },
    { name: 'Courses', href: '/user/courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pool Consultant</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="bg-teal-100 p-2 rounded-full">
                <User className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/user/profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 inline mr-2" />
                  View Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;