import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import CommunityUserSignup from '../pages/CommunityUserSignup';
import CommunityUsers from '../pages/CommunityUsers';
import CommunityUserDashboard from '../pages/CommunityUserDashboard';
import CommunityUserLogin from '../pages/CommunityUserLogin';
import UnifiedLogin from '../pages/UnifiedLogin';
import StudentCourses from '../pages/StudentCourses';
import DiscoverCourseViewer from '../pages/DiscoverCourseViewer';
import TestPage from '../pages/TestPage';
import CommunityAbout from '../pages/CommunityAbout';
import AboutUsAdmin from '../pages/AboutUsAdmin';
import NotFound from '../pages/NotFound';
import SignUpLanding from '../pages/SignUpLanding';
import AboutUs from '../pages/AboutUs';
import AiBellnDesk from '../pages/AiBellnDesk';

// Component to handle legacy route redirects with community name
const LegacyRedirect = ({ to }) => {
  const { communityName } = useParams();
  return <Navigate to={`/${communityName}/${to}`} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login route - no layout */}
      <Route path="/login" element={<UnifiedLogin />} />
      
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
        path="/community-users"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <MainLayout>
                <CommunityUsers />
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
      
      {/* Client-side routes - no protection needed - MUST come before community-specific routes */}
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/discover-courseViewer/:courseId?" element={<DiscoverCourseViewer />} />
      <Route path="/create-community" element={<CreateCommunity />} />
      <Route path="/community-setup" element={<CommunitySetup />} />
      <Route path="/community-login" element={<UnifiedLogin />} />
      <Route path="/community-user-login" element={<UnifiedLogin />} />
      <Route path="/community-user-signup" element={<CommunityUserSignup />} />
      <Route path="/community-user-login" element={<CommunityUserLogin />} />
      <Route path="/test" element={<TestPage />} />
      {/* new page added */}
      <Route path="/signup-landing" element={<SignUpLanding />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/ai-bell-n-desk" element={<AiBellnDesk />} />
      
      {/* Community About Page - Public route */}
      <Route path="/:communityName/about" element={<CommunityAbout />} />
      
      {/* Legacy routes - redirect to login */}
      <Route path="/community-dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/community-admins" element={<Navigate to="/login" replace />} />
      <Route path="/student-dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/create-course" element={<Navigate to="/login" replace />} />
      <Route path="/edit-course/:courseId" element={<Navigate to="/login" replace />} />
      <Route path="/courses" element={<Navigate to="/login" replace />} />
      <Route path="/course-viewer/:courseId?" element={<Navigate to="/login" replace />} />
      
      {/* Community Admin routes - these use :communityName parameter */}
      <Route path="/:communityName/admin/dashboard" element={
        <CommunityRoute>
          <CommunityDashboard />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/courses" element={
        <CommunityRoute>
          <Courses />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/course-viewer/:courseId?" element={
        <CommunityRoute>
          <CourseViewer />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/create-course" element={
        <CommunityRoute>
          <CreateCourse />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/edit-course/:courseId" element={
        <CommunityRoute>
          <EditCourse />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/admins" element={
        <CommunityRoute>
          <CommunityAdmins />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/students" element={
        <CommunityRoute>
          <StudentDashboard />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/community-users" element={
        <CommunityRoute>
          <CommunityUsers />
        </CommunityRoute>
      } />
      <Route path="/:communityName/admin/about-us" element={
        <CommunityRoute>
          <AboutUsAdmin />
        </CommunityRoute>
      } />
      
      {/* Simple test route without parameters - MOVED UP */}
      <Route path="/test-simple" element={
        <div style={{ padding: '20px', background: 'lightgreen' }}>
          <h1>Simple Test Route Working!</h1>
          <p>This is a simple route without parameters</p>
        </div>
      } />
      
      {/* Debug route to see what's happening */}
      <Route path="/debug-route" element={
        <div style={{ padding: '20px', background: 'yellow' }}>
          <h1>Debug Route</h1>
          <p>Current path: {window.location.pathname}</p>
          <p>Current URL: {window.location.href}</p>
          <p>This route should work</p>
        </div>
      } />
      
      {/* Test route to verify routing is working - BYPASS CommunityRoute */}
      <Route path="/:communityName/admin/test-users" element={
        <div style={{ padding: '20px', background: 'lightblue' }}>
          <h1>Test Route Working!</h1>
          <p>Community: {window.location.pathname}</p>
          <p>This bypasses CommunityRoute to test if routing works</p>
        </div>
      } />

      {/* Community User routes - separate from admin routes */}
      <Route path="/:communityName/student/dashboard" element={
        <CommunityRoute>
          <CommunityUserDashboard />
        </CommunityRoute>
      } />
      <Route path="/:communityName/student/courses" element={
        <CommunityRoute>
          <StudentCourses />
        </CommunityRoute>
      } />
      <Route path="/:communityName/student/course-viewer/:courseId?" element={
        <CommunityRoute>
          <CourseViewer />
        </CommunityRoute>
      } />

      {/* Legacy routes for backward compatibility - redirect to appropriate user type */}
      <Route path="/:communityName/dashboard" element={<LegacyRedirect to="admin/dashboard" />} />
      <Route path="/:communityName/courses" element={<LegacyRedirect to="admin/courses" />} />
      <Route path="/:communityName/community-user-dashboard" element={<LegacyRedirect to="student/dashboard" />} />
      
      {/* 404 route for invalid community names */}
      <Route path="/404" element={<NotFound />} />
      
      {/* Default redirect - redirect based on user role */}
      <Route path="/" element={<Navigate to="/discovery" replace />} />
      
      {/* Catch-all route for unmatched paths - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 