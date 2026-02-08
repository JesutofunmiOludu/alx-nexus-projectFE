// Mock data for testing without API

import { Job, PaginatedResponse, Company } from '@/types';

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechFlow Inc.',
    description: 'Leading tech company',
    website: 'https://techflow.com',
    logo: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'DataCorp',
    description: 'Data engineering experts',
    website: 'https://datacorp.com',
    logo: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'DesignHub',
    description: 'Creative design agency',
    website: 'https://designhub.com',
    logo: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    description: 'We are looking for a highly skilled Senior Frontend Engineer to join our growing product team. At TechFlow, you will be at the forefront of building modern web applications that serve millions of users. You will work closely with designers, product managers, and backend engineers to translate complex requirements into beautiful, functional, and performant user interfaces.',
    company: mockCompanies[0],
    location: 'San Francisco, CA',
    job_type: 'full-time',
    experience_level: 'senior',
    salary_min: 120000,
    salary_max: 160000,
    salary_currency: '$',
    is_remote: true,
    skills_required: ['React', 'TypeScript', 'Tailwind', 'GraphQL'],
    posted_by: '1',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Python Backend Developer',
    description: 'Join our data engineering team to build scalable APIs and data pipelines. Experience with high-load systems is a plus.',
    company: mockCompanies[1],
    location: 'New York, NY',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 100000,
    salary_max: 130000,
    salary_currency: '$',
    is_remote: false,
    skills_required: ['Python', 'Django', 'PostgreSQL'],
    posted_by: '2',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UI/UX Designer (Contract)',
    description: 'We need a talented designer to help us revamp our client\'s mobile application. 3-month contract with possibility of extension.',
    company: mockCompanies[2],
    location: 'Remote',
    job_type: 'contract',
    experience_level: 'mid',
    salary_min: 60000,
    salary_max: 80000,
    salary_currency: '$',
    is_remote: true,
    skills_required: ['Figma', 'Design System', 'Prototyping'],
    posted_by: '3',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps expert to manage our cloud infrastructure and improve CI/CD pipelines. Must have extensive AWS experience.',
    company: mockCompanies[1],
    location: 'Austin, TX',
    job_type: 'full-time',
    experience_level: 'senior',
    salary_min: 130000,
    salary_max: 170000,
    salary_currency: '$',
    is_remote: true,
    skills_required: ['AWS', 'Kubernetes', 'Terraform'],
    posted_by: '2',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Full Stack Developer',
    description: 'Join our startup as a full stack developer. You\'ll work on both frontend and backend, building features from scratch.',
    company: mockCompanies[0],
    location: 'Remote',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 90000,
    salary_max: 120000,
    salary_currency: '$',
    is_remote: true,
    skills_required: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    posted_by: '1',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Mobile Developer (React Native)',
    description: 'Build cross-platform mobile applications using React Native. Experience with native modules is a plus.',
    company: mockCompanies[0],
    location: 'Los Angeles, CA',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 100000,
    salary_max: 140000,
    salary_currency: '$',
    is_remote: false,
    skills_required: ['React Native', 'JavaScript', 'iOS', 'Android'],
    posted_by: '1',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getMockJobs(params: any = {}): PaginatedResponse<Job> {
  let filteredJobs = [...mockJobs];

  // Filter by search query
  if (params.q) {
    const query = params.q.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query)
    );
  }

  // Filter by location
  if (params.location) {
    const location = params.location.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(location)
    );
  }

  // Filter by job type
  if (params.job_type) {
    filteredJobs = filteredJobs.filter((job) => job.job_type === params.job_type);
  }

  // Filter by remote
  if (params.is_remote) {
    filteredJobs = filteredJobs.filter((job) => job.is_remote);
  }

  const page = params.page || 1;
  const pageSize = params.page_size || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    count: filteredJobs.length,
    next: end < filteredJobs.length ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    results: filteredJobs.slice(start, end),
  };
}

export function getMockJob(id: string): Job | null {
  return mockJobs.find((job) => job.id === id) || null;
}

// Mock Applications
import { Application, User } from '@/types';

const mockUser: User = {
  id: 'mock-user-id',
  email: 'alex@example.com',
  first_name: 'Alex',
  last_name: 'Rivera',
  user_type: 'freelancer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockApplications: Application[] = [
  {
    id: '1',
    job: mockJobs[3], // DevOps Engineer
    freelancer: mockUser,
    cover_letter: 'I am excited to apply...',
    status: 'offer',
    applied_at: '2023-10-20T10:00:00Z',
    updated_at: '2023-10-25T14:30:00Z',
  },
  {
    id: '2',
    job: mockJobs[0], // Senior Frontend Engineer
    freelancer: mockUser,
    cover_letter: 'Here is my application...',
    status: 'interviewing',
    applied_at: '2023-10-22T09:15:00Z',
    updated_at: '2023-10-24T11:20:00Z',
  },
  {
    id: '3',
    job: mockJobs[2], // UI/UX Designer
    freelancer: mockUser,
    cover_letter: 'Design is my passion...',
    status: 'reviewing',
    applied_at: '2023-10-24T16:45:00Z',
    updated_at: '2023-10-24T16:45:00Z',
  },
  {
    id: '4',
    job: mockJobs[1], // Python Backend
    freelancer: mockUser,
    cover_letter: 'Experienced with Django...',
    status: 'rejected',
    applied_at: '2023-10-18T13:00:00Z',
    updated_at: '2023-10-21T09:30:00Z',
  },
  {
    id: '5',
    job: mockJobs[5], // Mobile Developer
    freelancer: mockUser,
    cover_letter: 'React Native expert...',
    status: 'reviewing',
    applied_at: '2023-10-15T08:30:00Z',
    updated_at: '2023-10-16T10:00:00Z',
  },
];

export function getMockApplications(params: any = {}): PaginatedResponse<Application> {
  let filteredApps = [...mockApplications];

  // Filter by status
  if (params.status) {
    filteredApps = filteredApps.filter((app) => app.status === params.status);
  }
  
  // Search filter (mock implementation)
  if (params.q) {
     const q = params.q.toLowerCase();
     filteredApps = filteredApps.filter(app => 
       app.job.title.toLowerCase().includes(q) || 
       app.job.company.name.toLowerCase().includes(q)
     );
  }

  return {
    count: filteredApps.length,
    next: null,
    previous: null,
    results: filteredApps,
  };
}
