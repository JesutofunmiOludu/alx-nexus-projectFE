
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileService } from '@/api/services';
import { 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Award,
  ChevronLeft,
  ChevronRight,
  Mail,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function PublicProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const userId = typeof id === 'string' ? id : '';

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <button 
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const getBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return (
          <div className="flex items-center text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Available Now
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center text-gray-400 text-sm font-medium bg-gray-500/10 px-3 py-1 rounded-full border border-gray-500/20">
             <Clock className="w-4 h-4 mr-1.5" />
             Active 2h ago
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center text-blue-400 text-sm font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
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
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
          
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Candidates
          </button>

          {/* Profile Header Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-indigo-900 via-gray-900 to-blue-900"></div>
            
            <div className="px-8 pb-8 relative">
              {/* Avatar */}
              <div className="absolute -top-20 left-8">
                <div className="w-32 h-32 rounded-2xl bg-gray-900 border-4 border-gray-800 overflow-hidden shadow-2xl">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${profile.user.first_name}+${profile.user.last_name}&background=random&size=256`} 
                    alt={profile.user.first_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {profile.user.first_name} {profile.user.last_name}
                  </h1>
                  <p className="text-xl text-gray-300 font-medium mb-3">{profile.title || 'Freelancer'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {profile.location || 'Remote'}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1.5" />
                      {profile.user.email}
                    </div>
                    {profile.portfolio_url && (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                        <Globe className="w-4 h-4 mr-1.5" />
                        Portfolio
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[200px]">
                   <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                     <span className="text-gray-400 text-sm">Hourly Rate</span>
                     <span className="text-white font-bold text-lg">${profile.hourly_rate}/hr</span>
                   </div>
                   <div className="flex gap-2">
                     <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                       Invite to Apply
                     </button>
                     <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors">
                        <Download className="w-5 h-5" />
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: About & Experience */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {profile.bio || 'This candidate hasn\'t provided a bio yet.'}
                </p>
              </section>

              {/* Experience */}
              <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Work Experience</h2>
                <div className="space-y-8">
                  {profile.experience && profile.experience.length > 0 ? (
                    profile.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                            <Briefcase className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>
                        <div className="flex-1 pb-8 border-b border-gray-700 last:border-0">
                          <h3 className="text-white font-bold text-lg">{exp.title}</h3>
                          <p className="text-blue-400 font-medium">{exp.company}</p>
                          <div className="flex items-center text-gray-500 text-sm mt-1 mb-3">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No experience listed.
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Skills & Social */}
            <div className="space-y-8">
              {/* Skills */}
              <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4">Core Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-gray-900 text-blue-400 text-xs font-bold uppercase rounded-lg border border-gray-700 tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education && profile.education.length > 0 ? (
                    profile.education.map((edu, i) => (
                      <div key={i} className="flex gap-3">
                        <GraduationCap className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-white font-medium text-sm">{edu.degree}</h3>
                          <p className="text-gray-400 text-xs">{edu.institution}</p>
                          <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-wider">
                            {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No education listed.</p>
                  )}
                </div>
              </section>

              {/* Social Links */}
              <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4">Social Profiles</h2>
                <div className="space-y-3">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-750 transition-colors group">
                      <div className="flex items-center text-gray-300">
                        <Github className="w-5 h-5 mr-3 group-hover:text-white" />
                        <span className="text-sm">GitHub</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-750 transition-colors group">
                      <div className="flex items-center text-gray-300">
                        <Linkedin className="w-5 h-5 mr-3 group-hover:text-white" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                </div>
              </section>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
