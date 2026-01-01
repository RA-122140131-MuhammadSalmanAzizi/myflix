import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePage from './pages/BrowsePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import MyListPage from './pages/MyListPage';
import WatchPage from './pages/WatchPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="netflix-font text-4xl text-[#E50914]">MYFLIX</span>
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Profile Required Route Component
const ProfileRequiredRoute = ({ children }) => {
  const { currentProfile, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="netflix-font text-4xl text-[#E50914]">MYFLIX</span>
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
};

// App Content with Routes
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Browse Routes - Require Profile */}
      <Route
        path="/browse"
        element={
          <ProfileRequiredRoute>
            <BrowsePage />
          </ProfileRequiredRoute>
        }
      />

      <Route
        path="/browse/movies"
        element={
          <ProfileRequiredRoute>
            <MoviesPage />
          </ProfileRequiredRoute>
        }
      />

      <Route
        path="/browse/series"
        element={
          <ProfileRequiredRoute>
            <SeriesPage />
          </ProfileRequiredRoute>
        }
      />

      <Route
        path="/browse/my-list"
        element={
          <ProfileRequiredRoute>
            <MyListPage />
          </ProfileRequiredRoute>
        }
      />

      <Route
        path="/watch/:id"
        element={
          <ProfileRequiredRoute>
            <WatchPage />
          </ProfileRequiredRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
