// Landing Page - Homepage

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, 
  MapPin, 
  Code, 
  Palette, 
  TrendingUp, 
  ShoppingCart, 
  Headphones,
  Briefcase,
  ArrowRight,
  Bookmark,
  DollarSign
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?q=${searchQuery}&location=${location}`);
  };

  const categories = [
    { name: 'Development', icon: Code, color: 'bg-blue-500' },
    { name: 'Design', icon: Palette, color: 'bg-purple-500' },
    { name: 'Marketing', icon: TrendingUp, color: 'bg-orange-500' },
    { name: 'Sales', icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Support', icon: Headphones, color: 'bg-pink-500' },
  ];

  const latestJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $160k',
      tags: ['React', 'TypeScript'],
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'New York',
      type: 'Full-time',
      salary: '$90k - $120k',
      tags: ['Figma', 'UI/UX'],
    },
    {
      id: 3,
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'San Francisco',
      type: 'Full-time',
      salary: '$80k - $110k',
      tags: ['SEO', 'Content'],
    },
    {
      id: 4,
      title: 'Backend Engineer',
      company: 'DataSystems',
      location: 'Remote',
      type: 'Contract',
      salary: '$110k - $140k',
      tags: ['Node.js', 'MongoDB'],
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      location: 'Los Angeles',
      type: 'Part-time',
      salary: '$60k - $90k',
      tags: ['Sketch', 'Prototyping'],
    },
    {
      id: 6,
      title: 'Customer Success Lead',
      company: 'SupportPro',
      location: 'Chicago',
      type: 'Full-time',
      salary: '$70k - $95k',
      tags: ['CRM', 'Support'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">JobFinder</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
                Find Jobs
              </Link>
              <Link href="/post-job" className="text-gray-300 hover:text-white transition-colors">
                Post a Job
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find your dream job with{' '}
            <span className="text-blue-500">US</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-gray-800 p-2 rounded-lg">
              <div className="flex-1 flex items-center px-4 bg-gray-700 rounded-lg">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none py-3"
                />
              </div>
              <div className="flex-1 flex items-center px-4 bg-gray-700 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none py-3"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Popular: UI Designer, UX Researcher, Android, Admin
          </p>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Trending Categories</h2>
            <Link href="/categories" className="text-blue-500 hover:text-blue-400 flex items-center">
              View all categories
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/jobs?category=${category.name.toLowerCase()}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all group"
              >
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Opportunities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Opportunities</h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                All
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-700">
                Full-time
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-700">
                Part-time
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-700">
                Remote
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-blue-500 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{job.company}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-500">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs">{job.type}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-green-400 font-semibold flex items-center">
                    <DollarSign className="w-4 h-4" />
                    {job.salary.split(' - ')[0].replace('$', '')}
                  </span>
                </div>

                <button className="w-full mt-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/jobs"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View More Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to hire your next star?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Post a job today and reach thousands of qualified candidates in the tech industry. It's fast, easy, and effective.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/post-job"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Post a Job for Free
                </Link>
                <Link
                  href="/employer/register"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  Create Employer Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">JobFinder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your go-to platform for tech careers and professional growth, connecting talent with opportunity.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Candidates</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/categories" className="hover:text-white">Browse Categories</Link></li>
                <li><Link href="/candidate-dashboard" className="hover:text-white">Candidate Dashboard</Link></li>
                <li><Link href="/saved-jobs" className="hover:text-white">Saved Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/post-job" className="hover:text-white">Post a Job</Link></li>
                <li><Link href="/browse-candidates" className="hover:text-white">Browse Candidates</Link></li>
                <li><Link href="/employer-dashboard" className="hover:text-white">Employer Dashboard</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 JobFinder. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Powered by <span className="text-blue-500 font-semibold">RapidAPI</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
