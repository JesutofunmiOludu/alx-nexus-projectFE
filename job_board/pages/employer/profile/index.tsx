
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { companyService } from '@/api/services';
import { CreateCompanyData } from '@/types';
import toast from 'react-hot-toast';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Upload, 
  Save, 
  Users, 
  Briefcase 
} from 'lucide-react';

// Validation Schema
const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  industry: z.string().optional(),
  company_size: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Company Data
  const { data: company, isLoading } = useQuery({
    queryKey: ['my-company'],
    queryFn: () => companyService.getMyCompany(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  // Reset form when data loads
  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        description: company.description || '',
        website: company.website || '',
        location: company.location || '',
        industry: company.industry || '',
        company_size: company.company_size || '',
      });
    }
  }, [company, reset]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: CompanyFormData) => {
      // @ts-ignore - mock ID usage
      return companyService.updateCompany(company?.id || 'mock-id', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Company profile updated successfully');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const onSubmit = (data: CompanyFormData) => {
    updateMutation.mutate(data);
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
              <p className="text-gray-400">Manage your company branding and details</p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            {/* Cover Image Placeholder */}
            <div className="h-32 bg-gradient-to-r from-blue-900 to-gray-900 relative">
               {isEditing && (
                 <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors">
                   <Upload className="w-4 h-4" />
                 </button>
               )}
            </div>

            <div className="p-8 relative">
              {/* Logo */}
              <div className="absolute -top-16 left-8">
                <div className="w-32 h-32 rounded-xl bg-gray-900 border-4 border-gray-800 overflow-hidden shadow-xl flex items-center justify-center relative group">
                  {company?.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-600" />
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-16">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-400">Company Name</label>
                       {isEditing ? (
                         <>
                           <input 
                             {...register('name')}
                             className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                           />
                           {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                         </>
                       ) : (
                         <p className="text-xl font-bold text-white">{company?.name}</p>
                       )}
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-400">Industry</label>
                       {isEditing ? (
                         <input 
                           {...register('industry')}
                           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                           placeholder="e.g. Technology, Healthcare"
                         />
                       ) : (
                         <p className="text-white flex items-center">
                           <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                           {company?.industry || 'Not specified'}
                         </p>
                       )}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-400">Website</label>
                       {isEditing ? (
                         <>
                           <input 
                             {...register('website')}
                             className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                             placeholder="https://example.com"
                           />
                           {errors.website && <p className="text-red-400 text-xs">{errors.website.message}</p>}
                         </>
                       ) : (
                         <a href={company?.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
                           <Globe className="w-4 h-4 mr-2" />
                           {company?.website || 'Not provided'}
                         </a>
                       )}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-400">Location</label>
                       {isEditing ? (
                         <input 
                           {...register('location')}
                           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                         />
                       ) : (
                         <p className="text-white flex items-center">
                           <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                           {company?.location}
                         </p>
                       )}
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-400">Company Size</label>
                       {isEditing ? (
                         <select 
                           {...register('company_size')}
                           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                         >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="50-200">50-200 employees</option>
                            <option value="200-500">200-500 employees</option>
                            <option value="500+">500+ employees</option>
                         </select>
                       ) : (
                         <p className="text-white flex items-center">
                           <Users className="w-4 h-4 mr-2 text-gray-500" />
                           {company?.company_size || 'Not specified'}
                         </p>
                       )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">About Company</label>
                    {isEditing ? (
                      <textarea 
                        {...register('description')}
                        rows={6}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {company?.description || 'No description provided.'}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 pt-4 border-t border-gray-700">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditing(false);
                          reset();
                        }}
                        className="px-6 py-2.5 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-blue-900/20"
                      >
                        {updateMutation.isPending ? 'Saving...' : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </form>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
