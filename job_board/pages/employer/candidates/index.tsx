
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileService } from '@/api/services';
import { FreelancerProfile } from '@/types';
import { 
  Search, 
  MapPin, 
  Filter, 
  ChevronDown,
  Bookmark,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function CandidateSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters State
  const [filters, setFilters] = useState({
    skills: '',
    experience: 'all',
    location: 'all',
    salary: 'all'
  });

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['candidates', searchQuery],
    queryFn: () => profileService.searchProfiles({ q: searchQuery }),
  });

  const candidates = candidatesData?.results || [];
  const totalCount = candidatesData?.count || 0;

  // Filter Logic (Mocked on client side as API is mocked)
  const filteredCandidates = candidates.filter(candidate => {
    // Search
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = `${candidate.user.first_name} ${candidate.user.last_name}`.toLowerCase().includes(searchLower);
    const titleMatch = candidate.title?.toLowerCase().includes(searchLower);
    const bioMatch = candidate.bio?.toLowerCase().includes(searchLower);
    if (searchQuery && !nameMatch && !titleMatch && !bioMatch) return false;

    // Filters
    // Note: Ideally these matches would be more robust or handled by backend
    if (filters.skills !== '' && !candidate.skills.some(s => s.toLowerCase().includes(filters.skills.toLowerCase()))) return false;
    // Experience, Location, Salary logic would go here if we had full mock data support for them in this specific filter implementation
    
    return true;
  });

  const getBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return (
          <div className="flex items-center text-green-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Available Now
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center text-gray-400 text-xs font-medium">
             <Clock className="w-3.5 h-3.5 mr-1" />
             Active 2h ago
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center text-blue-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified Expert
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Candidate Search Directory</h1>
              <p className="text-gray-400">Discover and recruit top talent for your open roles.</p>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium border border-gray-700 flex items-center transition-colors">
              <Bookmark className="w-4 h-4 mr-2" />
              View Shortlist
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl">
             {/* Search Input */}
             <div className="relative mb-4">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search by name, role, or keyword (e.g. Senior Frontend Engineer)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm"
               />
             </div>

             {/* Filters Row */}
             <div className="flex flex-col md:flex-row gap-3 items-center">
                {/* Mock Dropdowns */}
                <button className="w-full md:w-auto px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center justify-between hover:border-gray-500 transition-colors">
                  Skills
                  <ChevronDown className="w-4 h-4 ml-8 text-gray-500" />
                </button>
                <button className="w-full md:w-auto px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center justify-between hover:border-gray-500 transition-colors">
                  Experience Level
                  <ChevronDown className="w-4 h-4 ml-8 text-gray-500" />
                </button>
                <button className="w-full md:w-auto px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center justify-between hover:border-gray-500 transition-colors">
                  Location
                  <ChevronDown className="w-4 h-4 ml-8 text-gray-500" />
                </button>
                <button className="w-full md:w-auto px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center justify-between hover:border-gray-500 transition-colors">
                  Expected Salary
                  <ChevronDown className="w-4 h-4 ml-8 text-gray-500" />
                </button>

                <div className="flex-1"></div>
                
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap"
                >
                  Clear all filters
                </button>
             </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400">
              Showing <span className="font-bold text-white">{totalCount > 0 ? totalCount.toLocaleString() : filteredCandidates.length}</span> qualified candidates
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Sort by:</span>
              <button className="text-white font-medium flex items-center hover:text-blue-400 transition-colors">
                Relevance
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               // Loading Skeletons
               [...Array(6)].map((_, i) => (
                 <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 h-80 animate-pulse"></div>
               ))
            ) : filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 group flex flex-col relative overflow-hidden">
                  
                  {/* Bookmark Icon */}
                  <button className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>

                  <div className="flex items-start gap-4 mb-4">
                     {/* Avatar */}
                     <div className="w-14 h-14 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden">
                       <img 
                         src={`https://ui-avatars.com/api/?name=${candidate.user.first_name}+${candidate.user.last_name}&background=random&size=128`} 
                         alt={candidate.user.first_name}
                         className="w-full h-full object-cover"
                       />
                     </div>
                     
                     {/* Name & Title */}
                     <div>
                       <h3 className="font-bold text-white text-lg leading-tight">
                         {candidate.user.first_name} {candidate.user.last_name}
                       </h3>
                       <p className="text-gray-400 text-sm mt-0.5 mb-1.5">{candidate.title || candidate.bio?.split('•')[0]}</p>
                       {getBadge(candidate.verification_status || 'available')}
                     </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase rounded tracking-wide">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-[10px] font-bold rounded">
                        +{candidate.skills.length - 3} MORE
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {candidate.bio}
                  </p>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link href={`/profile/${candidate.id}`}>
                      <button className="w-full py-2 rounded-lg border border-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                        View Profile
                      </button>
                    </Link>
                    <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                      Invite to Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                 <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <Search className="w-8 h-8 text-gray-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No candidates found</h3>
                 <p className="text-gray-400">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 pt-8">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white text-gray-400 font-medium transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white text-gray-400 font-medium transition-colors">3</button>
            <span className="text-gray-600">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white text-gray-400 font-medium transition-colors">12</button>

            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
