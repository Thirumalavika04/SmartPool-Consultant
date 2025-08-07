import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Plus, X, BookOpen, Trash2, Clock } from 'lucide-react';
import api from '../../utils/axios'; // path may vary depending on your folder structure

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
}

const AdminUploadCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    id: '',
    course_title: '',
    course_description: '',
    instructor: '',
    duration: '',
    level: '',
    category: '',
    skills_covered: [],
    prerequisites: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const categories = [
    'Programming',
    'Web Development',
    'Data Science',
    'Design',
    'Marketing',
    'Business',
    'Project Management',
    'Soft Skills'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const handleFetchCourses = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.get('/api/opportunities/courses/');

      if (response.status === 200 || response.status === 201) {
        setCourses(response.data); // assuming response.data is the array of opportunities
      } else {
        setSubmitMessage('Failed to fetch opportunities.');
      }
    } catch (error: any) {
      console.error('Fetch error:', error?.response?.data || error.message);
      setSubmitMessage('Error fetching opportunities. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
      handleFetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!currentCourse.course_title.trim()) {
      setSubmitMessage('Please fill in the course course_title.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Send API request to add single course
      const response = await api.post('/api/opportunities/courses/', currentCourse);

      if (response.status === 201 || response.status === 200) {
        const newCourse = {
          ...response.data, // assuming response contains the saved course with ID
          id: response.data.id || Date.now().toString() // fallback for ID
        };

        setCourses(prev => [...prev, newCourse]);
        setSubmitMessage('Course uploaded successfully!');
        setCurrentCourse({
          id: '',
          course_title: '',
          course_description: '',
          instructor: '',
          duration: '',
          level: '',
          category: '',
          skills_covered: [],
          prerequisites: ''
        });
        setIsEditing(false);
      } else {
        setSubmitMessage('Upload failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Upload error:', error?.response?.data || error.message);
      setSubmitMessage('Error uploading course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentCourse({
      id: '',
      course_title: '',
      course_description: '',
      instructor: '',
      duration: '',
      level: '',
      category: '',
      skills_covered: [],
      prerequisites: ''
    });
    setIsEditing(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Upload Courses">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Learning Courses</h2>
              <p className="text-sm text-gray-600">Create and manage educational courses for skill development</p>
            </div>
          </div>

          {submitMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              submitMessage.includes('Successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add/Edit Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Course' : 'Add New Course'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="course_title"
                  value={currentCourse.course_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={currentCourse.instructor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter instructor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={currentCourse.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 8 hours, 4 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={currentCourse.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={currentCourse.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Covered
                </label>
                <input
                  type="text"
                  name="skills_covered"
                  value={currentCourse.skills_covered}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <textarea
                  name="course_description"
                  value={currentCourse.course_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites
                </label>
                <textarea
                  name="prerequisites"
                  value={currentCourse.prerequisites}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter course prerequisites"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddCourse}
                  disabled={!currentCourse.course_title.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Added Courses ({courses.length})
              </h3>
              {/* {courses.length > 0 && (
                <button
                  onClick={handleSubmitAll}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Uploading...' : 'Upload All'}
                </button>
              )} */}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No courses added yet</p>
                  <p className="text-sm">Use the form to add your first course</p>
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{course.course_title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                      <div className="flex space-x-2">
                        {/* <button
                          onClick={() => handleEditCourse(course)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button> */}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {course.category}
                      </span>
                      {course.duration && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                      )}
                    </div>

                    {
                      Array.isArray(course.skills_covered)
                        ? course.skills_covered.map((skill: string, idx: number) => (
                            <span key={idx} className="badge">{skill}</span>
                          ))
                        : typeof course.skills_covered === "string"
                          ? course.skills_covered.trim().startsWith("[") // likely JSON
                            ? (() => {
                                try {
                                  const parsed = JSON.parse(course.skills_covered as string);
                                  return Array.isArray(parsed)
                                    ? parsed.map((skill: string, idx: number) => (
                                        <span key={idx} className="badge">{skill}</span>
                                      ))
                                    : null;
                                } catch {
                                  return null;
                                }
                              })()
                            : (course.skills_covered as string).split(",").map((skill: string, idx: number) => (
                                <span key={idx} className="badge">{skill.trim()}</span>
                              ))
                          : null
                    }

                    {course.course_description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {course.course_description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUploadCourses;