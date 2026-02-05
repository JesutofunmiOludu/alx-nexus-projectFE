// API Services for Job Board

import { rapidAPIClient } from './rapidapi-client';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  Job,
  JobSearchParams,
  CreateJobData,
  Application,
  CreateApplicationData,
  ApplicationStatusUpdate,
  FreelancerProfile,
  Company,
  CreateCompanyData,
  PaginatedResponse,
} from '@/types';

// ============================================
// Authentication Service
// ============================================

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return rapidAPIClient.post('/auth/login/', credentials);
  }

  async register(data: RegisterData): Promise<User> {
    return rapidAPIClient.post('/auth/register/', data);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return rapidAPIClient.post('/auth/refresh/', { refresh: refreshToken });
  }

  async logout(): Promise<void> {
    return rapidAPIClient.post('/auth/logout/');
  }

  async getCurrentUser(): Promise<User> {
    return rapidAPIClient.get('/auth/me/');
  }
}

// ============================================
// Job Service
// ============================================

export class JobService {
  async searchJobs(params: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return rapidAPIClient.get('/jobs/', params);
  }

  async getJob(id: string): Promise<Job> {
    return rapidAPIClient.get(`/jobs/${id}/`);
  }

  async createJob(data: CreateJobData): Promise<Job> {
    return rapidAPIClient.post('/jobs/', data);
  }

  async updateJob(id: string, data: Partial<CreateJobData>): Promise<Job> {
    return rapidAPIClient.put(`/jobs/${id}/`, data);
  }

  async deleteJob(id: string): Promise<void> {
    return rapidAPIClient.delete(`/jobs/${id}/`);
  }

  async getMyJobs(params?: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return rapidAPIClient.get('/jobs/my-jobs/', params);
  }

  async getSavedJobs(params?: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return rapidAPIClient.get('/jobs/saved/', params);
  }

  async saveJob(jobId: string): Promise<void> {
    return rapidAPIClient.post(`/jobs/${jobId}/save/`);
  }

  async unsaveJob(jobId: string): Promise<void> {
    return rapidAPIClient.delete(`/jobs/${jobId}/save/`);
  }
}

// ============================================
// Application Service
// ============================================

export class ApplicationService {
  async getApplications(params?: any): Promise<PaginatedResponse<Application>> {
    return rapidAPIClient.get('/applications/', params);
  }

  async getApplication(id: string): Promise<Application> {
    return rapidAPIClient.get(`/applications/${id}/`);
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('cover_letter', data.cover_letter);
    if (data.resume) {
      formData.append('resume', data.resume);
    }
    return rapidAPIClient.post('/applications/', formData);
  }

  async updateApplicationStatus(
    id: string,
    data: ApplicationStatusUpdate
  ): Promise<Application> {
    return rapidAPIClient.patch(`/applications/${id}/`, data);
  }

  async getMyApplications(params?: any): Promise<PaginatedResponse<Application>> {
    return rapidAPIClient.get('/applications/my-applications/', params);
  }

  async getJobApplications(jobId: string, params?: any): Promise<PaginatedResponse<Application>> {
    return rapidAPIClient.get(`/jobs/${jobId}/applications/`, params);
  }
}

// ============================================
// Profile Service
// ============================================

export class ProfileService {
  async getProfile(userId: string): Promise<FreelancerProfile> {
    return rapidAPIClient.get(`/profiles/${userId}/`);
  }

  async updateProfile(userId: string, data: Partial<FreelancerProfile>): Promise<FreelancerProfile> {
    return rapidAPIClient.put(`/profiles/${userId}/`, data);
  }

  async getMyProfile(): Promise<FreelancerProfile> {
    return rapidAPIClient.get('/profiles/me/');
  }
}

// ============================================
// Company Service
// ============================================

export class CompanyService {
  async getCompanies(params?: any): Promise<PaginatedResponse<Company>> {
    return rapidAPIClient.get('/companies/', params);
  }

  async getCompany(id: string): Promise<Company> {
    return rapidAPIClient.get(`/companies/${id}/`);
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    return rapidAPIClient.post('/companies/', data);
  }

  async updateCompany(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    return rapidAPIClient.put(`/companies/${id}/`, data);
  }

  async getMyCompany(): Promise<Company> {
    return rapidAPIClient.get('/companies/me/');
  }
}

// Export service instances
export const authService = new AuthService();
export const jobService = new JobService();
export const applicationService = new ApplicationService();
export const profileService = new ProfileService();
export const companyService = new CompanyService();
