
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { jobService } from '@/api/services';
import { Job } from '@/types';
import { 
  Search, 
  MapPin, 
  Users, 
  Eye, 
  MoreVertical, 
  Plus, 
  Briefcase 
} from 'lucide-react';
import Link from 'next/link';

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobService.getMyJobs(),
  });

  const jobs = jobsData?.results || [];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
              <p className="text-gray-400">Manage your job postings and track applications</p>
            </div>
            <Link href="/employer/jobs/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-900/20 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="open">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Jobs List */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
            {isLoading ? (
               <div className="p-12 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
               </div>
            ) : filteredJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Applicants</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-750/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/employer/jobs/${job.id}/applications`} className="group-hover:text-blue-400 transition-colors">
                            <h3 className="font-semibold text-white">{job.title}</h3>
                            <div className="text-sm text-gray-400 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location} • {job.job_type}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/employer/jobs/${job.id}/applications`} className="flex items-center text-gray-300 hover:text-white group-hover:text-blue-400">
                            <div className="bg-gray-700 p-1.5 rounded mr-2">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{job.applications_count}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-400">
                            <Eye className="w-4 h-4 mr-2" />
                            {job.views_count}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                            job.status === 'open' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : job.status === 'closed'
                              ? 'bg-gray-700 text-gray-400 border-gray-600'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/employer/jobs/${job.id}/applications`}>
                              <button className="text-sm text-blue-400 hover:text-blue-300 mr-2">
                                View Applicants
                              </button>
                            </Link>
                            <button className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 px-6">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery ? "Try adjusting your search filters" : "Get started by creating your first job posting"}
                </p>
                <Link href="/employer/jobs/new">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Post a Job
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
