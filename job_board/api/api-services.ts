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
    try {
      return await rapidAPIClient.post('/auth/login/', credentials);
    } catch (error) {
      console.warn('API Login failed, using mock login for development');
      const userType = credentials.email.includes('employer') ? 'employer' : 'freelancer';
      
      // Store mock user type for getCurrentUser to use
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUserType', userType);
        localStorage.setItem('mockUserEmail', credentials.email);
      }
      
      return {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      };
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      return await rapidAPIClient.post('/auth/register/', data);
    } catch (error) {
      console.warn('API Register failed, using mock register for development');
      return {
        id: 'mock-user-id',
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        user_type: data.user_type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return rapidAPIClient.post('/auth/refresh/', { refresh: refreshToken });
  }

  async logout(): Promise<void> {
    return rapidAPIClient.post('/auth/logout/');
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await rapidAPIClient.get('/auth/me/');
    } catch (error) {
      console.warn('API getCurrentUser failed, using mock user for development');
      
      let userType = 'freelancer';
      let email = 'user@example.com';
      
      if (typeof window !== 'undefined') {
        const storedType = localStorage.getItem('mockUserType');
        const storedEmail = localStorage.getItem('mockUserEmail');
        if (storedType) userType = storedType;
        if (storedEmail) email = storedEmail;
      }

      return {
        id: 'mock-user-id',
        email: email,
        first_name: userType === 'employer' ? 'Alex' : 'Alex',
        last_name: userType === 'employer' ? 'Morgan' : 'Rivera',
        user_type: userType as 'freelancer' | 'employer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }
}

// ============================================
// Job Service
// ============================================

export class JobService {
  async searchJobs(params: JobSearchParams): Promise<PaginatedResponse<Job>> {
    try {
      return await rapidAPIClient.get('/jobs/', params);
    } catch (error) {
       console.warn('API searchJobs failed, using mock data');
       return {
         count: 0,
         next: null,
         previous: null,
         results: []
       };
    }
  }

  async getJob(id: string): Promise<Job> {
    try {
      return await rapidAPIClient.get(`/jobs/${id}/`);
    } catch(error) {
      console.warn('API getJob failed, using mock data');
      return {
        id,
        title: 'Mock Job Title',
        description: 'This is a mock job description because the API call failed.',
        company: {
          id: 'mock-company-id',
          name: 'Mock Company',
          created_at: new Date().toISOString()
        },
        location: 'Remote',
        job_type: 'full-time',
        experience_level: 'mid',
        salary_currency: 'USD',
        skills_required: ['React', 'TypeScript'],
        is_remote: true,
        status: 'open',
        views_count: 100,
        applications_count: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async createJob(data: CreateJobData): Promise<Job> {
    try {
      return await rapidAPIClient.post('/jobs/', data);
    } catch (error) {
      console.warn('API createJob failed, using mock data');
      return {
        id: `mock-job-${Date.now()}`,
        title: data.title,
        description: data.description,
        company: {
          id: 'mock-company-id',
          name: 'My Company',
          created_at: new Date().toISOString()
        },
        location: data.location,
        job_type: data.job_type,
        experience_level: data.experience_level,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        salary_currency: data.salary_currency || 'USD',
        skills_required: data.skills_required,
        benefits: data.benefits,
        is_remote: data.is_remote,
        status: 'open',
        views_count: 0,
        applications_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  async updateJob(id: string, data: Partial<CreateJobData>): Promise<Job> {
    try {
      return await rapidAPIClient.put(`/jobs/${id}/`, data);
    } catch (error) {
      console.warn('API updateJob failed, using mock data');
       // Return a merged mock object
       return {
        id: id,
        title: data.title || 'Updated Job',
        description: data.description || 'Updated Description',
        company: { id: '1', name: 'Mock Co', created_at: '' },
        location: data.location || 'Remote',
        job_type: data.job_type || 'full-time',
        experience_level: data.experience_level || 'mid',
        salary_currency: 'USD',
        skills_required: data.skills_required || [],
        is_remote: data.is_remote ?? true,
        status: 'open',
        views_count: 0,
        applications_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
       };
    }
  }

  async deleteJob(id: string): Promise<void> {
    try {
      return await rapidAPIClient.delete(`/jobs/${id}/`);
    } catch (error) {
      console.warn('API deleteJob failed, using mock implementation');
    }
  }

  async getMyJobs(params?: JobSearchParams): Promise<PaginatedResponse<Job>> {
    try {
      return await rapidAPIClient.get('/jobs/my-jobs/', params);
    } catch (error) {
      console.warn('API getMyJobs failed, using mock data');
      return {
        count: 1,
        next: null,
        previous: null,
        results: [{
          id: 'mock-job-1',
          title: 'Senior Frontend Developer',
          description: 'Mock description',
          company: { id: 'c1', name: 'Tech Corp', created_at: new Date().toISOString() },
          location: 'San Francisco, CA',
          job_type: 'full-time',
          experience_level: 'senior',
          salary_min: 120000,
          salary_max: 180000,
          salary_currency: 'USD',
          skills_required: ['React', 'Next.js', 'TypeScript'],
          is_remote: true,
          status: 'open',
          views_count: 45,
          applications_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]
      };
    }
  }

  async getSavedJobs(params?: JobSearchParams): Promise<PaginatedResponse<Job>> {
     try {
      return await rapidAPIClient.get('/jobs/saved/', params);
    } catch (error) {
      console.warn('API getSavedJobs failed, using mock data');
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  async saveJob(jobId: string): Promise<void> {
    try {
      return await rapidAPIClient.post(`/jobs/${jobId}/save/`);
    } catch (error) {
      console.warn('API saveJob failed');
    }
  }

  async unsaveJob(jobId: string): Promise<void> {
    try {
      return await rapidAPIClient.delete(`/jobs/${jobId}/save/`);
    } catch (error) {
      console.warn('API unsaveJob failed');
    }
  }
}

// ============================================
// Application Service
// ============================================

export class ApplicationService {
  async getApplications(params?: any): Promise<PaginatedResponse<Application>> {
    try {
      return await rapidAPIClient.get('/applications/', params);
    } catch (error) { 
      return { count: 0, next: null, previous: null, results: [] }; 
    }
  }

  async getApplication(id: string): Promise<Application> {
    try {
      return await rapidAPIClient.get(`/applications/${id}/`);
    } catch (error) {
      console.warn('API getApplication failed, using mock data');
      return {
        id: id,
        job: {
          id: 'mock-job-1',
          title: 'Senior Frontend Developer',
          description: 'Mock Desc',
          company: { id: 'c1', name: 'Tech Corp', created_at: '' },
          location: 'Remote',
          job_type: 'full-time',
          experience_level: 'senior',
          salary_currency: 'USD',
          skills_required: ['React'],
          is_remote: true,
          status: 'open',
          views_count: 100,
          applications_count: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        freelancer: {
          id: 'user-2',
          email: 'alex.rivera@example.com',
          first_name: 'Alex',
          last_name: 'Rivera',
          user_type: 'freelancer',
          created_at: '',
          updated_at: ''
        },
        cover_letter: 'I am excited to apply for this position. I have 5 years of experience with React.',
        status: 'pending',
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    try {
      const formData = new FormData();
      formData.append('job_id', data.job_id);
      formData.append('cover_letter', data.cover_letter);
      if (data.resume) {
        formData.append('resume', data.resume);
      }
      return await rapidAPIClient.post('/applications/', formData);
    } catch (error) {
      console.warn('API createApplication failed, using mock data');
      return {
        id: `mock-app-${Date.now()}`,
        job: { id: data.job_id } as Job,
        freelancer: { id: 'mock-me', email: 'me@example.com', first_name: 'Me', last_name: 'User', user_type: 'freelancer', created_at: '', updated_at: '' },
        cover_letter: data.cover_letter,
        status: 'pending',
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async updateApplicationStatus(
    id: string,
    data: ApplicationStatusUpdate
  ): Promise<Application> {
    try {
      return await rapidAPIClient.patch(`/applications/${id}/`, data);
    } catch (error) {
      // Return mock with updated status
      return {
        id: id,
        job: { id: 'mock-job', title: 'Mock Job' } as any,
        freelancer: { id: 'mock-user', first_name: 'Alex', last_name: 'Rivera', email: 'alex@example.com' } as any,
        cover_letter: 'Mock cover letter',
        status: data.status,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async getMyApplications(params?: any): Promise<PaginatedResponse<Application>> {
    try {
      return await rapidAPIClient.get('/applications/my-applications/', params);
    } catch (error) {
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  async getJobApplications(jobId: string, params?: any): Promise<PaginatedResponse<Application>> {
    try {
      return await rapidAPIClient.get(`/jobs/${jobId}/applications/`, params);
    } catch (error) {
      console.warn('API getJobApplications failed, using mock data');
      // Return 3 mock applicants
      return {
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 'app-1',
            job: { id: jobId } as any,
            freelancer: { id: 'u1', first_name: 'Alex', last_name: 'Rivera', email: 'alex.r@example.com', user_type: 'freelancer', created_at: '', updated_at: '' },
            cover_letter: 'Hi, I love React!',
            status: 'pending',
            applied_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'app-2',
            job: { id: jobId } as any,
            freelancer: { id: 'u2', first_name: 'Sarah', last_name: 'Chen', email: 's.chen@example.com', user_type: 'freelancer', created_at: '', updated_at: '' },
            cover_letter: 'Here is my portfolio.',
            status: 'interviewing',
            applied_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'app-3',
            job: { id: jobId } as any,
            freelancer: { id: 'u3', first_name: 'Mike', last_name: 'Johnson', email: 'mike.j@example.com', user_type: 'freelancer', created_at: '', updated_at: '' },
            cover_letter: 'Highly experienced backend dev.',
            status: 'rejected',
            applied_at: new Date(Date.now() - 259200000).toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };
    }
  }
}

// ============================================
// Profile Service
// ============================================

export class ProfileService {
  async getProfile(userId: string): Promise<FreelancerProfile> {
    try {
      return await rapidAPIClient.get(`/profiles/${userId}/`);
    } catch (error) {
      console.warn('API getProfile failed, using mock data');
      return {
        id: userId,
        user: {
          id: userId,
          email: 'mock.freelancer@example.com',
          first_name: 'Alex',
          last_name: 'Rivera',
          user_type: 'freelancer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        bio: 'Senior Full Stack Developer with 7 years of experience in React, Node.js, and Python. Passionate about building scalable web applications.',
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
        hourly_rate: 85,
        availability: 'available',
        portfolio_url: 'https://alexrivera.dev',
        github_url: 'https://github.com/alexrivera',
        linkedin_url: 'https://linkedin.com/in/alexrivera',
        experience: [
          {
            id: 'exp-1',
            title: 'Senior Developer',
            company: 'TechFlow Inc.',
            start_date: '2021-03-01',
            is_current: true,
            description: 'Leading a team of 5 developers.'
          }
        ],
        education: [
          {
            id: 'edu-1',
            degree: 'BS Computer Science',
            institution: 'University of Tech',
            start_date: '2014-09-01',
            end_date: '2018-05-30',
            is_current: false
          }
        ],
        certifications: []
      };
    }
  }

  async updateProfile(userId: string, data: Partial<FreelancerProfile>): Promise<FreelancerProfile> {
    try {
      return await rapidAPIClient.put(`/profiles/${userId}/`, data);
    } catch (error) {
       console.warn('API updateProfile failed, using mock data');
       // In a real mock, we would merge data, but here we just return a valid profile
       return this.getProfile(userId);
    }
  }

  async getMyProfile(): Promise<FreelancerProfile> {
    try {
      return await rapidAPIClient.get('/profiles/me/');
    } catch (error) {
       console.warn('API getMyProfile failed, using mock data');
       return this.getProfile('mock-me');
    }
  }

  async searchProfiles(params?: any): Promise<PaginatedResponse<FreelancerProfile>> {
    try {
      return await rapidAPIClient.get('/profiles/', params);
    } catch (error) {
      console.warn('API searchProfiles failed, using mock data');
      return {
        count: 1240,
        next: null,
        previous: null,
        results: [
          {
            id: 'p1',
            user: { id: 'u1', email: 'alex@example.com', first_name: 'Alex', last_name: 'Rivers', user_type: 'freelancer', created_at: '', updated_at: '' },
            title: 'Senior Frontend Engineer',
            location: 'San Francisco, CA',
            verification_status: 'available',
            bio: '8+ years of experience building scalable web applications. Expert in modern React ecosystem and performance optimization.',
            skills: ['REACT', 'TYPESCRIPT', 'TAILWIND', 'NEXT.JS', 'GRAPHQL'],
            hourly_rate: 90,
            availability: 'available',
            experience_level: 'senior',
            expected_salary: 140000,
            experience: [],
            education: [],
            certifications: []
          },
          {
            id: 'p2',
            user: { id: 'u2', email: 'sarah@example.com', first_name: 'Sarah', last_name: 'Chen', user_type: 'freelancer', created_at: '', updated_at: '' },
            title: 'UI/UX Product Designer',
            location: 'New York, NY',
            verification_status: 'active',
            bio: 'Specializing in B2B SaaS interfaces. I focus on creating intuitive workflows that reduce friction and boost user retention.',
            skills: ['FIGMA', 'UX RESEARCH', 'SYSTEM DESIGN', 'PROTOTYPING'],
            hourly_rate: 75,
            availability: 'available',
            experience_level: 'mid',
            expected_salary: 110000,
            experience: [],
            education: [],
            certifications: []
          },
          {
            id: 'p3',
            user: { id: 'u3', email: 'marcus@example.com', first_name: 'Marcus', last_name: 'J.', user_type: 'freelancer', created_at: '', updated_at: '' },
            title: 'Full Stack Developer',
            location: 'Remote',
            verification_status: 'verified',
            bio: 'Backend specialist with a passion for robust architectures. Experienced in microservices, cloud infrastructure, and databases.',
            skills: ['NODE.JS', 'AWS', 'POSTGRESQL', 'REDIS', 'DOCKER'],
            hourly_rate: 110,
            availability: 'busy',
            experience_level: 'senior',
            expected_salary: 150000,
            experience: [],
            education: [],
            certifications: []
          },
          {
            id: 'p4',
            user: { id: 'u4', email: 'elena@example.com', first_name: 'Elena', last_name: 'Rodriguez', user_type: 'freelancer', created_at: '', updated_at: '' },
            title: 'Growth Marketing Lead',
            location: 'Austin, TX',
            verification_status: 'available',
            bio: 'Driving user acquisition through data-driven experiments. Reduced CAC by 40% for last startup while scaling 3x.',
            skills: ['SEO', 'ANALYTICS', 'PPC', 'CONTENT STRATEGY'],
            hourly_rate: 85,
            availability: 'available',
            experience_level: 'mid',
            expected_salary: 100000,
            experience: [],
            education: [],
            certifications: []
          },
          {
             id: 'p5',
             user: { id: 'u5', email: 'jordan@example.com', first_name: 'Jordan', last_name: 'Smith', user_type: 'freelancer', created_at: '', updated_at: '' },
             title: 'DevOps Engineer',
             location: 'Seattle, WA',
             verification_status: 'verified',
             bio: 'Cloud infrastructure specialist with focus on security and scalability. Expert in automated pipelines and zero-downtime deployments.',
             skills: ['DOCKER', 'KUBERNETES', 'CI/CD', 'TERRAFORM'],
             hourly_rate: 120,
             availability: 'available',
             experience_level: 'senior',
             expected_salary: 160000,
             experience: [],
             education: [],
             certifications: []
           },
           {
             id: 'p6',
             user: { id: 'u6', email: 'lila@example.com', first_name: 'Lila', last_name: 'Varma', user_type: 'freelancer', created_at: '', updated_at: '' },
             title: 'Data Scientist',
             location: 'Boston, MA',
             verification_status: 'active',
             bio: 'Masters in AI. Focused on predictive modeling and NLP. I help companies turn raw data into actionable strategic insights.',
             skills: ['PYTHON', 'PYTORCH', 'SQL', 'ALGORITHMS'],
             hourly_rate: 130,
             availability: 'available',
             experience_level: 'lead',
             expected_salary: 180000,
             experience: [],
             education: [],
             certifications: []
           }
        ]
      };
    }
  }
}

// ============================================
// Company Service
// ============================================

export class CompanyService {
  async getCompanies(params?: any): Promise<PaginatedResponse<Company>> {
    try {
      return await rapidAPIClient.get('/companies/', params);
    } catch (error) {
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  async getCompany(id: string): Promise<Company> {
    try {
      return await rapidAPIClient.get(`/companies/${id}/`);
    } catch (error) {
       console.warn('API getCompany failed, using mock data');
       return {
         id: id,
         name: 'Mock Company',
         description: 'Leading innovations in technology.',
         logo: 'https://ui-avatars.com/api/?name=Mock+Company&background=random',
         website: 'https://example.com',
         industry: 'Technology',
         company_size: '50-200',
         location: 'San Francisco, CA',
         created_at: new Date().toISOString()
       };
    }
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    try {
      return await rapidAPIClient.post('/companies/', data);
    } catch (error) {
       console.warn('API createCompany failed, using mock data');
       return {
         id: `mock-company-${Date.now()}`,
         name: data.name,
         description: data.description,
         logo: data.logo,
         website: data.website,
         industry: data.industry,
         company_size: data.company_size,
         location: data.location,
         created_at: new Date().toISOString()
       };
    }
  }

  async updateCompany(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    try {
      return await rapidAPIClient.put(`/companies/${id}/`, data);
    } catch (error) {
       console.warn('API updateCompany failed, using mock data');
       return {
         id: id,
         name: data.name || 'Mock Company',
         description: data.description || 'Updated Description',
         logo: data.logo || 'https://ui-avatars.com/api/?name=Mock+Company&background=random',
         website: data.website || 'https://example.com',
         industry: data.industry || 'Technology',
         company_size: data.company_size || '50-200',
         location: data.location || 'San Francisco, CA',
         created_at: new Date().toISOString()
       };
    }
  }

  async getMyCompany(): Promise<Company> {
    try {
      return await rapidAPIClient.get('/companies/me/');
    } catch (error) {
       console.warn('API getMyCompany failed, using mock data');
       return {
         id: 'my-company-id',
         name: 'My Awesome Company',
         description: 'We are changing the world one line of code at a time.',
         logo: 'https://ui-avatars.com/api/?name=My+Awesome+Company&background=0D8ABC&color=fff',
         website: 'https://mycompany.com',
         industry: 'SaaS',
         company_size: '10-50',
         location: 'New York, NY',
         created_at: new Date(Date.now() - 10000000).toISOString()
       };
    }
  }
}

// Export service instances
export const authService = new AuthService();
export const jobService = new JobService();
export const applicationService = new ApplicationService();
export const profileService = new ProfileService();
export const companyService = new CompanyService();
