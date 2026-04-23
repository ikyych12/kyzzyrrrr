import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/Routes';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { WhatsAppSettingsPage } from './pages/WhatsAppSettingsPage';
import { DomainManagerPage } from './pages/DomainManagerPage';
import { BadakWAPage } from './pages/BadakWAPage';
import { WebToAPKPage } from './pages/WebToAPKPage';
import { TutorialPage } from './pages/TutorialPage';
import { TipsPage } from './pages/TipsPage';
import { UnbandPage } from './pages/UnbandPage';
import { AccountAgePage } from './pages/AccountAgePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { AnimeDiscoveryPage } from './pages/AnimeDiscoveryPage';
import { AnimeWatchPage } from './pages/AnimeWatchPage';
import { NIKCheckerPage } from './pages/NIKCheckerPage';
import { KyzzyStorePage } from './pages/KyzzyStorePage';
import { InstallAppPage } from './pages/InstallAppPage';
import { SettingsPage } from './pages/SettingsPage';
import { DynamicTitle } from './components/DynamicTitle';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <DynamicTitle />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/store" element={<KyzzyStorePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/badak-wa" element={<BadakWAPage />} />
            <Route path="/web-to-apk" element={<WebToAPKPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/unband" element={<UnbandPage />} />
            <Route path="/account-age" element={<AccountAgePage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/anime" element={<AnimeDiscoveryPage />} />
            <Route path="/anime/:id" element={<AnimeWatchPage />} />
            <Route path="/nik-checker" element={<NIKCheckerPage />} />
            <Route path="/install" element={<InstallAppPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            
            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/admin/whatsapp" element={<WhatsAppSettingsPage />} />
              <Route path="/admin/domain" element={<DomainManagerPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
