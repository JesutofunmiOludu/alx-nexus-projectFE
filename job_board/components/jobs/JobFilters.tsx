// Job Filters Component - Search and filter jobs

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Sliders } from 'lucide-react';
import { JobSearchParams } from '@/types';

interface JobFiltersProps {
  onSearch: (params: JobSearchParams) => void;
  initialParams?: JobSearchParams;
}

export function JobFilters({ onSearch, initialParams = {} }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [location, setLocation] = useState(initialParams.location || '');
  const [jobType, setJobType] = useState(initialParams.job_type || '');
  const [experienceLevel, setExperienceLevel] = useState(initialParams.experience_level || '');
  const [isRemote, setIsRemote] = useState(initialParams.is_remote || false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      q: searchQuery,
      location,
      job_type: jobType || undefined,
      experience_level: experienceLevel || undefined,
      is_remote: isRemote || undefined,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setIsRemote(false);
    onSearch({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Job title, keywords, or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-400" />}
          />
          <Input
            placeholder="City, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="w-5 h-5 text-gray-400" />}
          />
        </div>

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Sliders className="w-4 h-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} advanced filters
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote only</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search Jobs
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
