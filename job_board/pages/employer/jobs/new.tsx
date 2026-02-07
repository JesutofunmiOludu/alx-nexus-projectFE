

import { useState } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/api/services'; // Import jobService
import type { CreateJobData } from '@/types'; // Import type
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Monitor, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Check
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

// --- Validation Schemas ---

const jobSchema = z.object({
  // Step 1: Job Details
  title: z.string().min(3, 'Job title is required'),
  category: z.string().min(1, 'Category is required'),
  locationType: z.enum(['remote', 'onsite', 'hybrid']),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  
  // Step 2: Requirements
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  education: z.string().min(1, 'Education level is required'),
  questions: z.array(z.object({ text: z.string().min(1, 'Question text is required') })).optional(),

  // Step 3: Compensation & Benefits
  currency: z.string().default('USD'),
  salaryMin: z.string().min(1, 'Minimum salary is required'),
  salaryMax: z.string().min(1, 'Maximum salary is required'),
  workSchedule: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
  benefits: z.array(z.string()).optional(),
  
  // Step 4: Visibility
  visibility: z.enum(['public', 'internal']),
  acceptedTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: 'onChange',
    defaultValues: {
      locationType: 'remote',
      questions: [{ text: '' }],
      currency: 'USD',
      salaryMin: '',
      salaryMax: '',
      workSchedule: 'full-time',
      benefits: [],
      skills: [],
      visibility: 'public',
      acceptedTerms: false,
    }
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions"
  });

  const watchAllFields = watch();

  // --- Navigation Handlers ---

  const nextStep = async () => {
    let fieldsToValidate: (keyof JobFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'category', 'locationType', 'location', 'description'];
        break;
      case 2:
        fieldsToValidate = ['skills', 'experienceLevel', 'education']; // Questions are optional
        break;
      case 3:
        fieldsToValidate = ['salaryMin', 'salaryMax', 'workSchedule'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      // Map form data to API payload
      const experienceMapping: Record<string, 'entry' | 'mid' | 'senior' | 'lead'> = {
        'Junior': 'entry',
        'Mid-Level': 'mid',
        'Senior': 'senior',
        'Lead': 'lead'
      };

      const jobData: CreateJobData = {
        title: data.title,
        description: data.description,  // Category is implicitly part of description or separate logic if backend supports
        location: data.location,
        job_type: data.workSchedule,
        experience_level: experienceMapping[data.experienceLevel] || 'mid',
        salary_min: parseInt(data.salaryMin),
        salary_max: parseInt(data.salaryMax),
        salary_currency: data.currency,
        skills_required: data.skills,
        benefits: data.benefits,
        is_remote: data.locationType === 'remote',
      };

      await jobService.createJob(jobData);
      
      toast.success('Job Posted Successfully!');
      router.push('/employer/dashboard');
    } catch (error) {
       console.error('Failed to post job:', error);
       toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper Functions ---

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!watchAllFields.skills.includes(skillInput.trim())) {
        setValue('skills', [...watchAllFields.skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills', watchAllFields.skills.filter(s => s !== skillToRemove));
  };

  const toggleBenefit = (benefit: string) => {
    const currentBenefits = watchAllFields.benefits || [];
    if (currentBenefits.includes(benefit)) {
      setValue('benefits', currentBenefits.filter(b => b !== benefit));
    } else {
      setValue('benefits', [...currentBenefits, benefit]);
    }
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-white mb-4">Job Details</h2>
      
      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Job Title</label>
        <input 
          {...register('title')}
          type="text" 
          placeholder="e.g. Senior Product Designer" 
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Job Category */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Job Category</label>
        <select 
          {...register('category')}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none"
        >
          <option value="">Select a category</option>
          <option value="design">Design & Creative</option>
          <option value="engineering">Engineering & Development</option>
          <option value="product">Product Management</option>
          <option value="marketing">Marketing & Sales</option>
        </select>
        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Location Type */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Work Location Type</label>
        <div className="grid grid-cols-3 gap-3">
          {['remote', 'hybrid', 'onsite'].map((type) => (
            <label 
              key={type}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                watchAllFields.locationType === type 
                  ? 'bg-blue-600/10 border-blue-600 text-blue-400' 
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <input 
                {...register('locationType')}
                type="radio" 
                value={type} 
                className="sr-only"
              />
              <span className="capitalize font-medium flex items-center">
                {type === 'remote' && <Globe className="w-4 h-4 mr-2" />}
                {type === 'hybrid' && <Monitor className="w-4 h-4 mr-2" />}
                {type === 'onsite' && <Building2 className="w-4 h-4 mr-2" />}
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Specific Location */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            {...register('location')}
            type="text" 
            placeholder="e.g. New York, NY or Worldwide" 
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          />
        </div>
          {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Job Description</label>
        {/* Toolbar Mockup */}
        <div className="border border-gray-700 rounded-t-lg bg-gray-900 p-2 flex gap-2 border-b-0">
          {['B', 'I', 'U'].map((tool) => (
            <button key={tool} type="button" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded">
              <span className="font-serif font-bold">{tool}</span>
            </button>
          ))}
          <div className="w-px h-6 bg-gray-700 my-auto mx-1"></div>
            <button type="button" className="p-1 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded">List</button>
        </div>
        <textarea 
          {...register('description')}
          rows={10}
          className="w-full bg-gray-900 border border-gray-700 rounded-b-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
        ></textarea>
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Required Skills</label>
        <div className="flex flex-wrap gap-2 mb-3 bg-gray-900 border border-gray-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
          {watchAllFields.skills.map((skill) => (
            <span key={skill} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center">
              {skill}
              <button 
                type="button" 
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input 
            type="text" 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder={watchAllFields.skills.length > 0 ? "" : "Type skills (e.g. React) and press Enter"}
            className="bg-transparent text-white outline-none flex-1 min-w-[150px] px-2 py-1"
          />
        </div>
        <p className="text-xs text-gray-500">Press Enter to add tags</p>
        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills.message}</p>}
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
          <div className="space-y-2">
            {['Junior', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
              <label 
                key={level}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  watchAllFields.experienceLevel === level 
                    ? 'bg-blue-600/10 border-blue-600' 
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <span className={`text-sm font-medium ${watchAllFields.experienceLevel === level ? 'text-blue-400' : 'text-gray-300'}`}>
                  {level}
                </span>
                <input 
                  {...register('experienceLevel')}
                  type="radio" 
                  value={level} 
                  className="sr-only"
                />
                {watchAllFields.experienceLevel === level && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </label>
            ))}
          </div>
           {errors.experienceLevel && <p className="text-red-400 text-xs mt-1">{errors.experienceLevel.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Education</label>
          <select 
             {...register('education')}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="">Select requirement</option>
            <option value="High School">High School Details</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Self-taught">Self-taught / No Degree</option>
          </select>
          {errors.education && <p className="text-red-400 text-xs mt-1">{errors.education.message}</p>}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="pt-4 border-t border-gray-700">
        <label className="block text-sm font-medium text-gray-400 mb-3">Custom Interview Questions</label>
        <div className="space-y-3">
          {questionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-10 bg-gray-700 text-gray-400 rounded text-sm font-mono">
                {index + 1}
              </span>
              <input
                {...register(`questions.${index}.text` as const)}
                type="text"
                placeholder="e.g. Tell us about a challenge you solved..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
              <button 
                type="button"
                onClick={() => removeQuestion(index)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {questionFields.length < 5 && (
            <button
              type="button"
              onClick={() => appendQuestion({ text: '' })}
              className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-blue-600 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-white mb-4">Compensation & Benefits</h2>

      {/* Salary & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-gray-400 mb-2">Salary Range ({watchAllFields.currency}/Year)</label>
           <div className="flex gap-3">
             <div className="relative flex-1">
               <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input 
                 {...register('salaryMin')}
                 type="number" 
                 placeholder="Min" 
                 className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
               />
             </div>
             <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  {...register('salaryMax')}
                  type="number" 
                  placeholder="Max" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
             </div>
           </div>
           {errors.salaryMax && <p className="text-red-400 text-xs mt-1">{errors.salaryMax.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Work Schedule</label>
           <div className="grid grid-cols-2 gap-2">
             {['full-time', 'part-time', 'contract', 'freelance'].map((schedule) => (
                <label 
                  key={schedule}
                  className={`flex items-center justify-center px-2 py-3 rounded-lg border cursor-pointer transition-all text-sm ${
                    watchAllFields.workSchedule === schedule 
                      ? 'bg-blue-600/10 border-blue-600 text-blue-400' 
                      : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <input 
                    {...register('workSchedule')}
                    type="radio" 
                    value={schedule} 
                    className="sr-only"
                  />
                  <span className="capitalize">{schedule.replace('-', ' ')}</span>
                </label>
             ))}
           </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-400 mb-3">Benefits & Perks</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Health Insurance', 'Dental & Vision', 
            '401k Matching', 'Remote Work', 
            'Unlimited PTO', 'Gym Membership', 
            'Learning Budget', 'Home Office Stipend'
          ].map((benefit) => (
             <label 
                key={benefit}
                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                  watchAllFields.benefits?.includes(benefit)
                    ? 'bg-blue-600/10 border-blue-600' 
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                }`}
              >
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    watchAllFields.benefits?.includes(benefit) ? 'bg-blue-600 border-blue-600' : 'border-gray-500'
                  }`}>
                    {watchAllFields.benefits?.includes(benefit) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox"
                    className="hidden"
                    onChange={() => toggleBenefit(benefit)}
                    checked={watchAllFields.benefits?.includes(benefit)}
                  />
                  <div>
                    <span className="block text-sm font-medium text-white">{benefit}</span>
                    <span className="text-xs text-gray-500">Industry standard coverage</span>
                  </div>
             </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
          Review & Publish
        </h2>
        
        <div className="space-y-6">
          {/* Summary Sections */}
           <div className="border border-gray-700 rounded-lg overflow-hidden">
             <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
               <h3 className="font-semibold text-white">1. Job Details</h3>
               <button onClick={() => setCurrentStep(1)} className="text-blue-400 text-sm hover:underline">Edit</button>
             </div>
             <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="text-gray-500 block">Job Title</span>
                   <span className="text-white bg-gray-900 px-2 py-1 rounded mt-1 inline-block border border-gray-700">{watchAllFields.title}</span>
                </div>
                <div>
                   <span className="text-gray-500 block">Category</span>
                   <span className="text-white">{watchAllFields.category}</span>
                </div>
             </div>
           </div>

           <div className="border border-gray-700 rounded-lg overflow-hidden">
             <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
               <h3 className="font-semibold text-white">2. Requirements</h3>
               <button onClick={() => setCurrentStep(2)} className="text-blue-400 text-sm hover:underline">Edit</button>
             </div>
             <div className="p-4 text-sm">
                <div className="mb-2">
                   <span className="text-gray-500 block mb-1">Key Skills</span>
                   <div className="flex flex-wrap gap-2">
                    {watchAllFields.skills.map(s => (
                      <span key={s} className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-900/50">{s}</span>
                    ))}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                   <div>
                     <span className="text-gray-500">Experience:</span> <span className="text-white">{watchAllFields.experienceLevel}</span>
                   </div>
                   <div>
                     <span className="text-gray-500">Education:</span> <span className="text-white">{watchAllFields.education}</span>
                   </div>
                </div>
             </div>
           </div>

           <div className="border border-gray-700 rounded-lg overflow-hidden">
             <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
               <h3 className="font-semibold text-white">3. Compensation</h3>
               <button onClick={() => setCurrentStep(3)} className="text-blue-400 text-sm hover:underline">Edit</button>
             </div>
             <div className="p-4 text-sm grid grid-cols-2 gap-4">
                <div>
                   <span className="text-gray-500 block">Salary Range</span>
                   <span className="text-green-400 font-mono font-medium">${parseInt(watchAllFields.salaryMin).toLocaleString()} - ${parseInt(watchAllFields.salaryMax).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Work Schedule</span>
                  <span className="text-white capitalize">{watchAllFields.workSchedule}</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
         <h4 className="text-white font-bold mb-4">Visibility Settings</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${watchAllFields.visibility === 'public' ? 'bg-blue-600/10 border-blue-600' : 'bg-gray-900 border-gray-700'}`}>
               <input {...register('visibility')} type="radio" value="public" className="sr-only" />
               <div className="flex items-center mb-2">
                 <Globe className={`w-5 h-5 mr-2 ${watchAllFields.visibility === 'public' ? 'text-blue-400' : 'text-gray-400'}`} />
                 <span className="text-white font-medium">Public Job Board</span>
               </div>
               <p className="text-xs text-gray-500">Available to all candidates and external job boards like Indeed and LinkedIn.</p>
            </label>

            <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${watchAllFields.visibility === 'internal' ? 'bg-blue-600/10 border-blue-600' : 'bg-gray-900 border-gray-700'}`}>
               <input {...register('visibility')} type="radio" value="internal" className="sr-only" />
               <div className="flex items-center mb-2">
                 <Building2 className={`w-5 h-5 mr-2 ${watchAllFields.visibility === 'internal' ? 'text-blue-400' : 'text-gray-400'}`} />
                 <span className="text-white font-medium">Internal Only</span>
               </div>
               <p className="text-xs text-gray-500">Only visible to current company employees.</p>
            </label>
         </div>

         <div className="mt-6 pt-6 border-t border-gray-700">
           <label className="flex items-center space-x-3 cursor-pointer">
             <input type="checkbox" {...register('acceptedTerms')} className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 bg-gray-900" />
             <span className="text-sm text-gray-400">
               I confirm that I have reviewed the job posting details and agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>.
             </span>
           </label>
           {errors.acceptedTerms && <p className="text-red-400 text-xs mt-1 ml-8">{errors.acceptedTerms.message}</p>}
         </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
          {/* Header */}
          <div>
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-white">Create New Job</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
            <p className="text-gray-400">Reach top talent through our global network.</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-4 z-20 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-400 font-medium">
                Step {currentStep} of {totalSteps}: 
                {currentStep === 1 && ' Job Details'}
                {currentStep === 2 && ' Requirements'}
                {currentStep === 3 && ' Compensation'}
                {currentStep === 4 && ' Review & Publish'}
              </span>
              <span className="text-gray-500 text-sm hidden md:inline">
                {currentStep < totalSteps ? `Next: ${currentStep === 1 ? 'Requirements' : currentStep === 2 ? 'Compensation' : 'Review'}` : 'Finish'}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              
              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg sticky bottom-4 border border-gray-800 shadow-2xl z-20">
                 {currentStep > 1 ? (
                   <button 
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-800 flex items-center transition-colors"
                    >
                     <ChevronLeft className="w-4 h-4 mr-2" />
                     Back
                   </button>
                 ) : (
                    <button 
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 text-gray-400 font-medium hover:text-white"
                    >
                     Cancel
                   </button>
                 )}

                 <div className="flex gap-4">
                   {currentStep < totalSteps ? (
                     <button 
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] flex items-center"
                      >
                       Next Step
                       <ChevronRight className="w-4 h-4 ml-2" />
                     </button>
                   ) : (
                     <button 
                        type="submit"
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] flex items-center"
                      >
                       Publish Job
                       <CheckCircle2 className="w-4 h-4 ml-2" />
                     </button>
                   )}
                 </div>
              </div>
            </form>

            {/* Live Preview Section */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-white font-bold flex items-center">
                     <Monitor className="w-4 h-4 mr-2 text-blue-400" />
                     Live Preview
                   </h3>
                   <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded font-medium border border-green-500/20">
                     {currentStep === 4 ? 'CANDIDATE VIEW' : 'PUBLIC VIEW'}
                   </span>
                 </div>

                 {/* Job Card Preview */}
                 <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-500">
                   {/* Banner */}
                   <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                     <div className="absolute -bottom-6 left-8">
                       <div className="w-16 h-16 bg-white rounded-xl shadow-md p-2 flex items-center justify-center">
                         <span className="text-2xl font-bold text-blue-600">L</span>
                       </div>
                     </div>
                   </div>

                   <div className="pt-10 px-8 pb-8">
                     <div className="flex justify-between items-start">
                       <div>
                         <h2 className="text-2xl font-bold text-gray-900">
                           {watchAllFields.title || 'Job Title'}
                         </h2>
                         <p className="text-blue-600 font-medium mt-1">JobBoard Global Inc.</p>
                       </div>
                       {watchAllFields.locationType && (
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                           {watchAllFields.locationType}
                         </span>
                       )}
                     </div>

                     <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                       <div className="flex items-center">
                         <MapPin className="w-4 h-4 mr-2" />
                         {watchAllFields.location || 'Location'}
                       </div>
                       <div className="flex items-center">
                         <Briefcase className="w-4 h-4 mr-2" />
                         {/* Show work schedule if set, else 'Full-time' as placeholder */}
                         {watchAllFields.workSchedule ? <span className="capitalize">{watchAllFields.workSchedule.replace('-', ' ')}</span> : 'Full-time'}
                       </div>
                     </div>
                     
                     {/* Dynamic Salary Preview (Shows in Step 3+) */}
                     {(currentStep >= 3 || (watchAllFields.salaryMin && watchAllFields.salaryMax)) && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                           <div>
                              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Estimated Salary</p>
                              <p className="text-xl font-bold text-gray-900">
                                {watchAllFields.salaryMin ? `$${parseInt(watchAllFields.salaryMin).toLocaleString()}` : '$0'} - 
                                {watchAllFields.salaryMax ? `$${parseInt(watchAllFields.salaryMax).toLocaleString()}` : '$0'}
                              </p>
                           </div>
                           <DollarSign className="w-8 h-8 text-blue-200" />
                        </div>
                     )}

                     {/* Requirements Preview (Step 2+) */}
                     {currentStep >= 2 && (
                       <div className="mt-8 pt-6 border-t border-gray-100">
                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Requirements</h3>
                         <ul className="space-y-2 mb-4">
                           <li className="flex items-start text-sm text-gray-600">
                             <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                             <span className="font-semibold mr-1">Experience:</span> {watchAllFields.experienceLevel || 'Not specified'}
                           </li>
                           <li className="flex items-start text-sm text-gray-600">
                             <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                             <span className="font-semibold mr-1">Education:</span> {watchAllFields.education || 'Not specified'}
                           </li>
                         </ul>
                         
                         {watchAllFields.skills && watchAllFields.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {watchAllFields.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                         )}
                       </div>
                     )}

                     <div className="mt-8 border-t pt-8">
                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">About the role</h3>
                       <div className="prose prose-sm text-gray-600">
                         {watchAllFields.description ? (
                           <p className="whitespace-pre-line line-clamp-6">{watchAllFields.description}</p>
                         ) : (
                           <div className="space-y-2 opacity-30">
                             <div className="h-2 bg-gray-200 rounded w-full"></div>
                             <div className="h-2 bg-gray-200 rounded w-full"></div>
                             <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                           </div>
                         )}
                       </div>
                     </div>
                      
                      <div className="mt-8">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                          {currentStep === 4 ? 'Apply Now (Preview)' : 'Apply Now'}
                        </button>
                      </div>

                   </div>
                 </div>

                 {/* Help Box */}
                 <div className="mt-6 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex items-start">
                   <div className="p-2 bg-blue-600/10 rounded-lg mr-4">
                     <Globe className="w-5 h-5 text-blue-400" />
                   </div>
                   <div>
                     <h4 className="text-white font-medium text-sm">Smart Distribution</h4>
                     <p className="text-gray-400 text-xs mt-1">
                       Your job will be cross-posted to 15+ external job boards via our RapidAPI network integration.
                     </p>
                   </div>
                 </div>

              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
