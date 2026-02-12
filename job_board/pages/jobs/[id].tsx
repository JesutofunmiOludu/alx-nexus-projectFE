import { useRouter } from 'next/router';
import Link from 'next/link';
import { useJob } from '@/hooks/useJobs';
import { Loading } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { JobApplicationModal } from '@/components/jobs/JobApplicationModal';
import { useAppSelector } from '@/store';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bell,
  Bookmark,
  Share2,
  Link2,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  // Ensure id is a string before passing to useJob
  const jobId = typeof id === 'string' ? id : '';
  const { data: job, isLoading, error } = useJob(jobId);
  
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      const returnUrl = router.asPath;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setShowApplicationModal(true);
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      router.push('/login');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleShare = (method: 'link' | 'email' | 'twitter') => {
    const url = window.location.href;
    if (method === 'link') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else if (method === 'email') {
      window.location.href = `mailto:?subject=Check out this job&body=${url}`;
    } else if (method === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=Check out this job!`);
    }
    setShowShareModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading text="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading job details</p>
          <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

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

            {/* Back to Search */}
            <Link
              href="/jobs"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Link>

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                          HOT JOB
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.company.name}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location} {job.is_remote && '(Remote)'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 border-l-4 border-blue-500 pl-3">
                About the Role
              </h2>
              <div 
                className="text-gray-300 space-y-4 prose prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              <p className="text-gray-300 italic border-t border-gray-700 pt-4">
                As a senior member of the team, you&apos;ll be expected to provide technical leadership, mentor
                junior developers, and contribute to the evolution of our frontend architecture and best
                practices.
              </p>
            </div>

            {/* Responsibilities */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 border-l-4 border-blue-500 pl-3">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {[
                  'Develop and maintain responsive, high-performance web applications using React and TypeScript.',
                  'Collaborate with UX/UI designers to ensure technical feasibility and pixel-perfect implementation.',
                  'Architect scalable frontend systems and shared component libraries.',
                  'Optimize application performance for maximum speed and scalability.',
                  'Conduct code reviews and provide constructive feedback to fellow engineers.',
                  'Participate in the full software development lifecycle, from planning to deployment.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 border-l-4 border-blue-500 pl-3">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.skills_required.map((skill, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      {index === 0 && `5+ years of experience in professional frontend web development.`}
                      {index === 1 && `Deep expertise in ${skill} and its core principles.`}
                      {index === 2 && `Proficiency in ${skill} and modern JavaScript (ES6+).`}
                      {index > 2 && `Experience with ${skill}.`}
                    </span>
                  </li>
                ))}
                <li className="flex items-start text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Solid understanding of CSS3, including preprocessors and utility-first frameworks like
                    Tailwind CSS.
                  </span>
                </li>
                <li className="flex items-start text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Familiarity with RESTful APIs and modern frontend build pipelines (Webpack, Vite).
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Job Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Job Summary</h2>

              {/* Salary Range */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Salary Range</p>
                  <p className="text-white font-semibold">
                    {job.salary_min && job.salary_max
                      ? `$${(job.salary_min / 1000).toFixed(0)},000 - $${(job.salary_max / 1000).toFixed(0)},000 / yr`
                      : 'Competitive Salary'}
                  </p>
                </div>
              </div>

              {/* Job Type */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Job Type</p>
                  <p className="text-white font-semibold capitalize">{job.job_type}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Experience</p>
                  <p className="text-white font-semibold">Senior (5+ Years)</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Location</p>
                  <p className="text-white font-semibold">{job.is_remote ? 'Remote (USA)' : job.location}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <p className="text-xs text-gray-400 uppercase mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyClick}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <Share2 className="w-4 h-4" />
              </button>

              {/* Save Job */}
              <button
                onClick={handleSaveJob}
                className={`w-full py-3 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 ${
                  isSaved
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              {/* Share Section */}
              <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                <h3 className="text-white font-semibold mb-2">Share this job</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Know someone who would be a perfect fit? Share the link!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare('link')}
                    className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy Link"
                  >
                    <Link2 className="w-5 h-5 text-gray-300 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Share via Email"
                  >
                    <Mail className="w-5 h-5 text-gray-300 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Share on Twitter"
                  >
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {job && (
        <JobApplicationModal
          job={job}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </div>
  );
}
