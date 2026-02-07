// Dashboard Layout Component

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut,
  Briefcase,
  Bell,
  Search,
  Menu,
  X,
  Users,
  CreditCard
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', href: '/applications', icon: FileText },
    { name: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 3 },
    { name: 'Profile Settings', href: '/profile', icon: Settings },
  ];

  const employerNavigation = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'My Jobs', href: '/employer/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/employer/candidates', icon: Users },
    { name: 'Company Profile', href: '/employer/profile', icon: Settings }, // Using Settings icon for now as Company Profile
    { name: 'Billing', href: '/employer/billing', icon: CreditCard },
  ];

  // Determine which navigation to use
  const currentNavigation = user?.user_type === 'employer' ? employerNavigation : navigation;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-700">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">JobFinder</span>
            <button
              className="ml-auto lg:hidden text-gray-400"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {currentNavigation.map((item) => {
              const isActive = router.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.name}
                  </div>
                  {/* @ts-ignore - badge property exists in freelancer navigation */}
                  {item.badge && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {/* @ts-ignore */}
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-700 hover:text-red-300 transition-colors mt-8"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center p-3 rounded-lg bg-gray-700 bg-opacity-50">
              <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-bold text-lg">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {user ? `${user.first_name} ${user.last_name}` : 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.user_type === 'freelancer' ? 'Full-stack Dev' : 'Employer Portal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 text-gray-400 mr-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white capitalize">
              {router.pathname.split('/')[1] || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {user?.user_type === 'employer' ? (
              <Link
                href="/employer/jobs/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <div className="mr-2 text-xl font-bold leading-none">+</div>
                Post New Job
              </Link>
            ) : (
              <Link
                href="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Find New Jobs
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
