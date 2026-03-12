import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { MobileNav } from './MobileNav.tsx';

export const MainLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen theme-bg-primary w-full overflow-hidden">
            <Sidebar />
            <MobileNav />
            
            {/* Main Content Area */}
            <div className="flex-1 w-full lg:ml-0 pt-16 lg:pt-0 overflow-y-auto h-screen [will-change:scroll-position]">
                <main className="p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto [contain:layout]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
