import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import CommunityRoute from '../components/CommunityRoute';
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
import EditCourse from '../pages/EditCourse';
import Courses from '../pages/Courses';
import CourseViewer from '../pages/CourseViewer';
import CommunityAdmins from '../pages/CommunityAdmins';
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
      <Route path="/community-login" element={<CommunityLogin />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Legacy routes - redirect to community-specific URLs */}
      <Route path="/community-dashboard" element={<Navigate to="/community-login" replace />} />
      <Route path="/community-admins" element={<Navigate to="/community-login" replace />} />
      <Route path="/student-dashboard" element={<Navigate to="/community-login" replace />} />
      <Route path="/create-course" element={<Navigate to="/community-login" replace />} />
      <Route path="/edit-course/:courseId" element={<Navigate to="/community-login" replace />} />
      <Route path="/courses" element={<Navigate to="/community-login" replace />} />
      <Route path="/course-viewer/:courseId?" element={<Navigate to="/community-login" replace />} />
      
      {/* Community-specific routes */}
      <Route path="/:communityName/dashboard" element={
        <CommunityRoute>
          <CommunityDashboard />
        </CommunityRoute>
      } />
      <Route path="/:communityName/courses" element={
        <CommunityRoute>
          <Courses />
        </CommunityRoute>
      } />
      <Route path="/:communityName/course-viewer/:courseId?" element={
        <CommunityRoute>
          <CourseViewer />
        </CommunityRoute>
      } />
      <Route path="/:communityName/create-course" element={
        <CommunityRoute>
          <CreateCourse />
        </CommunityRoute>
      } />
      <Route path="/:communityName/edit-course/:courseId" element={
        <CommunityRoute>
          <EditCourse />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admins" element={
        <CommunityRoute>
          <CommunityAdmins />
        </CommunityRoute>
      } />
      <Route path="/:communityName/students" element={
        <CommunityRoute>
          <StudentDashboard />
        </CommunityRoute>
      } />
      
      {/* Default redirect - redirect based on user role */}
      <Route path="/" element={<Navigate to="/discovery" replace />} />
      <Route path="*" element={<Navigate to="/discovery" replace />} />
    </Routes>
  );
};

export default AppRoutes; 