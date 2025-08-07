import React, { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { UserPlus, Save, X } from 'lucide-react';
import api from '../../utils/axios';

const AdminRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    location: '',
    skills: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const departments = [
    'Development',
    'Data Science',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Operations',
    'Finance'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        throw new Error('User not authenticated');
      }

      // Simulate API call
      const response = await api.post('/register/', { ...formData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        setSubmitMessage('User registered successfully!');
        setFormData({
          name: '',
          email: '',
          department: '',
          position: '',
          phone: '',
          location: '',
          skills: '',
        });
      } else {
        setSubmitMessage('Failed to register user. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      setSubmitMessage(error.response?.data?.detail || 'Error registering user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      phone: '',
      location: '',
      skills: ''
    });
    setSubmitMessage('');
  };

  return (
    <AdminLayout title="Register New User">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <p className="text-sm text-gray-600">Fill in the details to register a new user in the system</p>
            </div>
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter job position"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Registering...' : 'Register User'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Registration Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
              All required fields must be completed before registration
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
              The user will receive login credentials via email (in production)
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
              Users will be prompted to change their password on first login
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
              Skills can be edited later by the user in their profile
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRegistration;