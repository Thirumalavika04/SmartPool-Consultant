import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../components/Layout/UserLayout';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Award, 
  Clock,
  Briefcase,
  Target,
  CheckCircle
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Show password change modal for first-time users
    if (user?.isFirstLogin) {
      setShowPasswordModal(true);
    }
  }, [user]);

  const handlePasswordChange = () => {
    setShowPasswordModal(false);
    if (user?.isFirstLogin) {
      updateUser({ isFirstLogin: false });
    }
  };

  const stats = [
    {
      title: 'Overall Progress',
      value: '85%',
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+12% this month'
    },
    {
      title: 'Courses Completed',
      value: '8/12',
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '2 in progress'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Last 30 days'
    },
    {
      title: 'Certificates Earned',
      value: '5',
      icon: Award,
      color: 'bg-orange-500',
      change: '3 pending'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      progress: 100,
      status: 'completed',
      completedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Node.js Microservices',
      progress: 65,
      status: 'in-progress',
      completedDate: null
    },
    {
      id: 3,
      title: 'Docker for Developers',
      progress: 30,
      status: 'in-progress',
      completedDate: null
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete TypeScript Advanced module',
      dueDate: '2024-01-20',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Submit project portfolio',
      dueDate: '2024-01-22',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Attend team sync meeting',
      dueDate: '2024-01-18',
      priority: 'low'
    }
  ];

  const recentOpportunities = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      matchScore: 95,
      location: 'Remote'
    },
    {
      id: 2,
      title: 'Frontend Team Lead',
      company: 'StartupXYZ',
      matchScore: 88,
      location: 'San Francisco, CA'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <UserLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-teal-100 mb-4">Here's your progress overview and upcoming tasks</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  <span>85% Goal Progress</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>3 tasks due this week</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <div className="flex items-center">
                      {course.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                  </div>
                  {course.completedDate && (
                    <p className="text-xs text-gray-500">
                      Completed: {new Date(course.completedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Opportunities</h3>
            <Briefcase className="h-5 w-5 text-green-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {opportunity.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{opportunity.company}</p>
                <p className="text-xs text-gray-500">{opportunity.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal 
          isOpen={showPasswordModal}
          onClose={handlePasswordChange}
          isFirstTime={user?.isFirstLogin || false}
        />
      )}
    </UserLayout>
  );
};

export default UserDashboard;