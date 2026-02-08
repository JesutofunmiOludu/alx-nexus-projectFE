
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/api/services';
import { AppNotification } from '@/types';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  Briefcase, 
  Info, 
  ExternalLink,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'application': return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'job': return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white relative rounded-full hover:bg-gray-800 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 flex items-center justify-center text-[10px] text-white font-bold rounded-full border-2 border-gray-800">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#1a1c23] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllReadMutation.mutate()}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-800/50">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-3 hover:bg-gray-800/30 transition-colors relative group ${!n.is_read ? 'bg-blue-600/5' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-gray-800 ${!n.is_read ? 'bg-gray-800' : 'bg-[#111318]'}`}>
                        {getIcon(n.category)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!n.is_read ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap mt-0.5">
                          {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      
                      {n.link && (
                        <Link 
                          href={n.link}
                          onClick={() => {
                            setIsOpen(false);
                            if (!n.is_read) markReadMutation.mutate(n.id);
                          }}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-400"
                        >
                          View Details
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>

                    {!n.is_read && (
                      <button 
                        onClick={() => markReadMutation.mutate(n.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-blue-500 transition-all absolute right-2 bottom-2"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm font-bold text-white">No notifications yet</p>
                <p className="text-xs text-gray-500 mt-1">We'll alert you when something important happens.</p>
              </div>
            )}
          </div>

          <Link 
            href="/notifications" 
            onClick={() => setIsOpen(false)}
            className="block text-center py-3 border-t border-gray-800 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest bg-gray-800/20"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
