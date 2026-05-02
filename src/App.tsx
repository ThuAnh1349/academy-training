import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './modules/academy/components/MainLayout';
import { AcademyHomePage } from './modules/academy/pages/AcademyHomePage';
import { CoursePage } from './modules/academy/pages/CoursePage';
import { LessonPage } from './modules/academy/pages/LessonPage';
import { ProfilePage } from './modules/academy/pages/ProfilePage';
import { SearchPage } from './modules/academy/pages/SearchPage';

function App() {
  return (
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
  );
}

export default App;
