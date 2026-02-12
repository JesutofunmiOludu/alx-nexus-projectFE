// TypeScript Type Definitions for Job Board Application

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'freelancer' | 'employer';
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  user_type: 'freelancer' | 'employer';
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

// ============================================
// Job Types
// ============================================

// Core Job interface (Unified model)
export interface Job {
  id: string;
  uuid?: string;
  title: string;
  description: string;
  company: Company;
  location: string;
  location_details?: {
    city?: string;
    region?: string;
    country?: string;
    remote?: boolean;
    latitude?: string;
    longitude?: string;
  };
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | string;
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  skills_required: string[];
  benefits?: string[];
  application_deadline?: string;
  is_remote: boolean;
  status: 'open' | 'closed' | 'draft' | string;
  views_count: number;
  applications_count: number;
  posted_by: string;
  created_at: string;
  updated_at: string;
  // SmartRecruiters specific
  ref?: string;
  applyUrl?: string;
  jobAd?: {
    sections: {
      companyDescription?: { title: string; text: string };
      jobDescription?: { title: string; text: string };
      qualifications?: { title: string; text: string };
      additionalInformation?: { title: string; text: string };
    };
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  skills_required: string[];
  benefits?: string[];
  application_deadline?: string;
  is_remote: boolean;
}

export interface JobSearchParams {
  q?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  is_remote?: boolean;
  salary_min?: number;
  salary_max?: number;
  page?: number;
  page_size?: number;
}

// ============================================
// Company Types
// ============================================

export interface Company {
  id: string;
  identifier?: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
}

// ============================================
// Application Types
// ============================================

export interface Application {
  id: string;
  job: Job;
  freelancer: User;
  cover_letter: string;
  resume?: string;
  status: 'pending' | 'reviewing' | 'interviewing' | 'offer' | 'rejected' | 'accepted';
  applied_at: string;
  updated_at: string;
}

export interface CreateApplicationData {
  job_id: string;
  cover_letter: string;
  resume?: File;
}

export interface ApplicationStatusUpdate {
  status: 'pending' | 'reviewing' | 'interviewing' | 'offer' | 'rejected' | 'accepted';
}

// ============================================
// Profile Types
// ============================================

export interface FreelancerProfile {
  id: string;
  user: User;
  title?: string;
  bio?: string;
  location?: string;
  skills: string[];
  hourly_rate?: number;
  expected_salary?: number;
  experience_level?: 'entry' | 'mid' | 'senior' | 'lead';
  availability: 'available' | 'busy' | 'not_available';
  verification_status?: 'verified' | 'active' | 'none';
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

export interface Certification {
  id?: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginatedResponse<T> {
  count: number;
  totalFound?: number; // SmartRecruiters uses this
  limit?: number;
  offset?: number;
  next: string | null;
  previous: string | null;
  results: T[];
  content?: T[]; // SmartRecruiters uses this
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsSummary {
  total_job_views: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  applications_received: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  conversion_rate: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  avg_time_to_hire: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface ChartDataPoint {
  date: string;
  views: number;
  applications: number;
}

export interface CategoryDataPoint {
  category: string;
  count: number;
}

export interface TopJobPost {
  id: string;
  title: string;
  department: string;
  views: number;
  applications: number;
  conversion_rate: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  chart_data: ChartDataPoint[];
  category_data: CategoryDataPoint[];
  top_jobs: TopJobPost[];
}

// ============================================
// Notification Types
// ============================================

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'job';
  timestamp: string;
  is_read: boolean;
  link?: string;
  category: 'application' | 'message' | 'system' | 'job';
}

// ============================================
// UI State Types
// ============================================

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// ============================================
// Filter & Sort Types
// ============================================

export interface FilterOptions {
  jobTypes: string[];
  experienceLevels: string[];
  locations: string[];
  isRemote?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}
