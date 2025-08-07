import React, { useState } from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import api from '../../utils/axios';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  MapPin,
  User
} from 'lucide-react';

const UserAttendance: React.FC = () => {
  interface Attendance {
    status: string;
    date: string;
    check_in?: string;
    checkOut?: string;
    remarks?: string;
  }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [attendanceHistory, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/mark-attendance/');
        console.log(response.data)
        setAttendance(response.data);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddAttemdance = async (status: string) => {
    try {
      const response = await api.post('/api/mark-attendance/', {status: status});
      const newRecord = response.data;

      setAttendance((prev) => [newRecord, ...prev]);
      setAttendanceMarked(true);
      if (response.data.status == "Absent"){
        setSubmitMessage('Please Avoid Taking Leave')
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = attendanceHistory.length;

  const presentDays = attendanceHistory.filter((record) => record.check_in).length;

  const absentDays = totalDays - presentDays;

  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  const stats = {
    totalDays: attendanceHistory.length,
    presentDays: attendanceHistory.filter((record) => record.check_in).length,
    absentDays: absentDays,
    attendanceRate: attendanceRate
  };

  const handleMarkAttendance = async () => {
    setIsMarkingAttendance(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAttendanceMarked(true);
    setIsMarkingAttendance(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'Present' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Present' 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceHistory.find(record => record.date === today);

  function formatTimeTo12Hour(timeStr: string): string {
    if (!timeStr) return '-';
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const minute = minuteStr.slice(0, 2); // Remove seconds/milliseconds
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }


  return (
    <UserLayout title="Attendance Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.attendanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Days</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.presentDays}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Days</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.absentDays}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Hours/Day</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.averageHours}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div> */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mark Attendance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
              </div>
              
              <div className="space-y-4">
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Current Location</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Office - New York</span>
                  </div>
                </div>

                {todayAttendance ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        Attendance already marked for today
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-green-700">
                      Check-in: {todayAttendance.check_in}
                    </div>
                  </div>
                ) : attendanceMarked ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        Attendance marked successfully!
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                  <button
                    onClick={() => handleAddAttemdance("Present")}
                    disabled={isMarkingAttendance || selectedDate !== today}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {isMarkingAttendance ? 'Marking...' : 'Mark Present'}
                  </button>

                  <button
                    onClick={() => handleAddAttemdance("Absent")}
                    disabled={isMarkingAttendance || selectedDate !== today}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isMarkingAttendance ? 'Marking...' : 'Mark Absent'}
                  </button>
                </>
                )}

                {selectedDate !== today && (
                  <p className="text-xs text-amber-600 text-center">
                    You can only mark attendance for today
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check In
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              <span className="ml-1 capitalize">{record.status}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.status == "Present" ? (record.check_in ? formatTimeTo12Hour(record.check_in) : '-') : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week Overview </h2>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const isPresent = index < 5; // Mock data: present Mon-Fri
              const isToday = index === 1; // Mock: Tuesday is today
              
              return (
                <div
                  key={day}
                  className={`text-center p-3 rounded-lg border ${
                    isToday 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 mb-1">{day}</div>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    isPresent 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isPresent ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isPresent ? '8h' : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAttendance;