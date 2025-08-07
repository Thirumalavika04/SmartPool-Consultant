import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserView from './pages/admin/AdminUserView';
import AdminRegistration from './pages/admin/AdminRegistration';
import AdminUploadOpportunities from './pages/admin/AdminUploadOpportunities';
import AdminUploadCourses from './pages/admin/AdminUploadCourses';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserAttendance from './pages/user/UserAttendance';
import UserOpportunities from './pages/user/UserOpportunities';
import UserCourses from './pages/user/UserCourses';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/user/:userId" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserView />
              </ProtectedRoute>
            } />
            <Route path="/admin/register" element={
              <ProtectedRoute requiredRole="admin">
                <AdminRegistration />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload-opportunities" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUploadOpportunities />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload-courses" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUploadCourses />
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute requiredRole="user">
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/user/attendance" element={
              <ProtectedRoute requiredRole="user">
                <UserAttendance />
              </ProtectedRoute>
            } />
            <Route path="/user/opportunities" element={
              <ProtectedRoute requiredRole="user">
                <UserOpportunities />
              </ProtectedRoute>
            } />
            <Route path="/user/courses" element={
              <ProtectedRoute requiredRole="user">
                <UserCourses />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;