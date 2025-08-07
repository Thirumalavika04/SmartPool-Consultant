import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../components/Layout/UserLayout';
import api from '../../utils/axios'; // path may vary depending on your folder structure
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Search,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const UserOpportunities: React.FC = () => {
  interface Opportunity {
    id: string;
    job_title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    salary: string;
    required_skills?: string[] | string;
    matchScore: number;
    applicants: number;
    postedDate: string;
    requirements?: string;
  }

  const { user, updateUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [submitMessage, setSubmitMessage] = useState('');
  const [] = useState<string[]>([]);

  // Mock opportunities data based on user skills
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matchedJobs, setmatchedjobs] = useState<Opportunity[]>([]);
  const [, setLoading] = useState(true);
  const handleApply = () => {
    setSubmitMessage('You have applyed for the jobs');
  };

  React.useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await api.get('/api/opportunities/jobs/');
        const allJobs = response.data;
        console.log(allJobs)
        const userSkills: string[] = Array.isArray(user?.skills)
          ? user.skills.map((skill: string) => skill.toLowerCase().trim())
          : typeof user?.skills === 'string'
            ? user.skills.split(',').map((s: string) => s.toLowerCase().trim())
            : [];

        const matchedJobs = allJobs.filter((job: any) => {
          const requiredSkills: string[] = Array.isArray(job.required_skills)
            ? job.required_skills.map((skill: string) => skill.toLowerCase().trim())
            : [];

          // Check if ANY user skill exists in required skills
          return requiredSkills.some((required) => userSkills.includes(required));
        });
        setmatchedjobs(matchedJobs)

        setOpportunities(response.data); 
        
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);


  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch =
    (opp.job_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (opp.company?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || opp.type.toLowerCase() === selectedType;
    const matchesLocation = selectedLocation === 'all' || (opp.location?.toLowerCase() || "").includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <UserLayout title="Job Opportunities">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Opportunities Matched for You</h2>
              <p className="text-blue-100">
                Based on your skills: {
                  Array.isArray(user?.skills)
                  ? (user.skills.length > 1 ? user.skills.join(', ') : user.skills[0])
                  : user?.skills
                }
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span className="text-sm">{matchedJobs.length} opportunities found</span>
                </div>
                {/* <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">Average match: 82%</span>
                </div> */}
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <Briefcase className="h-12 w-12" />                
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
            {matchedJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold">{job.job_title} at {job.company}</h3>
                <p className="text-sm text-gray-700 mt-1">{job.location} — {job.type}</p>
                <p className="text-sm text-gray-800 mt-2">{job.description}</p>
                <p className="text-sm mt-2"><strong>Salary:</strong> {job.salary}</p>
                <p className="text-sm mt-1"><strong>Skills Required:</strong> {job.required_skills?.join(',')}</p>
              </div>
            ))}
          </div>

        <hr></hr>
        <h3>Other Jobs:</h3>
        <hr></hr>

        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
              
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                <option value="new york">New York</option>
                <option value="san francisco">San Francisco</option>
                <option value="austin">Austin</option>
              </select>
            </div>
          </div>
        </div> */}

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

        {/* Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{opportunity.job_title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(opportunity.matchScore)}`}>
                        <Star className="h-3 w-3 inline mr-1" />
                        0% match
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-3">{opportunity.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {opportunity.type}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {opportunity.salary}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {opportunity.applicants} applicants
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{opportunity.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type}
                    </span>
                    {Array.isArray(opportunity.required_skills) 
                      ? opportunity.required_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))
                      : (opportunity.required_skills || "")
                          .split(",")
                          .filter(skill => skill.trim() !== "")
                          .map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {skill.trim()}
                            </span>
                          ))
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learn More
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                      onClick={handleApply}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Skill Development Suggestions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Boost Your Opportunities</h3>
          <p className="text-blue-800 mb-4">
            Learning these skills could increase your match score and unlock more opportunities:
          </p>
          <div className="flex flex-wrap gap-2">
            {['TypeScript', 'GraphQL', 'Docker', 'AWS', 'MongoDB'].map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserOpportunities;