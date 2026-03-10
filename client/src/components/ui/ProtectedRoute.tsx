import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { isDarkMode } = useTheme();

    if (isLoading) {
        return (
            <div className={`flex min-h-screen items-center justify-center ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-[#e5e7eb] text-black'}`}>
                <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
