
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/services';
import { useAppSelector } from '@/store';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import toast from 'react-hot-toast';
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Link as LinkIcon,
  Camera,
  Mail,
  MapPin,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  Key,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const settingsSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  professional_headline: z.string().min(5, 'Professional headline is required'),
  location: z.string().min(2, 'Location is required'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('account');

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: () => authService.getMe(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (authUser) {
      reset({
        first_name: authUser.first_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        // @ts-ignore
        professional_headline: authUser.professional_headline || 'UI/UX Designer & Product Strategist',
        // @ts-ignore
        location: authUser.location || 'San Francisco, CA',
      });
    }
  }, [authUser, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: SettingsFormData) => authService.updateMe(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
      toast.success('Settings updated successfully');
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  const navItems = [
    { id: 'account', label: 'Account Overview', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'apps', label: 'Connected Apps', icon: LinkIcon },
  ];

  if (isLoading) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
          
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Account Overview</h1>
            <p className="text-gray-400 mt-1">Manage your professional identity and account settings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-6">
               <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                 <div className="p-4 border-b border-gray-800/50">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Settings Menu</p>
                 </div>
                 <nav className="p-2 space-y-1">
                   {navItems.map((item) => (
                     <button
                       key={item.id}
                       onClick={() => setActiveTab(item.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                         activeTab === item.id 
                           ? 'bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20' 
                           : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                       }`}
                     >
                       <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-500'}`} />
                       {item.label}
                     </button>
                   ))}
                 </nav>
               </div>

               {/* Pro Tip Card */}
               <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Pro Tip</p>
                  <p className="text-xs text-blue-100/70 leading-relaxed font-medium">
                    Complete your full profile to increase your visibility to premium employers by 40%.
                  </p>
                  <Link href="/freelancer/profile/edit" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    View Public Profile
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
               </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-8">
               
               {/* Quick Profile Overview */}
               <section className="bg-gradient-to-r from-[#1a1c23] to-[#111318] border border-gray-800 rounded-3xl p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                     <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                          <div className="w-full h-full rounded-full bg-[#1a1c23] p-1">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${authUser?.first_name}+${authUser?.last_name}&background=random&color=fff&size=256`} 
                              className="w-full h-full rounded-full object-cover"
                              alt="Profile"
                            />
                          </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-4 border-[#1a1c23] shadow-lg hover:scale-110 transition-transform">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                     </div>
                     
                     <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                           <h2 className="text-2xl font-bold text-white">{authUser?.first_name} {authUser?.last_name}</h2>
                           <span className="px-2.5 py-0.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 rounded text-[10px] font-bold uppercase tracking-widest">
                             {authUser?.user_type}
                           </span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-medium">
                          UI/UX Designer & Frontend Developer based in San Francisco. Working with top-tier tech startups.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                           <button className="text-xs font-bold text-blue-500 hover:text-blue-400">Change Photo</button>
                           <button className="text-xs font-bold text-red-500/70 hover:text-red-500">Remove Photo</button>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Personal Information Form */}
               <section className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-10 shadow-sm space-y-10">
                  <div className="border-b border-gray-800 pb-6">
                    <h3 className="text-lg font-bold text-white">Personal Information</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage your basic account details</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Full Name */}
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                           <input 
                              {...register('first_name')}
                              placeholder="e.g. Alex Rivers"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                           />
                           {errors.first_name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.first_name.message}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                              <div className="flex items-center gap-1.5 text-emerald-500">
                                 <CheckCircle2 className="w-3.5 h-3.5" />
                                 <span className="text-[10px] font-bold uppercase tracking-tight">Verified</span>
                              </div>
                           </div>
                           <div className="relative">
                              <input 
                                 {...register('email')}
                                 placeholder="alex.rivers@design.com"
                                 className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium pr-12"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                           </div>
                           <p className="text-[10px] text-emerald-500/70 font-bold tracking-tight">Email is verified</p>
                        </div>

                        {/* Professional Headline */}
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Professional Headline</label>
                           <input 
                              {...register('professional_headline')}
                              placeholder="e.g. UI/UX Designer & Product Strategist"
                              className="w-full bg-[#111318] border border-gray-800 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                           />
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                           <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                              <input 
                                 {...register('location')}
                                 placeholder="San Francisco, CA"
                                 className="w-full bg-[#111318] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                              />
                           </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                       <button type="button" onClick={() => reset()} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
                          Discard
                       </button>
                       <button 
                         type="submit" 
                         disabled={!isDirty || updateMutation.isPending}
                         className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-all text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20"
                       >
                         {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                       </button>
                    </div>
                  </form>
               </section>

               {/* Quick Security Actions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-8 flex flex-col gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                           <RotateCcw className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold">Change Password</h4>
                           <p className="text-xs text-gray-500 mt-0.5">Last changed 3 months ago</p>
                        </div>
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Ensure your account is using a long, random password to stay secure.
                     </p>
                     <button className="w-fit px-4 py-2 bg-[#111318] border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-gray-700 transition-all">
                        Reset Password
                     </button>
                  </div>

                  <div className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-8 flex flex-col gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                           <Key className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold">Two-Factor Auth</h4>
                           <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5">Disabled</p>
                        </div>
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Add an extra layer of security to your account with 2FA.
                     </p>
                     <button className="w-fit px-4 py-2 bg-[#111318] border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-gray-700 transition-all">
                        Setup 2FA
                     </button>
                  </div>
               </div>

               {/* Danger Zone */}
               <section className="bg-red-500/5 border border-red-500/20 rounded-3xl overflow-hidden">
                  <div className="p-6 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
                     <AlertTriangle className="w-5 h-5 text-red-500" />
                     <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h3>
                  </div>
                  <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="space-y-2">
                        <h4 className="text-white font-bold">Delete Account</h4>
                        <p className="text-xs text-gray-500 max-w-lg leading-relaxed font-medium">
                          Permanently delete your account and all associated data. This action is irreversible.
                        </p>
                     </div>
                     <button className="px-8 py-3 bg-red-600 hover:bg-red-700 transition-all text-white rounded-xl font-bold text-sm shadow-xl shadow-red-600/20">
                        Delete My Account
                     </button>
                  </div>
               </section>

               {/* Copyright Footer */}
               <div className="pt-8 text-center">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    © 2024 JobBoard Inc. All rights reserved. • <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link> • <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
                  </p>
               </div>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
