import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../components/Layout/UserLayout';
import api from '../../utils/axios';
import { 
  User, 
  Mail, 
  Calendar, 
  Upload,
  Download,
  Edit3,
  Save,
  X
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: 'Experienced frontend developer with a passion for creating engaging user experiences.',
    skills: user?.skills || ''
  });
  // console.log(formData)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // ✅ add this


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await api.get('/api/user/image/');
        if (res.data.image) {
          setProfileImageUrl(`http://localhost:8000${res.data.image}`);
        }
      } catch (err) {
        console.error('Error fetching profile image:', err);
      }
    };

    fetchProfileImage();
  }, []);

  const handleSave = () => {
    // Update user context with new data
    updateUser({
      name: formData.name,
      skills: (formData.skills as string).split(',').map((s: string) => s.trim())
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      bio: 'Experienced frontend developer with a passion for creating engaging user experiences.',
      skills: user?.skills?.join(', ') || ''
    });
    setIsEditing(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);

      try {
        const res = await api.post("/api/user/resume/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        const data = await res.data;
        if (res.status === 200 || res.status === 201) {
           setFormData(prev => ({
            ...prev,
            skills: data.skills || ''
          }));
          alert("Resume uploaded successfully!");
        } else {
          console.error(data);
          alert("Failed to upload resume.");
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading resume.");
      }
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await api.post("api/user/image/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        const data = await res.data;
        if (res.status === 200 || res.status === 201) {
          setProfileImageUrl(`http://localhost:8000${res.data.image}`)
          alert("Image uploaded successfully!");
        } else {
          console.error(data);
          alert("Failed to upload image.");
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading image.");
      }
    }
  };

  const handleDownloadResume = async () => {
    // In a real app, this would download the actual resume file
    try {
      const response = await api.get('/api/user/resume/',)
      const resumeUrl = response.data.resume;
      // console.log(response.data, response.data.resume)

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

  return (
    <UserLayout title="My Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="bg-teal-100 p-6 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-16 w-16 text-teal-600" />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-lg text-gray-600">{user?.department} Department</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user?.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {user?.joinDate && new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.location}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              {isEditing ? (
                <div>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter skills separated by commas"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                </div>
              ) : (
               <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.skills)
                    ? formData.skills
                    : typeof formData.skills === 'string'
                      ? formData.skills.split(',')
                      : []
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your resume</p>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {resumeFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">✓ Resume uploaded: {resumeFile.name}</p>
                  </div>
                )}
                
                <button
                  onClick={handleDownloadResume}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Current Resume
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Courses Completed</span>
                    <span className="text-sm font-medium text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Certificates Earned</span>
                    <span className="text-sm font-medium text-purple-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Skills Listed</span>
                    <span className="text-sm font-medium text-blue-600">{user?.skills?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;