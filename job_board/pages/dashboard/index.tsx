// Dashboard Page

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Send,
  Bookmark,
  Eye,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  Settings,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { mockJobs } from '@/lib/mockData';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Active Applications',
      value: '12',
      change: '+2 this week',
      icon: Send,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Saved Jobs',
      value: '48',
      change: 'Across 4 categories',
      icon: Bookmark,
      color: 'orange',
      trend: 'neutral'
    },
    {
      title: 'Profile Views',
      value: '156',
      change: '+15%',
      icon: Eye,
      color: 'purple',
      trend: 'up'
    },
    {
      title: 'Interviews',
      value: '3',
      change: 'Next: Tomorrow',
      icon: Calendar,
      color: 'green',
      trend: 'up'
    },
  ];

  const recentApps = [
    {
      position: 'Senior UI Engineer',
      company: 'Designify Inc.',
      date: 'Oct 24, 2023',
      status: 'In Review',
      statusColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      position: 'React Developer',
      company: 'StreamLine',
      date: 'Oct 22, 2023',
      status: 'Interview Scheduled',
      statusColor: 'bg-purple-500/20 text-purple-400'
    },
    {
      position: 'Full Stack Lead',
      company: 'TechCorp',
      date: 'Oct 20, 2023',
      status: 'Offered',
      statusColor: 'bg-green-500/20 text-green-400'
    },
    {
      position: 'Frontend Architect',
      company: 'Cloud Systems',
      date: 'Oct 18, 2023',
      status: 'Applied',
      statusColor: 'bg-gray-500/20 text-gray-400'
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.title} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <div className="flex items-center text-xs">
                    <span className={`${stat.trend === 'up' ? 'text-green-400' : 'text-gray-400'} flex items-center`}>
                      {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Recent Applications</h3>
                <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400 text-xs uppercase border-b border-gray-700">
                      <th className="px-6 py-4 font-medium">Job Position</th>
                      <th className="px-6 py-4 font-medium">Company</th>
                      <th className="px-6 py-4 font-medium">Date Applied</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentApps.map((app, index) => (
                      <tr key={index} className="hover:bg-gray-750">
                        <td className="px-6 py-4 text-white font-medium">{app.position}</td>
                        <td className="px-6 py-4 text-gray-300">{app.company}</td>
                        <td className="px-6 py-4 text-gray-400">{app.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Recommended Jobs */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Recommended</h3>
                <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              
              <div className="space-y-4">
                {mockJobs.slice(0, 2).map((job) => (
                  <div key={job.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{job.title}</h4>
                      <p className="text-gray-400 text-xs mb-2">{job.company.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                          {job.salary_min && job.salary_max 
                            ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k` 
                            : 'Salary Competitive'}
                        </span>
                        <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                          {job.is_remote ? 'Remote' : 'On-site'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm hover:bg-gray-700 transition-colors">
                Discover More
              </button>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Upcoming Tasks</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Complete Portfolio</p>
                    <p className="text-gray-500 text-xs">Due in 2 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-md"></div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Interview with TechCorp</p>
                    <p className="text-gray-500 text-xs">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-md"></div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Follow up with Designify</p>
                    <p className="text-gray-500 text-xs">Oct 28, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm">Profile Strength</p>
                  <h3 className="text-3xl font-bold">75%</h3>
                </div>
                <ArrowUpRight className="w-6 h-6 text-blue-200" />
              </div>
              
              <div className="w-full bg-blue-900/40 rounded-full h-2 mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <p className="text-sm text-blue-100 mb-6">
                Add your experience to increase profile visibility by 40%.
              </p>
              
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                Improve Profile
              </button>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
