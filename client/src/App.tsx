import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { ProtectedRoute } from './components/ui/ProtectedRoute.tsx';

// Pages
import LandingPage from './pages/LandingPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import RoomsPage from './pages/RoomsPage.tsx';
import DeviceDetailPage from './pages/DeviceDetailPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';
import NotificationsPage from './pages/NotificationsPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

// Placeholder pages until implemented

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<MainLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/rooms" element={<RoomsPage />} />
                                <Route path="/devices/:id" element={<DeviceDetailPage />} />
                                <Route path="/analytics" element={<AnalyticsPage />} />
                                <Route path="/notifications" element={<NotificationsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                
                                {/* Redirect unknown within authenticated area to dashboard or show 404 */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;