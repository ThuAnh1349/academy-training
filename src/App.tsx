import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './modules/academy/components/MainLayout';
import { AcademyHomePage } from './modules/academy/pages/AcademyHomePage';
import { CoursePage } from './modules/academy/pages/CoursePage';
import { LessonPage } from './modules/academy/pages/LessonPage';
import { ProfilePage } from './modules/academy/pages/ProfilePage';
import { SearchPage } from './modules/academy/pages/SearchPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AcademyHomePage />} />
            <Route path="course" element={<CoursePage />} />
            <Route path="player" element={<LessonPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="*" element={<AcademyHomePage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
