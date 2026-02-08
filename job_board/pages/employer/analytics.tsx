
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { analyticsService } from '@/api/services';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal,
  Minus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['employer-analytics'],
    queryFn: () => analyticsService.getEmployerAnalytics(),
  });

  if (isLoading || !analytics) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const { summary, chart_data, category_data, top_jobs } = analytics;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Recruitment Insights</h1>
              <p className="text-gray-400">Performance tracking for active job boards.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-750 transition-colors">
                <Calendar className="w-4 h-4" />
                Oct 1, 2023 - Oct 31, 2023
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Job Views */}
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Job Views</p>
                 <span className="flex items-center text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   12%
                 </span>
               </div>
               <div className="flex items-end justify-between">
                 <h2 className="text-3xl font-bold text-white tracking-tight">{summary.total_job_views.value.toLocaleString()}</h2>
                 {/* Mini sparkline placeholder */}
                 <div className="w-16 h-8 flex items-center justify-center opacity-40">
                   <svg viewBox="0 0 100 40" className="w-full h-full stroke-green-500 stroke-[4] fill-none">
                     <path d="M0,35 Q20,30 40,35 T80,10 T100,20" />
                   </svg>
                 </div>
               </div>
            </div>

            {/* Applications */}
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 group">
               <div className="flex justify-between items-start mb-4">
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Applications Received</p>
                 <span className="flex items-center text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   5.2%
                 </span>
               </div>
               <div className="flex items-end justify-between">
                 <h2 className="text-3xl font-bold text-white tracking-tight">{summary.applications_received.value.toLocaleString()}</h2>
                 <div className="w-16 h-8 flex items-center justify-center opacity-40">
                    <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-500 stroke-[4] fill-none">
                      <path d="M0,30 Q30,10 60,35 T100,25" />
                    </svg>
                 </div>
               </div>
            </div>

            {/* Conversion */}
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 group">
               <div className="flex justify-between items-start mb-4">
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Conversion Rate</p>
                 <span className="flex items-center text-red-400 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded">
                   <TrendingDown className="w-3 h-3 mr-1" />
                   1.1%
                 </span>
               </div>
               <div className="flex items-end justify-between">
                 <h2 className="text-3xl font-bold text-white tracking-tight">{summary.conversion_rate.value}%</h2>
                 <div className="w-16 h-8 flex items-center justify-center opacity-40">
                    <svg viewBox="0 0 100 40" className="w-full h-full stroke-red-500 stroke-[4] fill-none">
                      <path d="M0,10 Q25,15 50,30 T100,35" />
                    </svg>
                 </div>
               </div>
            </div>

            {/* Time to Hire */}
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 group">
               <div className="flex justify-between items-start mb-4">
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Time-to-Hire</p>
                 <span className="flex items-center text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   -2 Days
                 </span>
               </div>
               <div className="flex items-end justify-between">
                 <h2 className="text-3xl font-bold text-white tracking-tight">{summary.avg_time_to_hire.value}d</h2>
                 <div className="w-16 h-8 flex items-center justify-center opacity-40">
                    <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-500 stroke-[4] fill-none">
                      <path d="M0,35 Q25,30 50,20 T100,5" />
                    </svg>
                 </div>
               </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Job Views vs Applications */}
            <div className="lg:col-span-3 bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 border-transparent bg-opacity-95">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-white">Job Views vs. Applications</h3>
                    <p className="text-xs text-gray-500 mt-1">Daily engagement over the last 30 days</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Applications</span>
                    </div>
                  </div>
               </div>

               <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chart_data}>
                     <defs>
                       <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                     <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                       dy={10}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="views" 
                       stroke="#2563eb" 
                       strokeWidth={4}
                       fillOpacity={1} 
                       fill="url(#colorViews)" 
                       dot={{ r: 4, strokeWidth: 2, fill: '#1a1c23' }}
                       activeDot={{ r: 6, strokeWidth: 0 }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="applications" 
                       stroke="#10b981" 
                       strokeWidth={4}
                       fillOpacity={1} 
                       fill="url(#colorApps)" 
                       dot={{ r: 4, strokeWidth: 2, fill: '#1a1c23' }}
                       activeDot={{ r: 6, strokeWidth: 0 }}
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Application Volume by Category */}
            <div className="lg:col-span-2 bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Application Volume by Job Category</h3>
                    <p className="text-xs text-gray-500 mt-1">Hiring activity breakdown across departments</p>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 w-full mt-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={category_data} margin={{ top: 20, right: 0, left: -40, bottom: 0 }}>
                     <XAxis 
                       dataKey="category" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={32}>
                       {category_data.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#374151'} fillOpacity={index === 0 ? 1 : 0.3} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Top Performing Jobs Table */}
          <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-gray-800/50">
                <h3 className="text-lg font-bold text-white">Top Performing Job Posts</h3>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700 hover:text-white transition-colors">
                  FILTER BY CONVERSION
                  <TrendingDown className="w-3 h-3" />
                </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50">
                      <th className="px-6 py-4">Job Title</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Views</th>
                      <th className="px-6 py-4 text-center">Applications</th>
                      <th className="px-6 py-4 text-center">Conv. Rate</th>
                      <th className="px-6 py-4 text-center">Trend</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800/30">
                   {top_jobs.map((job) => (
                     <tr key={job.id} className="hover:bg-gray-800/20 transition-colors group">
                       <td className="px-6 py-5">
                          <div>
                            <p className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{job.title}</p>
                            <p className="text-gray-500 text-xs mt-1 font-medium">Posted 12 days ago</p>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                         <span className="px-2 py-1 bg-gray-800 rounded font-bold text-[10px] text-gray-400 tracking-wider">
                            {job.department}
                         </span>
                       </td>
                       <td className="px-6 py-5">
                         <span className="text-white font-bold text-sm">{job.views.toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-5 text-center">
                         <span className="text-white font-bold text-sm">{job.applications}</span>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1.5">
                             <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-blue-500" 
                                 style={{ width: `${job.conversion_rate * 5}%` }}
                               ></div>
                             </div>
                             <span className="text-blue-500 font-bold text-[10px]">{job.conversion_rate}%</span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">
                            {job.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : job.trend === 'down' ? (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            ) : (
                              <Minus className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             <div className="p-4 bg-gray-800/10 flex items-center justify-between border-t border-gray-800/50">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Showing Top 4 Results</span>
                <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest">
                  View All Active Listings
                </button>
             </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
