
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { applicationService } from '@/api/services';
import { Application } from '@/types';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const applicationId = typeof id === 'string' ? id : '';
  const queryClient = useQueryClient();

  const [noteInput, setNoteInput] = useState('');

  // Fetch Application Details
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationService.getApplication(applicationId),
    enabled: !!applicationId,
  });

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: (newStatus: Application['status']) => 
      applicationService.updateApplicationStatus(applicationId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      toast.success('Application status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleStatusChange = (newStatus: Application['status']) => {
    statusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">Application Not Found</h2>
          <button onClick={() => router.back()} className="text-blue-400 hover:underline">
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { freelancer, job } = application;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
          
          {/* Header & Navigation */}
          <div>
             <Link 
                href={`/employer/jobs/${job.id}/applications`}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Applicants
              </Link>
             
             <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {freelancer.first_name[0]}{freelancer.last_name[0]}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{freelancer.first_name} {freelancer.last_name}</h1>
                    <p className="text-gray-400">Applied for <span className="text-blue-400 font-medium">{job.title}</span></p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> San Francisco, CA (Mock)</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                   {/* Status Actions */}
                   {application.status === 'pending' && (
                     <>
                        <button 
                          onClick={() => handleStatusChange('rejected')}
                          className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleStatusChange('interviewing')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-colors"
                        >
                          Schedule Interview
                        </button>
                     </>
                   )}
                   
                   {application.status === 'interviewing' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange('rejected')}
                          className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleStatusChange('offer')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg shadow-green-900/20 transition-colors"
                        >
                          Make Offer
                        </button>
                      </>
                   )}

                   {/* Current Status Badge if not pending/actionable inline */}
                   {['accepted', 'rejected', 'offer'].includes(application.status) && (
                      <span className={`px-4 py-2 rounded-lg font-bold border capitalize ${
                        application.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        application.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {application.status}
                      </span>
                   )}
                   
                   <button className="p-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                     <MoreHorizontal className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Cover Letter */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                  Cover Letter
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
                  {application.cover_letter || "No cover letter provided."}
                </div>
              </div>

              {/* Resume Viewer (Mock) */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Resume.pdf
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Mock PDF Viewer Area */}
                <div className="h-[600px] bg-white text-gray-900 p-8 overflow-y-auto">
                   <div className="max-w-3xl mx-auto space-y-6">
                      <div className="border-b-2 border-gray-900 pb-4">
                        <h1 className="text-4xl font-bold uppercase tracking-wider">{freelancer.first_name} {freelancer.last_name}</h1>
                        <p className="text-xl text-gray-600 mt-1">Senior Product Designer</p>
                        <div className="flex gap-4 mt-4 text-sm text-gray-600">
                          <span>{freelancer.email}</span>
                          <span>•</span>
                          <span>+1 (555) 123-4567</span>
                          <span>•</span>
                          <span>San Francisco, CA</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase text-gray-700">Experience</h3>
                        <div className="space-y-4">
                           <div>
                             <div className="flex justify-between font-bold">
                               <h4>Senior Product Designer</h4>
                               <span>2021 - Present</span>
                             </div>
                             <p className="text-gray-700 italic">TechFlow Inc.</p>
                             <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-600">
                               <li>Led design system overhaul reducing dev time by 30%</li>
                               <li>Mentored 3 junior designers</li>
                               <li>Spearheaded the mobile app redesign</li>
                             </ul>
                           </div>
                           <div>
                             <div className="flex justify-between font-bold">
                               <h4>UX Designer</h4>
                               <span>2018 - 2021</span>
                             </div>
                             <p className="text-gray-700 italic">Creative Agency XYZ</p>
                             <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-600">
                               <li>Designed e-commerce experiences for Fortune 500 clients</li>
                               <li>Conducted user research and usability testing</li>
                             </ul>
                           </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase text-gray-700">Education</h3>
                        <div className="flex justify-between">
                           <div>
                             <h4 className="font-bold">BFA Interaction Design</h4>
                             <p className="text-gray-600">California College of the Arts</p>
                           </div>
                           <span className="font-bold">2018</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase text-gray-700">Skills</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                          {['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS', 'React'].map(s => (
                            <span key={s} className="bg-gray-100 px-2 py-1 rounded">{s}</span>
                          ))}
                        </div>
                      </div>

                   </div>
                </div>
              </div>

            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* Contact Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-white mb-2">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`mailto:${freelancer.email}`} className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="truncate">{freelancer.email}</span>
                  </a>
                  <div className="flex items-center text-gray-400">
                    <Phone className="w-4 h-4 mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Globe className="w-4 h-4 mr-3" />
                    <a href="#" className="hover:text-blue-400">portfolio.com/alex</a>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-[#0077b5] hover:text-white text-gray-400 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-black hover:text-white text-gray-400 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Recruitment Notes */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col h-[400px]">
                <h3 className="font-bold text-white mb-4">Private Notes</h3>
                
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
                   {/* Mock Notes */}
                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                     <p className="text-sm text-gray-300">Strong portfolio. The design system project is exactly what we need.</p>
                     <p className="text-xs text-gray-500 mt-2">Posted by You • 2 days ago</p>
                   </div>
                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                     <p className="text-sm text-gray-300">Asked about salary expectations. Seems within budget.</p>
                     <p className="text-xs text-gray-500 mt-2">Posted by Sarah (HR) • 1 day ago</p>
                   </div>
                </div>

                <div className="mt-auto">
                   <textarea
                     value={noteInput}
                     onChange={(e) => setNoteInput(e.target.value)}
                     placeholder="Add a private note..."
                     className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                   ></textarea>
                   <button 
                     disabled={!noteInput.trim()}
                     className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors"
                   >
                     Add Note
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
