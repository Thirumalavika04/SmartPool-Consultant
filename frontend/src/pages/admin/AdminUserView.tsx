import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Download, 
  BookOpen, 
  Briefcase,
  TrendingUp,
  Clock,
  Award,
  ArrowLeft
} from 'lucide-react';
import api from '../../utils/axios';

const AdminUserView: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mockOpportunities = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Google',
      matchScore: 92,
      location: 'Remote',
      type: 'Internship',
      postedDate: '2025-07-01',
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Amazon',
      matchScore: 85,
      location: 'Hyderabad',
      type: 'Full-Time',
      postedDate: '2025-06-20',
    },
  ];

  const mockCourses = [
    {
      id: 1,
      title: 'React for Beginners',
      status: 'completed',
      progress: 100,
      duration: '3 weeks',
      completedDate: '2025-06-15',
    },
    {
      id: 2,
      title: 'Node.js Deep Dive',
      status: 'in-progress',
      progress: 60,
      duration: '4 weeks',
    },
    {
      id: 3,
      title: 'PostgreSQL Essentials',
      status: 'completed',
      progress: 100,
      duration: '2 weeks',
      completedDate: '2025-06-01',
    },
  ];

  const mockAttendance = [
    { date: '2025-07-25', status: 'present', hours: 8 },
    { date: '2025-07-24', status: 'present', hours: 7 },
    { date: '2025-07-23', status: 'absent', hours: 0 },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get('/admin-aggregated/');
        const { users } = res.data;

        const matchedUser = users.find((user: any) => user.user_id == userId);
        if (matchedUser) {
          setUserData(matchedUser);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setOpportunities(mockOpportunities);
        setCourses(mockCourses);
        setAttendanceData(mockAttendance);
        setLoading(false);
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  const handleDownloadResume = async () => {
    // In a real app, this would download the actual resume file
    try {
      const response = await api.get('/api/user/resume/',{params: { user: userId }})
      const resumeUrl = response.data.resume;
      console.log(response.data, response.data.resume)
      
      if (!resumeUrl) return alert('No resume found.');

      const fileResponse = await fetch(`http://localhost:8000${resumeUrl}`);
      const blob = await fileResponse.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume.pdf'; // You can set the filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up
      
    } catch (error) {
      console.error(error);
      alert('Error downloading resume.');
    }
  };

  if (loading || !userData) return <AdminLayout title="Loading...">Loading...</AdminLayout>;

  return (
    <AdminLayout title={`User Profile - ${userData.name || 'Unnamed User'}`}>
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{userData.name || 'Unnamed User'}</h1>
                <p className="text-lg text-gray-600">{userData.position || 'No Position Info'}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {userData.email || 'No Email'}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData.location || 'Unknown Location'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {userData.joinDate ? `Joined ${new Date(userData.joinDate).toLocaleDateString()}` : 'Join date not available'}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadResume}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{userData.progress ?? 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{userData.attendance ?? 0}%</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {userData.coursesCompleted ?? 0}/{userData.totalCourses ?? 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{mockOpportunities.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(userData.skills)
    ? userData.skills.map((skill: string, index: number) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
        >
          {skill}
        </span>
      ))
    : typeof userData.skills === 'string'
      ? userData.skills.split(',').map((skill: string, index: number) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {skill.trim()}
          </span>
        ))
      : <span className="text-gray-500 text-sm">No skills provided</span>}

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Matched Opportunities</h2>
              </div>
            </div>
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {opportunity.matchScore}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{opportunity.company}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{opportunity.location} • {opportunity.type}</span>
                    <span>Posted {new Date(opportunity.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
              </div>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${course.progress ?? 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{course.progress ?? 0}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Duration: {course.duration}</span>
                    {course.completedDate && (
                      <span>Completed: {new Date(course.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.hours ?? 0}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserView;