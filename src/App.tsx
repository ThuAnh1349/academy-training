import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './modules/academy/components/MainLayout';
import { AcademyHomePage } from './modules/academy/pages/AcademyHomePage';
import { CoursePage } from './modules/academy/pages/CoursePage';
import { LessonPage } from './modules/academy/pages/LessonPage';
import { ProfilePage } from './modules/academy/pages/ProfilePage';
import { SearchPage } from './modules/academy/pages/SearchPage';
import { AdminPage } from './modules/academy/pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<AcademyHomePage />} />
              <Route path="course/:slug" element={<CoursePage />} />
              <Route path="player/:courseSlug/:lessonId" element={<LessonPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="*" element={<AcademyHomePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
