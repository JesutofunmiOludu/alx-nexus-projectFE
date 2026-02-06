// Saved Jobs Page

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Input } from '@/components/ui/Input';
import { mockJobs } from '@/lib/mockData';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Heart,
  Code,
  Palette,
  Server,
  Smartphone,
  Cloud
} from 'lucide-react';
import { Job } from '@/types';

// Extended mock data to match the visual variety in the mockup
const savedJobsData = [
  {
    ...mockJobs[0],
    companyName: 'InnovateX Studio',
    logoBg: 'bg-indigo-600/20',
    logoColor: 'text-indigo-400',
    icon: Code,
    savedTime: 'SAVED 2D AGO',
    title: 'Senior Product Designer',
    location: 'Remote, US',
    salary: '$120k - $160k'
  },
  {
    ...mockJobs[1],
    companyName: 'Pixel Labs',
    logoBg: 'bg-purple-600/20',
    logoColor: 'text-purple-400',
    icon: Palette,
    savedTime: 'SAVED 5D AGO',
    title: 'UX Researcher',
    location: 'London, UK',
    salary: '$90k - $130k'
  },
  {
    ...mockJobs[2],
    companyName: 'Cloud Systems',
    logoBg: 'bg-orange-600/20',
    logoColor: 'text-orange-400',
    icon: Server,
    savedTime: 'CLOSING SOON',
    title: 'Full Stack Lead',
    location: 'Remote',
    salary: '$150k - $200k'
  },
  {
    ...mockJobs[3],
    companyName: 'DataCore',
    logoBg: 'bg-green-600/20',
    logoColor: 'text-green-400',
    icon: DatabaseIcon,
    savedTime: 'SAVED 1W AGO',
    title: 'Backend Engineer',
    location: 'New York, NY',
    salary: '$110k - $150k'
  },
  {
    ...mockJobs[4],
    companyName: 'SkyScale',
    logoBg: 'bg-blue-600/20',
    logoColor: 'text-blue-400',
    icon: Cloud,
    savedTime: 'SAVED 2W AGO',
    title: 'Cloud Architect',
    location: 'Hybrid, SF',
    salary: '$170k - $220k'
  },
  {
    ...mockJobs[5],
    companyName: 'Swift Flow',
    logoBg: 'bg-pink-600/20',
    logoColor: 'text-pink-400',
    icon: Smartphone,
    savedTime: 'SAVED 1MO AGO',
    title: 'Mobile Engineer',
    location: 'Austin, TX',
    salary: '$130k - $165k'
  }
];

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5" />
    </svg>
  )
}

export default function SavedJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = savedJobsData.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
            <Link 
              href="/jobs"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Jobs
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[180px]">
              <option>Sort by Date Saved</option>
              <option>Sort by Salary</option>
              <option>Sort by Deadline</option>
            </select>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors group relative"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${job.logoBg} rounded-lg flex items-center justify-center`}>
                    <job.icon className={`w-6 h-6 ${job.logoColor}`} />
                  </div>
                  <button className="text-red-500 hover:text-red-400 transition-colors">
                    <Heart className="w-6 h-6 fill-current" />
                  </button>
                </div>

                {/* Job Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {job.companyName}
                  </p>
                </div>

                {/* Details */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {job.location}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/jobs/${job.id}`}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Apply Now
                  </Link>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {job.savedTime}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium">
              Load More Saved Jobs
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
