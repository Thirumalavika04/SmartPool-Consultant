import React, { useState } from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import api from '../../utils/axios'; // path may vary depending on your folder structure
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Star,
  Search,
  CheckCircle,
  BarChart3,
  User,
  Trophy
} from 'lucide-react';

const UserCourses: React.FC = () => {
  interface Course {
    id: string;
    course_title: string;
    course_description: string;
    instructor: string;
    duration: string;
    level: string;
    category: string;
    skills_covered: string[] | string;
    prerequisites: string;
    progress: number;
    rating: number;
    chapters: number;
    students: number;
    certificate: string;
    completedDate: string;
    status: string;

  }
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleStartCourse = () => {
    setSubmitMessage('You have started the course');
  };

  // Mock courses data
  const [courses, setCourses] = useState<Course[]>([]);
  const [, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/opportunities/courses/');
        console.log(response.data)
        setCourses(response.data); // Adjust if response is wrapped (e.g., response.data.results)
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course?.course_title || '' || course.instructor;
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || 'Completed' === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'recommended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'recommended': return <Star className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Calculate stats
  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const inProgressCourses = courses.filter(c => c.status === 'in-progress').length;
  const totalHours = courses.reduce((acc, course) => acc + parseInt(course.duration), 0);
  const avgProgress = Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length);

  return (
    <UserLayout title="My Courses">
      <div className="space-y-6">
        {/* Stats Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
              <p className="text-purple-100 mb-4">Continue building your skills with personalized courses</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  <span>{completedCourses} completed</span>
                </div>
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  <span>{inProgressCourses} in progress</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{totalHours} total hours</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <BookOpen className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedCourses}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressCourses}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Progress</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{avgProgress}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{completedCourses}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>*/}

        {/* Filters
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Programming">Programming</option>
                <option value="DevOps">DevOps</option>
                <option value="API Development">API Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
                <option value="recommended">Recommended</option>
              </select>
            </div>
          </div>
        </div>  */}

        {/* ✅ Message Box */}
        {submitMessage && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              submitMessage.includes('Successfully')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-green-50 border border-green-200 text-green-700' // force green always
            }`}
          >
            {submitMessage}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{course.course_title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {getStatusIcon(course.status || '')}
                        <span className="ml-1 capitalize">{course.status?.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {course.instructor}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.course_description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                    {(Array.isArray(course.skills_covered)
                      ? course.skills_covered.slice(0, 2)
                      : course.skills_covered.split(',').slice(0, 2)
                    ).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}

                    {(Array.isArray(course.skills_covered)
                      ? course.skills_covered.length
                      : course.skills_covered.split(',').length) > 2 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        +
                        {(Array.isArray(course.skills_covered)
                          ? course.skills_covered.length
                          : course.skills_covered.split(',').length) - 2}
                      </span>
                    )}
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>{course.chapters} chapters • {course.students} students</span>
                      {course.certificate && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-yellow-600">Certificate included</span>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {course.status === 'completed' ? (
                        <button className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          View Certificate
                        </button>
                      ) : course.status === 'in-progress' ? (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </button>
                      ) : (
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                        onClick={handleStartCourse}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Start Course
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {course.completedDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      Completed: {new Date(course.completedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserCourses;