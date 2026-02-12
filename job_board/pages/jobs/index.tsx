// Jobs Search Page - Dark theme with sidebar filters

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import { Loading } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Briefcase, Bell, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobSearchParams } from '@/types';

export default function JobsPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    q: (router.query.q as string) || '',
    location: (router.query.location as string) || '',
    page: 1,
    page_size: 10,
  });

  const { data, isLoading, error } = useJobs(searchParams);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  
  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(['full-time']);
  const [salaryRange, setSalaryRange] = useState([40, 200]);
  const [selectedExperience, setSelectedExperience] = useState('mid');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const handleSearch = () => {
    setSearchParams(prev => ({
      ...prev,
      q: searchParams.q,
      location: searchParams.location,
      job_type: selectedJobTypes.length > 0 ? selectedJobTypes[0] : undefined,
      experience_level: selectedExperience || undefined,
      is_remote: remoteOnly || undefined,
      page: 1,
    }));
  };

  // Immediate search on filter changes
  const onFilterChange = (updates: Partial<{
    jobTypes: string[];
    experience: string;
    remote: boolean;
  }>) => {
    const newJobTypes = updates.jobTypes !== undefined ? updates.jobTypes : selectedJobTypes;
    const newExp = updates.experience !== undefined ? updates.experience : selectedExperience;
    const newRemote = updates.remote !== undefined ? updates.remote : remoteOnly;

    setSearchParams(prev => ({
      ...prev,
      job_type: newJobTypes.length > 0 ? newJobTypes[0] : undefined,
      experience_level: newExp || undefined,
      is_remote: newRemote || undefined,
      page: 1,
    }));
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleJobType = (type: string) => {
    const newTypes = selectedJobTypes.includes(type) 
      ? selectedJobTypes.filter((t) => t !== type) 
      : [...selectedJobTypes, type];
    setSelectedJobTypes(newTypes);
    onFilterChange({ jobTypes: newTypes });
  };

  const resetFilters = () => {
    setSelectedJobTypes([]);
    setSalaryRange([40, 200]);
    setSelectedExperience('');
    setRemoteOnly(false);
    setSearchParams({ q: '', location: '', page: 1, page_size: 10 });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">JobFinder</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Senior Frontend Engineer"
                    value={searchParams.q}
                    onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Remote"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-40 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">API Usage</span>
                <span className="ml-2 text-blue-400 font-semibold">45%</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Reset all
                </button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">JOB TYPE</h3>
                <div className="space-y-2">
                  {[
                    { value: 'full-time', label: 'Full-time', count: 120 },
                    { value: 'contract', label: 'Contract', count: 45 },
                    { value: 'part-time', label: 'Part-time', count: 12 },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedJobTypes.includes(type.value)}
                          onChange={() => toggleJobType(type.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300 group-hover:text-white">
                          {type.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{type.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">SALARY RANGE</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={salaryRange[0]}
                    onChange={(e) => setSalaryRange([parseInt(e.target.value), salaryRange[1]])}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={salaryRange[1]}
                    onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 bg-gray-700 rounded text-sm text-gray-300">
                      ${salaryRange[0]}k - ${salaryRange[1]}k
                    </span>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">EXPERIENCE</h3>
                <div className="space-y-2">
                  { [
                    { value: 'entry', label: 'Entry Level' },
                    { value: 'mid', label: 'Mid Level' },
                    { value: 'senior', label: 'Senior Level' },
                    { value: 'lead', label: 'Lead / Manager' },
                  ].map((exp) => (
                    <label key={exp.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="experience"
                        checked={selectedExperience === exp.value}
                        onChange={() => {
                          setSelectedExperience(exp.value);
                          onFilterChange({ experience: exp.value });
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-300 group-hover:text-white">
                        {exp.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Only */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-300">Remote Only</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => {
                        setRemoteOnly(e.target.checked);
                        onFilterChange({ remote: e.target.checked });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Job Results */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Search Results</h1>
                <p className="text-gray-400">
                  ({data?.count || 142} found)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>

            {/* Job List */}
            {isLoading ? (
              <Loading text="Searching for jobs..." />
            ) : error ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-red-400">Error loading jobs. Please try again.</p>
              </div>
            ) : data?.results && data.results.length > 0 ? (
              <div className="space-y-4">
                {data.results.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Company Icon */}
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>

                        {/* Job Info */}
                        <div className="flex-1">
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors mb-1">
                              {job.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-400 mb-3">
                            {job.company.name} • {job.location}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills_required.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
                              {job.is_remote ? 'Remote' : 'On-site'}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {job.description}
                          </p>

                          {/* Footer */}
                          <p className="text-xs text-gray-500 mt-3">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex flex-col items-end space-y-3 ml-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-400">
                            {job.salary_min && job.salary_max
                              ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`
                              : 'Competitive'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              savedJobs.includes(job.id)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                          </button>
                          <Link href={`/jobs/${job.id}`}>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                              Apply Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 mb-4">No jobs found matching your criteria</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {data && data.count > searchParams.page_size! && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(searchParams.page! - 1)}
                  disabled={!data.previous}
                  className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      searchParams.page === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-gray-500">...</span>
                <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700">
                  12
                </button>
                <button
                  onClick={() => handlePageChange(searchParams.page! + 1)}
                  disabled={!data.next}
                  className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
