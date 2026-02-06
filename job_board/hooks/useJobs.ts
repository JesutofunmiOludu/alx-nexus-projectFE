import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/api/services';
import type { JobSearchParams, CreateJobData } from '@/types';
import toast from 'react-hot-toast';
import { getMockJobs, getMockJob } from '@/lib/mockData';

// Hook to search/fetch jobs
export function useJobs(params: JobSearchParams = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      try {
        return await jobService.searchJobs(params);
      } catch (error) {
        // Use mock data if API fails (for development)
        console.warn('Using mock data - API not configured');
        return getMockJobs(params);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single job
export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      try {
        return await jobService.getJob(id);
      } catch (error) {
        // Use mock data if API fails (for development)
        console.warn('Using mock data - API not configured');
        return getMockJob(id);
      }
    },
    enabled: !!id,
  });
}

// Hook to get user's posted jobs (for employers)
export function useMyJobs(params: JobSearchParams = {}) {
  return useQuery({
    queryKey: ['jobs', 'my-jobs', params],
    queryFn: () => jobService.getMyJobs(params),
  });
}

// Hook to get saved jobs
export function useSavedJobs(params: JobSearchParams = {}) {
  return useQuery({
    queryKey: ['jobs', 'saved', params],
    queryFn: () => jobService.getSavedJobs(params),
  });
}

// Hook to create a job
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobData) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create job';
      toast.error(message);
    },
  });
}

// Hook to update a job
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJobData> }) =>
      jobService.updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
      toast.success('Job updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update job';
      toast.error(message);
    },
  });
}

// Hook to delete a job
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete job';
      toast.error(message);
    },
  });
}

// Hook to save/bookmark a job
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', 'saved'] });
      toast.success('Job saved!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to save job';
      toast.error(message);
    },
  });
}

// Hook to unsave/unbookmark a job
export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', 'saved'] });
      toast.success('Job removed from saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to unsave job';
      toast.error(message);
    },
  });
}
