
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Search,
  Briefcase,
  Users
} from 'lucide-react';
import { useAppSelector } from '@/store';

export function BottomNav() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const freelancerNav = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Search },
    { name: 'Apps', href: '/applications', icon: FileText },
    { name: 'Inbox', href: '/messages', icon: MessageSquare },
  ];

  const employerNav = [
    { name: 'Home', href: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/employer/jobs', icon: Briefcase },
    { name: 'Talent', href: '/employer/candidates', icon: Users },
    { name: 'Inbox', href: '/messages', icon: MessageSquare },
  ];

  const navItems = user?.user_type === 'employer' ? employerNav : freelancerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1a1c23]/95 backdrop-blur-lg border-t border-gray-800 px-6 py-2 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                isActive ? 'scale-110' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
