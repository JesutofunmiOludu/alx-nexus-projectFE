
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/api/services';
import { FreelancerProfile, Experience, Education } from '@/types';
import toast from 'react-hot-toast';
import {
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  CreditCard,
  Eye,
  Globe,
  Save,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

// Validation Schema
const profileSchema = z.object({
  title: z.string().min(2, 'Professional title is required'),
  bio: z.string().max(5000, 'Bio must be under 5000 characters').min(50, 'Please provide a more detailed bio'),
  hourly_rate: z.number().min(5, 'Minimum hourly rate is $5'),
  visibility: z.enum(['public', 'private']).default('public'),
  skills: z.array(z.string()).min(1, 'Add at least one skill'),
  experience: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(2, 'Job title is required'),
    company: z.string().min(2, 'Company name is required'),
    start_date: z.string(),
    end_date: z.string().optional().or(z.literal('')),
    is_current: z.boolean().default(false),
    description: z.string().optional(),
  })),
  education: z.array(z.object({
    id: z.string().optional(),
    degree: z.string().min(2, 'Degree is required'),
    institution: z.string().min(2, 'Institution is required'),
    start_date: z.string(),
    end_date: z.string().optional().or(z.literal('')),
    is_current: z.boolean().default(false),
  })),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('basic');
  const [skillInput, setSkillInput] = useState('');

  // Fetch Current Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => profileService.getMyProfile(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      title: '',
      bio: '',
      hourly_rate: 0,
      visibility: 'public',
      skills: [],
      experience: [],
      education: [],
    }
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience"
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education"
  });

  const skills = watch('skills');
  const bio = watch('bio') || '';

  useEffect(() => {
    if (profile) {
      reset({
        title: profile.title || '',
        bio: profile.bio || '',
        hourly_rate: profile.hourly_rate || 0,
        // @ts-ignore - visibility field usage
        visibility: profile.availability === 'not_available' ? 'private' : 'public',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
      });
    }
  }, [profile, reset]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      return profileService.updateProfile(profile?.id || 'me', {
        ...data,
        // Map visibility back to availability for API compatibility
        availability: data.visibility === 'public' ? 'available' : 'not_available'
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue('skills', [...skills, trimmed], { shouldDirty: true });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue('skills', skills.filter(s => s !== skillToRemove), { shouldDirty: true });
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">JB</div>
                <span className="font-bold text-xl tracking-tight">JobBoard</span>
             </div>
             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
               <Link href="/freelancer/jobs" className="hover:text-gray-900 transition-colors">Find Jobs</Link>
               <Link href="/messages" className="hover:text-gray-900 transition-colors">Messages</Link>
               <Link href="/freelancer/proposals" className="hover:text-gray-900 transition-colors">My Proposals</Link>
             </nav>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || updateMutation.isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold text-sm transition-all"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-200 overflow-hidden relative">
               <img src={`https://ui-avatars.com/api/?name=${profile?.user.first_name}+${profile?.user.last_name}&background=random`} alt="Profile" />
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             <div className="p-6 border-b border-gray-100">
               <h2 className="font-bold text-lg">Edit Profile</h2>
               <p className="text-sm text-gray-500 mt-1">Manage your professional identity</p>
             </div>
             <nav className="p-2">
               {[
                 { id: 'basic', icon: User, label: 'Basic Info' },
                 { id: 'experience', icon: Briefcase, label: 'Experience' },
                 { id: 'education', icon: GraduationCap, label: 'Education' },
                 { id: 'skills', icon: Zap, label: 'Skills' },
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveSection(item.id)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                     activeSection === item.id 
                       ? 'bg-blue-50 text-blue-600' 
                       : 'text-gray-600 hover:bg-gray-50'
                   }`}
                 >
                   <item.icon className="w-4 h-4" />
                   {item.label}
                 </button>
               ))}
             </nav>
           </div>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Basic Information Section */}
          <section className="space-y-6">
             <div className="flex flex-col gap-1">
               <h2 className="text-2xl font-bold">Basic Information</h2>
               <p className="text-gray-500 text-sm">This information will be displayed to potential clients on your public profile.</p>
             </div>

             <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8">
                {/* Professional Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Professional Title</label>
                  <input 
                    {...register('title')}
                    placeholder="e.g. Senior UX/UI Designer & Web Architect"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold">Bio</label>
                    <span className="text-xs text-gray-400 font-medium">{bio.length} / 5000 characters</span>
                  </div>
                  <textarea 
                     {...register('bio')}
                     rows={6}
                     placeholder="Describe your background, skills, and what you offer..."
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                </div>

                {/* Hourly Rate & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold">Hourly Rate</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</div>
                        <input 
                           type="number"
                           {...register('hourly_rate', { valueAsNumber: true })}
                           className="w-full pl-8 pr-20 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold uppercase">USD / hr</div>
                      </div>
                      {errors.hourly_rate && <p className="text-red-500 text-xs mt-1">{errors.hourly_rate.message}</p>}
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-semibold">Profile Visibility</label>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">{watch('visibility') === 'public' ? 'Public' : 'Private'}</span>
                        <button 
                          type="button"
                          onClick={() => setValue('visibility', watch('visibility') === 'public' ? 'private' : 'public', { shouldDirty: true })}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${watch('visibility') === 'public' ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${watch('visibility') === 'public' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-6 pt-4">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold">Experience</h2>
               <button 
                type="button"
                onClick={() => appendExp({ title: '', company: '', start_date: '', description: '', is_current: false })}
                className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
               >
                 <Plus className="w-4 h-4" />
                 Add Experience
               </button>
             </div>

             <div className="space-y-4">
                {expFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-gray-300 transition-all group">
                    <div className="flex gap-4 items-start">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400">
                         <Briefcase className="w-6 h-6" />
                       </div>
                       <div className="flex-1 space-y-4">
                         <div className="flex justify-between items-start">
                            <div className="w-full max-w-lg space-y-1">
                               <input 
                                 {...register(`experience.${index}.title` as const)}
                                 placeholder="Job Title"
                                 className="text-lg font-bold w-full bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                               />
                               <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                 <input 
                                   {...register(`experience.${index}.company` as const)}
                                   placeholder="Company"
                                   className="bg-transparent border-none p-0 focus:ring-0 w-32 placeholder-gray-300"
                                 />
                                 <span>•</span>
                                 <input 
                                   type="month"
                                   {...register(`experience.${index}.start_date` as const)}
                                   className="bg-transparent border-none p-0 focus:ring-0 text-xs text-gray-400"
                                 />
                                 <span>-</span>
                                 {watch(`experience.${index}.is_current`) ? (
                                   <span className="text-xs">Present</span>
                                 ) : (
                                   <input 
                                     type="month"
                                     {...register(`experience.${index}.end_date` as const)}
                                     className="bg-transparent border-none p-0 focus:ring-0 text-xs text-gray-400"
                                   />
                                 )}
                               </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => removeExp(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                         </div>
                         <textarea 
                           {...register(`experience.${index}.description` as const)}
                           placeholder="Describe your achievements and responsibilities..."
                           rows={3}
                           className="w-full bg-gray-50/30 rounded-lg border border-gray-100 p-3 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                         />
                       </div>
                    </div>
                  </div>
                ))}
                {expFields.length === 0 && (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                     <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500 font-medium">No experience added yet</p>
                  </div>
                )}
             </div>
          </section>

          {/* Education Section */}
          <section className="space-y-6 pt-4">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold">Education</h2>
               <button 
                type="button" 
                onClick={() => appendEdu({ degree: '', institution: '', start_date: '', is_current: false })}
                className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
               >
                 <Plus className="w-4 h-4" />
                 Add Education
               </button>
             </div>

             <div className="space-y-4">
                {eduFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-gray-300 transition-all group">
                    <div className="flex gap-4 items-start">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400">
                         <GraduationCap className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <div className="w-full max-w-lg space-y-1">
                               <input 
                                 {...register(`education.${index}.degree` as const)}
                                 placeholder="Degree (e.g. B.S. in Computer Science)"
                                 className="text-lg font-bold w-full bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                               />
                               <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                 <input 
                                   {...register(`education.${index}.institution` as const)}
                                   placeholder="Institution"
                                   className="bg-transparent border-none p-0 focus:ring-0 w-48 placeholder-gray-300"
                                 />
                                 <span>•</span>
                                 <input 
                                   type="month"
                                   {...register(`education.${index}.start_date` as const)}
                                   className="bg-transparent border-none p-0 focus:ring-0 text-xs text-gray-400"
                                 />
                                 <span>-</span>
                                 <input 
                                   type="month"
                                   {...register(`education.${index}.end_date` as const)}
                                   className="bg-transparent border-none p-0 focus:ring-0 text-xs text-gray-400"
                                 />
                               </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => removeEdu(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6 pt-4">
             <h2 className="text-xl font-bold">Skills</h2>
             <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input 
                      type="text"
                      placeholder="Search popular skills (e.g. React, Tailwind, Figma)..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                   />
                </div>

                <div className="flex flex-wrap gap-2">
                   {skills.map((skill) => (
                     <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm border border-blue-100 group">
                       {skill}
                       <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Suggestions</p>
                   <div className="flex flex-wrap gap-2">
                     {['Adobe XD', 'Node.js', 'GraphQL', 'AWS', 'Python', 'Docker'].filter(s => !skills.includes(s)).map((suggestion) => (
                       <button 
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddSkill(suggestion)}
                          className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                       >
                         {suggestion}
                       </button>
                     ))}
                   </div>
                </div>
             </div>
          </section>

        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
         <Link href={`/profile/${profile?.id}`}>
           <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
             <Eye className="w-5 h-5" />
             Preview Public Profile
           </button>
         </Link>
      </div>

    </div>
  );
}
