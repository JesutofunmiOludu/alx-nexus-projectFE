
import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { getMockApplications } from '@/lib/mockData';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Send,
  Users,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { Application } from '@/types';

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState('All Applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  
  // Tabs configuration
  const tabs = ['All Applications', 'Active', 'Interviews', 'Archived'];

  // Fetch mock data (in real app, use React Query)
  const allApplications = getMockApplications().results;
  
  // Filter logic
  const filteredApplications = allApplications.filter(app => {
    // Tab filter
    if (activeTab === 'Active' && ['rejected', 'accepted'].includes(app.status)) return false;
    if (activeTab === 'Interviews' && app.status !== 'interviewing') return false;
    if (activeTab === 'Archived' && !['rejected', 'accepted'].includes(app.status)) return false;
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.job.title.toLowerCase().includes(q) ||
        app.job.company.name.toLowerCase().includes(q)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'offer':
        return 'bg-green-500/20 text-green-400';
      case 'accepted':
        return 'bg-green-500/20 text-green-400';
      case 'interviewing':
        return 'bg-purple-500/20 text-purple-400';
      case 'reviewing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const getStatusLabel = (status: Application['status']) => {
      switch (status) {
      case 'offer': return 'Offer';
      case 'accepted': return 'Accepted';
      case 'interviewing': return 'Interview';
      case 'reviewing': return 'In Review';
      case 'pending': return 'Applied';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-white">My Applications Tracking</h1>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white relative">
                 <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"></div>
                 <span className="sr-only">Notifications</span>
                 {/* Icon handled by layout, but can duplicate if needed or leave out */}
              </button>
              <Link 
                href="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
               >
                <Briefcase className="w-4 h-4 mr-2" />
                Find New Jobs
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-gray-700 pb-1">
             <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar gap-6">
               {tabs.map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                     activeTab === tab
                       ? 'text-blue-400'
                       : 'text-gray-400 hover:text-gray-200'
                   }`}
                 >
                   {tab}
                   {activeTab === tab && (
                     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-t-full"></div>
                   )}
                 </button>
               ))}
             </div>
             
             <div className="w-full lg:w-72 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search applications..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
               />
             </div>
          </div>

          {/* Applications Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                    <th className="px-6 py-4 font-medium">Job Title</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Date Applied</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium text-sm">{app.job.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {app.job.job_type === 'full-time' ? 'Full-time' : app.job.job_type} • {app.job.is_remote ? 'Remote' : 'On-site'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {/* Fallback Icon for Company Logo */}
                          <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center mr-3 text-xs text-gray-300 font-bold">
                            {app.job.company.name.substring(0, 1)}
                          </div>
                          <span className="text-gray-300 text-sm">{app.job.company.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/jobs/${app.job.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
             <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
               <div>
                 Showing <span className="font-medium text-white">{filteredApplications.length}</span> of <span className="font-medium text-white">{allApplications.length}</span> applications
               </div>
               <div className="flex gap-2">
                 <button className="p-2 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white" disabled={currentPage === 1}>
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <button className="p-2 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white" disabled>
                   <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>

          {/* Bottom Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center">
               <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                 <Send className="w-6 h-6 text-blue-500" />
               </div>
               <div>
                 <p className="text-gray-400 text-sm font-medium">Total Applied</p>
                 <h3 className="text-2xl font-bold text-white">124</h3>
               </div>
            </div>
            
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center">
               <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                 <Users className="w-6 h-6 text-purple-500" />
               </div>
               <div>
                 <p className="text-gray-400 text-sm font-medium">Interviews Held</p>
                 <h3 className="text-2xl font-bold text-white">18</h3>
               </div>
            </div>
            
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center">
               <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                 <CheckCircle className="w-6 h-6 text-green-500" />
               </div>
               <div>
                 <p className="text-gray-400 text-sm font-medium">Job Offers</p>
                 <h3 className="text-2xl font-bold text-white">4</h3>
               </div>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
