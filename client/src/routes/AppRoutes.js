import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/Login';
import DashboardOverview from '../pages/DashboardOverview';
import Academies from '../pages/Academies';
import Plans from '../pages/Plans';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Discovery from '../pages/Discovery';
import CreateCommunity from '../pages/CreateCommunity';
import CommunitySetup from '../pages/CommunitySetup';
import CommunityDashboard from '../pages/CommunityDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import CreateCourse from '../pages/CreateCourse';
import Courses from '../pages/Courses';
import CommunityLogin from '../pages/CommunityLogin';
import TestPage from '../pages/TestPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login route - no layout */}
      <Route path="/login" element={<Login />} />
      
      {/* Main app routes with layout - protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <MainLayout>
                <DashboardOverview />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/academies"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin', 'user']}>
              <MainLayout>
                <Academies />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin', 'user']}>
              <MainLayout>
                <Plans />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <MainLayout>
                <Users />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <MainLayout>
                <div style={{ padding: '24px' }}>Analytics Page - Coming Soon</div>
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <MainLayout>
                <Settings />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin', 'user']}>
              <MainLayout>
                <Profile />
              </MainLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Client-side routes - no protection needed */}
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/create-community" element={<CreateCommunity />} />
      <Route path="/community-setup" element={<CommunitySetup />} />
      <Route path="/community-dashboard" element={<CommunityDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/community-login" element={<CommunityLogin />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Default redirect - redirect based on user role */}
      <Route path="/" element={<Navigate to="/discovery" replace />} />
      <Route path="*" element={<Navigate to="/discovery" replace />} />
    </Routes>
  );
};

export default AppRoutes; 