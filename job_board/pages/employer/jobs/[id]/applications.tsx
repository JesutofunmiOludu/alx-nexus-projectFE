
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { jobService, applicationService } from '@/api/services';
import type { Application } from '@/types';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Users,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function JobApplicationsPage() {
  const router = useRouter();
  const { id } = router.query;
  const jobId = typeof id === 'string' ? id : '';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Job Details
  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobService.getJob(jobId),
    enabled: !!jobId,
  });

  // Fetch Applications
  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => applicationService.getJobApplications(jobId),
    enabled: !!jobId,
  });

  const applications = applicationsData?.results || [];

  // Derived Stats
  const totalApplicants = applications.length;
  const newApplicants = applications.filter(a => a.status === 'pending').length;
  const interviewing = applications.filter(a => a.status === 'interviewing').length;
  const hired = applications.filter(a => a.status === 'accepted').length;

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.freelancer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.freelancer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.freelancer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Mock Match Score Generator (Deterministic based on ID)
  const getMatchScore = (id: string) => {
    const score = 70 + (id.charCodeAt(0) % 30);
    return Math.min(score, 99);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'reviewing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'interviewing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'offer': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-700 text-gray-400 border-gray-600';
    }
  };

  if (jobLoading || appsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
          <Link href="/employer/dashboard" className="text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link 
                href="/employer/dashboard"
                className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="text-sm text-gray-400">
                <Link href="/employer/dashboard" className="hover:text-blue-400">My Jobs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-200">{job.title}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {job.location} ({job.is_remote ? 'Remote' : 'On-site'})
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                 <Link href={`/employer/jobs/${jobId}/edit`}>
                   <button className="px-4 py-2 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/10 font-medium transition-colors">
                     Edit Job
                   </button>
                 </Link>
                 <Link href={`/jobs/${jobId}`}>
                   <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                     View Listing
                   </button>
                 </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{totalApplicants}</h3>
              <p className="text-gray-400 text-sm">Total Applicants</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                 <div className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercae">New</div>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{newApplicants}</h3>
              <p className="text-gray-400 text-sm">Unreviewed candidates</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{interviewing}</h3>
              <p className="text-gray-400 text-sm">Interviewing</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{hired}</h3>
              <p className="text-gray-400 text-sm">Hired</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by name, email or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Statuses</option>
                <option value="pending">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer Sent</option>
                <option value="accepted">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Match Score</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-750/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/employer/applications/${app.id}`} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {app.freelancer.first_name[0]}{app.freelancer.last_name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {app.freelancer.first_name} {app.freelancer.last_name}
                              </p>
                              <p className="text-sm text-gray-400">{app.freelancer.email}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full max-w-[100px] h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${getMatchScore(app.id)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-400">{getMatchScore(app.id)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">
                            {new Date(app.applied_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(app.status)} capitalize`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/employer/applications/${app.id}`}>
                            <button className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'No applicants match your filters.' 
                          : 'No applications received yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Mockup */}
            <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Showing <span className="text-white font-medium">{filteredApplications.length}</span> of <span className="text-white font-medium">{totalApplicants}</span> results
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-700 rounded text-gray-400 hover:bg-gray-800 disabled:opacity-50" disabled>Previous</button>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm mb-0">1</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-700 text-gray-400 hover:bg-gray-800 rounded text-sm mb-0">2</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-700 text-gray-400 hover:bg-gray-800 rounded text-sm mb-0">3</button>
                </div>
                <button className="px-3 py-1 border border-gray-700 rounded text-gray-400 hover:bg-gray-800">Next</button>
              </div>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Simple MapPin Icon component since it was missed in imports above somehow or just good measure
function MapPin({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
