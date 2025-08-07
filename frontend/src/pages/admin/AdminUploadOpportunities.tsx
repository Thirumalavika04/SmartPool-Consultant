import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Upload, Plus, X, Briefcase, Trash2 } from 'lucide-react';
import api from '../../utils/axios'; // path may vary depending on your folder structure


interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  skills: string;
}

const AdminUploadOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentOpportunity, setCurrentOpportunity] = useState<Opportunity>({
    id: '',
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    salary: '',
    skills: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOpportunity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOpportunity = async () => {
    if (!currentOpportunity.title.trim()) return;

    const newOpportunity = {
      ...currentOpportunity,
      id: isEditing ? currentOpportunity.id : Date.now().toString()
    };

    try {
      const { id, ...opportunityData } = newOpportunity;

      const payload = {
        job_title: opportunityData.title,
        company: opportunityData.company,
        location: opportunityData.location,
        job_type: opportunityData.type.toLowerCase(),  // e.g., "Full-time" → "full-time"
        salary: opportunityData.salary,
        required_skills: opportunityData.skills.split(',').map(skill => skill.trim()),
        job_description: opportunityData.description,
        requirements: opportunityData.requirements
      };
      console.log("Submitting:", payload);
      const response = await api.post('/api/opportunities/jobs/', payload);

      if (response.status === 201 || response.status === 200) {
        setOpportunities(prev => [...prev, response.data]);
        setSubmitMessage(`Opportunity "${newOpportunity.title}" uploaded successfully!`);
      } else {
        setSubmitMessage('Upload failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Upload error:', error?.response?.data || error.message);
      setSubmitMessage('Error uploading opportunity. Please try again.');
    }

    setCurrentOpportunity({
    id: '',
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    salary: '',
    skills: ''
  });

  setIsEditing(false);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setCurrentOpportunity(opportunity);
    setIsEditing(true);
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const handleFetchOpportunity = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.get('/api/opportunities/jobs/');

      if (response.status === 200 || response.status === 201) {
        setOpportunities(response.data); // assuming response.data is the array of opportunities
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
    handleFetchOpportunity();
  }, []);

  // const handleSubmitAll = async () => {
  //   if (opportunities.length === 0) {
  //     setSubmitMessage('Please add at least one opportunity before submitting.');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitMessage('');

  //   try {
  //     // Simulate API call
  //     const response = await api.post('/api/opportunities/jobs', {opportunities,});
      
  //     if (response.status === 201 || response.status === 200) {
  //       setSubmitMessage(`Successfully uploaded ${opportunities.length} opportunities!`);
  //       setOpportunities([]);
  //     } else {
  //       setSubmitMessage('Upload failed. Please try again.');
  //     }
  //   } catch (error: any) {
  //     console.error('Upload error:', error?.response?.data || error.message);
  //     setSubmitMessage('Error uploading opportunities. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleReset = () => {
    setCurrentOpportunity({
      id: '',
      title: '',
      company: '',
      location: '',
      type: '',
      description: '',
      requirements: '',
      salary: '',
      skills: ''
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout title="Upload Opportunities">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Job Opportunities</h2>
              <p className="text-sm text-gray-600">Create and manage job opportunities for users</p>
            </div>
          </div>

          {submitMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              submitMessage.includes('successfully') 
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
              {isEditing ? 'Edit Opportunity' : 'Add New Opportunity'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentOpportunity.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={currentOpportunity.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={currentOpportunity.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={currentOpportunity.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary"
                  value={currentOpportunity.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., $60,000 - $80,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={currentOpportunity.skills}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={currentOpportunity.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter job description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={currentOpportunity.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter job requirements"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddOpportunity}
                  disabled={!currentOpportunity.title.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Opportunity' : 'Add Opportunity'}
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

          {/* Opportunities List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Added Opportunities ({opportunities.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {opportunities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No opportunities added yet</p>
                  <p className="text-sm">Use the form to add your first opportunity</p>
                </div>
              ) : (
                opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600">{opportunity.company}</p>
                      </div>
                      <div className="flex space-x-2">
                        {/* <button
                          onClick={() => handleEditOpportunity(opportunity)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button> */}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{opportunity.location} • {opportunity.type}</span>
                      {opportunity.salary && <span>{opportunity.salary}</span>}
                    </div>
                    {opportunity.skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {opportunity.skills.split(',').slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill.trim()}
                          </span>
                        ))}
                        {opportunity.skills.split(',').length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{opportunity.skills.split(',').length - 3} more
                          </span>
                        )}
                      </div>
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

export default AdminUploadOpportunities;