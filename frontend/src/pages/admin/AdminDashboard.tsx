import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import api from '../../utils/axios';
import {
  Users,
  TrendingUp,
  BookOpen,
  Briefcase,
  Eye,
  Calendar,
  Award,
  LucideIcon,
} from 'lucide-react';

type Stat = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  change: string;
};

type User = {
  user_id: string;
  name: string;
  email: string;
  department: string;
  skills: string[];
  joinDate: string;
  progress: number;
  attendance: number;
  coursesCompleted: number;
  opportunities: number;
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [mockUsers, setMockUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      try {
        setLoading(true);
        const response = await api.get('/admin-aggregated/');
        const data = response.data;

        const users: User[] = data.users || [];
        console.log(users);
        setMockUsers(users);

        const avgProgress =
          (users.reduce((sum: number, user: User) => sum + (user.progress || 0), 0) || 0) /
          (users.length || 1);

        setStats([
          {
            title: 'Total Users',
            value: data.total_users || users.length,
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
          },
          {
            title: 'Active Courses',
            value: data.total_courses || 0,
            icon: BookOpen,
            color: 'bg-green-500',
            change: '+8%',
          },
          {
            title: 'Opportunities',
            value: data.total_jobs || 0,
            icon: Briefcase,
            color: 'bg-purple-500',
            change: '+15%',
          },
          {
            title: 'Avg. Progress',
            value: `${Math.round(avgProgress)}%`,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+5%',
          },
        ]);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6">
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
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600">Overview of all registered users and their progress</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(user.skills) ? user.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx}>{skill}</span>
                        )) : null}
                        {user.skills.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{user.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-900">{user.coursesCompleted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/user/${user.user_id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe completed React Advanced course</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New opportunity posted: Senior Developer</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Jane Smith enrolled in Machine Learning Basics</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/register')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Register New User
              </button>
              <button
                onClick={() => navigate('/admin/upload-opportunities')}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Upload Opportunities
              </button>
              <button
                onClick={() => navigate('/admin/upload-courses')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Upload Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
