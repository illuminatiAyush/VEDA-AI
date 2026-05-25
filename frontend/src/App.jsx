import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'sonner';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const TeacherHomePage = lazy(() => import('./pages/teacher/TeacherHomePage'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const ToolkitPage = lazy(() => import('./pages/teacher/ToolkitPage'));
const LibraryPage = lazy(() => import('./pages/teacher/LibraryPage'));
const CreateTestPage = lazy(() => import('./pages/teacher/CreateTestPage'));
const TestViewerPage = lazy(() => import('./pages/teacher/TestViewerPage'));
const ProfilePage = lazy(() => import('./pages/common/ProfilePage'));

import { FullPageLoader } from './components/ui/Loader';

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return <FullPageLoader title="Loading VedaAI" subtitle="Synchronizing secure session" />;

  return (
    <Suspense fallback={<FullPageLoader title="Resolving View" subtitle="Loading page assets..." />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/teacher/home" replace /> : <AuthPage />} 
        />

        {/* App Framework */}
        <Route element={<ProtectedRoute />}>
          <Route path="/teacher" element={<MainLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<TeacherHomePage />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="toolkit" element={<ToolkitPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="create-test" element={<CreateTestPage />} />
            <Route path="test/:id" element={<TestViewerPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
