
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Eye, 
  FileText, 
  PieChart, 
  MoreHorizontal, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

export default function EmployerDashboard() {
  const stats = [
    {
      title: 'Total Job Views',
      value: '1,240',
      change: '+12%',
      trend: 'up',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Total Applications',
      value: '85',
      change: '+5%',
      trend: 'up',
      icon: FileText,
      color: 'emerald'
    },
    {
      title: 'Conversion Rate',
      value: '6.8%',
      change: '-0.4%',
      trend: 'down',
      icon: PieChart, // Fallback for donut chart icon
      color: 'purple'
    }
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      type: 'Remote • Full-time',
      posted: '2 days ago',
      applicants: 12,
      applicantAvatars: [
        'https://ui-avatars.com/api/?name=Sarah+Smith&background=random',
        'https://ui-avatars.com/api/?name=John+Doe&background=random', 
        'https://ui-avatars.com/api/?name=Jane+Doe&background=random'
      ],
      status: 'Active',
      statusColor: 'green'
    },
    {
      id: 2,
      title: 'Product Designer',
      type: 'New York • Hybrid',
      posted: '5 days ago',
      applicants: 8,
      applicantAvatars: [
        'https://ui-avatars.com/api/?name=Mike+Ross&background=random',
        'https://ui-avatars.com/api/?name=Rachel+Green&background=random'
      ],
      status: 'Active',
      statusColor: 'green'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      type: 'London • On-site',
      posted: '1 week ago',
      applicants: 23,
      applicantAvatars: [
        'https://ui-avatars.com/api/?name=Alice+Wonder&background=random',
        'https://ui-avatars.com/api/?name=Bob+Builder&background=random',
        'https://ui-avatars.com/api/?name=Charlie+Brown&background=random'
      ],
      status: 'Reviewing',
      statusColor: 'yellow'
    },
    {
      id: 4,
      title: 'Customer Support Lead',
      type: 'Remote • Full-time',
      posted: '2 weeks ago',
      applicants: 45,
      applicantAvatars: [
        'https://ui-avatars.com/api/?name=David+Copper&background=random',
        'https://ui-avatars.com/api/?name=Eva+Long&background=random'
      ],
      status: 'Closed',
      statusColor: 'gray'
    },
  ];

  const getStatusBadge = (status: string, color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500/10 text-green-400',
      yellow: 'bg-yellow-500/10 text-yellow-400',
      gray: 'bg-gray-500/10 text-gray-400',
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit ${colors[color]}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current`}></span>
        {status}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of your recruitment performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <div className="flex items-end mt-2 gap-3">
                      <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded flex items-center mb-1 ${
                        stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">vs. last week</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                </div>
                {/* Background decoration */}
                 <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`}></div>
              </div>
            ))}
          </div>

          {/* Recent Job Postings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Recent Job Postings</h2>
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input 
                     type="text" 
                     placeholder="Search jobs..." 
                     className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
                   />
                 </div>
                 <button className="p-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                   <Filter className="w-4 h-4" />
                 </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                      <th className="px-6 py-4 font-medium">Job Title</th>
                      <th className="px-6 py-4 font-medium">Date Posted</th>
                      <th className="px-6 py-4 font-medium">Applicants</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium text-sm">{job.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{job.type}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {job.posted}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                             <div className="flex -space-x-2">
                               {job.applicantAvatars.slice(0, 3).map((avatar, i) => (
                                 <img key={i} src={avatar} alt="Applicant" className="w-6 h-6 rounded-full border-2 border-gray-800" />
                               ))}
                             </div>
                             <span className="text-gray-400 text-xs">+{job.applicants - job.applicantAvatars.length > 0 ? job.applicants - 3 : 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(job.status, job.statusColor)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Footer */}
               <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                 <div>
                   Showing <span className="font-medium text-white">1-4</span> of <span className="font-medium text-white">12</span> jobs
                 </div>
                 <div className="flex gap-2">
                   <button className="text-gray-400 hover:text-white px-2 py-1">&lt;</button>
                   <button className="text-gray-400 hover:text-white px-2 py-1">&gt;</button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
