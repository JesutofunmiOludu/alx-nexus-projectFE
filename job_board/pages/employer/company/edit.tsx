
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/api/services';
import { Company } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import toast from 'react-hot-toast';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Camera,
  Linkedin,
  Twitter,
  Facebook,
  Save,
  Shield,
  CreditCard,
  UserPlus,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Invalid URL').or(z.literal('')),
  industry: z.string().min(2, 'Industry is required'),
  company_size: z.string().min(1, 'Company size is required'),
  location: z.string().min(2, 'Location is required'),
  linkedin_url: z.string().url('Invalid URL').or(z.literal('')),
  twitter_url: z.string().url('Invalid URL').or(z.literal('')),
  facebook_url: z.string().url('Invalid URL').or(z.literal('')),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyProfileManager() {
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();

  // Fetch My Company
  const { data: company, isLoading } = useQuery({
    queryKey: ['my-company'],
    queryFn: () => companyService.getMyCompany(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        industry: company.industry || '',
        company_size: company.company_size || '',
        location: company.location || '',
        // These are extra fields not in the base Company type but usually needed
        // @ts-ignore
        linkedin_url: company.linkedin_url || '',
        // @ts-ignore
        twitter_url: company.twitter_url || '',
        // @ts-ignore
        facebook_url: company.facebook_url || '',
      });
    }
  }, [company, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: CompanyFormData) => companyService.updateCompany(company?.id || 'me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Company profile updated successfully');
    },
    onError: () => toast.error('Failed to update company profile'),
  });

  const onSubmit = (data: CompanyFormData) => {
    updateMutation.mutate(data);
  };

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'team', label: 'Team Members', icon: UserPlus },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (isLoading) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Company Management</h1>
              <p className="text-gray-400 mt-1">Configure your organization's public presence and internal settings.</p>
            </div>
            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || updateMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-all text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Nav Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-9 space-y-8">
               
               {/* Branding Section (Logo & Cover) */}
               <section className="bg-[#1a1c23] border border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                  {/* Cover Header */}
                  <div className="h-48 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative group">
                     {company?.logo ? (
                       <img 
                        src={company.logo} 
                        alt="Cover" 
                        className="w-full h-full object-cover opacity-30"
                       />
                     ) : null}
                     <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                           <Camera className="w-4 h-4" />
                           Change Cover Photo
                        </div>
                     </button>

                     {/* Profile Logo Overlap */}
                     <div className="absolute -bottom-10 left-10">
                        <div className="w-24 h-24 rounded-2xl bg-[#111318] border-4 border-[#1a1c23] p-4 relative group/logo shadow-2xl overflow-hidden">
                           {company?.logo ? (
                             <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
                           ) : (
                             <Building2 className="w-full h-full text-gray-700" />
                           )}
                           <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity">
                             <Camera className="w-5 h-5 text-white" />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="pt-16 pb-8 px-10">
                     <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-white">{company?.name || 'New Organization'}</h2>
                          <p className="text-sm text-gray-500 font-medium">Identity and branding assets</p>
                        </div>
                        <a 
                          href={`/company/${company?.id}`} 
                          className="flex items-center gap-2 text-blue-500 text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
                        >
                          View Public Page
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                     </div>
                  </div>
               </section>

               {/* Basic Details Section */}
               <section className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-10 shadow-sm space-y-8">
                  <div className="border-b border-gray-800 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-white">General Information</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage core attributes of your company</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                     {/* Company Name */}
                     <div className="space-y-2.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Name</label>
                        <input 
                           {...register('name')}
                           placeholder="Acme Corp"
                           className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name.message}</p>}
                     </div>

                     {/* Industry */}
                     <div className="space-y-2.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Industry</label>
                        <select 
                           {...register('industry')}
                           className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                        >
                           <option value="">Select Industry</option>
                           <option value="Technology">Technology</option>
                           <option value="SaaS">SaaS</option>
                           <option value="Healthcare">Healthcare</option>
                           <option value="Finance">Finance</option>
                           <option value="Design">Design</option>
                        </select>
                        {errors.industry && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.industry.message}</p>}
                     </div>

                     {/* Website */}
                     <div className="space-y-2.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Website URL</label>
                        <div className="relative">
                           <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                           <input 
                              {...register('website')}
                              placeholder="https://acme.com"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                           />
                        </div>
                     </div>

                     {/* Location */}
                     <div className="space-y-2.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                        <div className="relative">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                           <input 
                              {...register('location')}
                              placeholder="San Francisco, CA"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                           />
                        </div>
                     </div>

                     {/* Team Size */}
                     <div className="space-y-2.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Size</label>
                        <div className="relative">
                           <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                           <select 
                              {...register('company_size')}
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                           >
                              <option value="1-10">1-10 Employees</option>
                              <option value="11-50">11-50 Employees</option>
                              <option value="51-200">51-200 Employees</option>
                              <option value="201-500">201-500 Employees</option>
                              <option value="500+">500+ Employees</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2.5">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">About the Company</label>
                     <textarea 
                        {...register('description')}
                        rows={6}
                        placeholder="Describe your company's mission, values, and culture..."
                        className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none leading-relaxed"
                     />
                     {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.description.message}</p>}
                  </div>
               </section>

               {/* Social Presence Section */}
               <section className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-10 shadow-sm space-y-8">
                  <div className="border-b border-gray-800 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-white">Social Presence</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Strengthen your reach through social networks</p>
                  </div>

                  <div className="space-y-6">
                     {/* LinkedIn */}
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                           <Linkedin className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LinkedIn Profile</label>
                           <input 
                              {...register('linkedin_url')}
                              placeholder="linkedin.com/company/acme"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-medium"
                           />
                        </div>
                     </div>

                     {/* Twitter */}
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-gray-600/10 border border-gray-500/20 flex items-center justify-center text-white shrink-0">
                           <Twitter className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Twitter / X</label>
                           <input 
                              {...register('twitter_url')}
                              placeholder="twitter.com/acme"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-medium"
                           />
                        </div>
                     </div>

                     {/* Facebook */}
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                           <Facebook className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Facebook Page</label>
                           <input 
                              {...register('facebook_url')}
                              placeholder="facebook.com/acme"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-medium"
                           />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Action Footer */}
               <div className="flex items-center justify-between p-8 bg-blue-600/5 rounded-3xl border border-blue-600/20">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                        <Shield className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-white font-bold text-sm">Your data is safe</p>
                        <p className="text-blue-200/50 text-[10px] font-medium uppercase tracking-widest">Encrypted and secure infrastructure</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleSubmit(onSubmit)}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 shadow-2xl"
                  >
                    Save All Changes
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
