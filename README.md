# Job Board Frontend

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-Powered-0055DA?style=flat&logo=rapidapi&logoColor=white)](https://rapidapi.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, responsive, and type-safe frontend application for the Job Board Platform powered by **RapidAPI**. Built with React, TypeScript, and Tailwind CSS, this application provides an intuitive interface for employers to post jobs and freelancers to find opportunities through RapidAPI's reliable infrastructure.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [RapidAPI Integration](#rapidapi-integration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [RapidAPI Setup](#rapidapi-setup)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
  - [RapidAPI Client](#rapidapi-client)
  - [API Integration](#api-integration)
  - [State Management](#state-management)
  - [Authentication Flow](#authentication-flow)
- [Component Library](#component-library)
- [Routing](#routing)
- [Styling Guide](#styling-guide)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [RapidAPI Best Practices](#rapidapi-best-practices)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Job Board Frontend is a modern single-page application (SPA) that connects employers with talented freelancers through **RapidAPI's marketplace**. By leveraging RapidAPI, this application benefits from reliable API hosting, built-in analytics, automatic documentation, and enterprise-grade security.

### Why RapidAPI?

- **🚀 Reliable Infrastructure**: 99.99% uptime SLA
- **🔒 Enterprise Security**: Built-in authentication and rate limiting
- **📊 Analytics Dashboard**: Track API usage and performance
- **💰 Monetization Ready**: Built-in billing and subscription management
- **🌍 Global CDN**: Low-latency access worldwide
- **📚 Auto-Documentation**: Interactive API docs generated automatically
- **🔄 Version Management**: Easy API versioning and migration

### Key Highlights

- **Type-Safe**: Full TypeScript implementation with strict typing
- **RapidAPI Powered**: Professional API management and monitoring
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Code splitting, lazy loading, and optimized rendering
- **Accessibility**: WCAG 2.1 AA compliant components
- **SEO Optimized**: Server-side rendering ready with Next.js (optional)
- **Real-Time**: WebSocket integration for live notifications

## ✨ Features

### For Freelancers
- **Advanced Job Search**: Full-text search with filters and autocomplete
- **Personalized Recommendations**: AI-powered job matching based on skills and preferences
- **Profile Builder**: Comprehensive profile with portfolio, experience, education, and certifications
- **Application Tracking**: Monitor application status through the hiring pipeline
- **Saved Jobs**: Bookmark interesting opportunities for later
- **Real-Time Notifications**: Instant updates on application status and new matches

### For Employers
- **Job Posting**: Create and manage job listings with rich text editor
- **Company Profiles**: Build attractive company pages with branding
- **Application Management**: Review, filter, and track candidate applications
- **Analytics Dashboard**: Track job performance, views, and application metrics
- **Candidate Search**: Find and reach out to qualified freelancers
- **Team Collaboration**: Multi-user company accounts

### Platform Features
- **Responsive UI**: Seamless experience across desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly dark theme option
- **Multiple Languages**: i18n support for internationalization
- **Offline Support**: Progressive Web App (PWA) capabilities
- **Secure Authentication**: JWT-based auth with RapidAPI key management

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2+ | UI framework |
| **TypeScript** | 5.0+ | Type safety and developer experience |
| **Vite** | 5.0+ | Build tool and dev server |
| **React Router** | 6.20+ | Client-side routing |
| **Axios** | 1.6+ | HTTP client for RapidAPI calls |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |
| **Headless UI** | 1.7+ | Accessible UI components |
| **React Hook Form** | 7.49+ | Form management and validation |
| **Zod** | 3.22+ | Schema validation |
| **React Query** | 5.0+ | Server state management |
| **Zustand** | 4.4+ | Client state management |
| **date-fns** | 3.0+ | Date manipulation |
| **React Hot Toast** | 2.4+ | Toast notifications |
| **Lucide React** | 0.300+ | Icon library |

## 🔌 RapidAPI Integration

This application is designed to work with the Job Board API hosted on RapidAPI. The API provides all backend functionality through RapidAPI's infrastructure.

### RapidAPI Benefits for This Project

1. **No Backend Deployment**: Focus on frontend development
2. **Built-in Rate Limiting**: Automatic request throttling
3. **Usage Analytics**: Track API consumption in real-time
4. **Multiple Environments**: Easy switching between test/production
5. **API Key Management**: Secure credential handling
6. **Automatic Retries**: Built-in error recovery
7. **Request Logging**: Debug API calls easily

### API Endpoints Structure

All endpoints follow RapidAPI's standard format:

```
https://job-board-api.p.rapidapi.com/api/v1/{endpoint}
```

### Required Headers

Every request to RapidAPI requires two headers:

```javascript
{
  'X-RapidAPI-Key': 'your-rapidapi-key',
  'X-RapidAPI-Host': 'job-board-api.p.rapidapi.com'
}
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **yarn** v1.22+)
- **Git**: Latest version
- **RapidAPI Account**: Free account at [rapidapi.com](https://rapidapi.com)
- **RapidAPI Key**: Subscribe to Job Board API on RapidAPI Hub

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/job-board-frontend.git
cd job-board-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

### RapidAPI Setup

#### Step 1: Create RapidAPI Account

1. Visit [rapidapi.com](https://rapidapi.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

#### Step 2: Subscribe to Job Board API

1. Search for "Job Board API" in RapidAPI Hub
2. Click on the API listing
3. Choose a pricing plan:
   - **Basic (Free)**: 100 requests/month
   - **Pro ($9.99/month)**: 10,000 requests/month
   - **Ultra ($49.99/month)**: 100,000 requests/month
   - **Mega ($199.99/month)**: Unlimited requests
4. Click "Subscribe"

#### Step 3: Get Your API Key

1. After subscribing, navigate to the API page
2. Click on "Endpoints" tab
3. Your API key will be visible in the code snippets
4. Copy the key - format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Step 4: Test API Connection

```bash
# Test the API using cURL
curl --request GET \
  --url 'https://job-board-api.p.rapidapi.com/api/v1/jobs/?page=1&page_size=10' \
  --header 'X-RapidAPI-Host: job-board-api.p.rapidapi.com' \
  --header 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY'
```

### Environment Setup

1. **Create environment file**
```bash
cp .env.example .env
```

2. **Configure environment variables**

Edit `.env` with your RapidAPI configuration:

```env
# RapidAPI Configuration
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=job-board-api.p.rapidapi.com
VITE_RAPIDAPI_BASE_URL=https://job-board-api.p.rapidapi.com/api/v1

# Application Settings
VITE_APP_NAME=Job Board
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PUSH_NOTIFICATIONS=false
VITE_ENABLE_RAPIDAPI_LOGS=true

# Third-Party Services (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_ANALYTICS_ID=your_ga_id

# RapidAPI Request Configuration
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000

# Rate Limiting (Client-Side)
VITE_MAX_REQUESTS_PER_SECOND=10
VITE_ENABLE_REQUEST_QUEUE=true
```

### Running the Application

#### Development Mode
```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:5173`

#### Production Build
```bash
npm run build
# or
yarn build
```

#### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
job-board-frontend/
├── src/
│   ├── api/                    # RapidAPI integration layer
│   │   ├── rapidapi-client.ts # RapidAPI Axios configuration
│   │   ├── services.ts        # API service methods
│   │   ├── interceptors.ts    # Request/response interceptors
│   │   └── rate-limiter.ts    # Client-side rate limiting
│   │
│   ├── config/
│   │   ├── rapidapi.ts        # RapidAPI configuration
│   │   └── constants.ts       # App constants
│   │
│   ├── components/            # Reusable components
│   ├── pages/                 # Route pages
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── ...
│
├── .env.example               # Environment template
├── .env                       # Your RapidAPI credentials
└── README.md                  # This file
```

## 🧠 Core Concepts

### RapidAPI Client

The application uses a custom Axios client configured for RapidAPI:

**src/api/rapidapi-client.ts**
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

class RapidAPIClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_RAPIDAPI_BASE_URL,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
      },
    });

    // Rate limiter to prevent exceeding quota
    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
      perSeconds: 1,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Wait if rate limit exceeded
        await this.rateLimiter.acquire();
        
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log('🚀 RapidAPI Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_RAPIDAPI_LOGS) {
          console.log('✅ RapidAPI Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle RapidAPI specific errors
        if (error.response?.status === 429) {
          console.error('⚠️ RapidAPI Rate Limit Exceeded');
          // Implement exponential backoff
          await this.handleRateLimitError(error);
        } else if (error.response?.status === 403) {
          console.error('🔒 RapidAPI Subscription Required');
          // Redirect to upgrade page
          window.location.href = '/upgrade';
        } else if (error.response?.status === 401) {
          console.error('🔐 Authentication Failed');
          // Clear auth and redirect to login
          this.clearAuth();
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleRateLimitError(error: AxiosError) {
    const retryAfter = error.response?.headers['retry-after'];
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
    
    console.log(`⏳ Retrying after ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the request
    return this.client.request(error.config!);
  }

  // Auth token management
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Public API methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

// Export singleton instance
export const rapidAPIClient = new RapidAPIClient();
export default rapidAPIClient;
```

### API Integration

**Example: Job Search Service**
```typescript
// src/api/services.ts
import { rapidAPIClient } from './rapidapi-client';
import type { Job, JobSearchParams, PaginatedResponse } from '@/types';

export class JobService {
  async searchJobs(params: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return rapidAPIClient.get('/jobs/search/', params);
  }

  async getJob(id: string): Promise<Job> {
    return rapidAPIClient.get(`/jobs/${id}/`);
  }

  async createJob(data: CreateJobData): Promise<Job> {
    return rapidAPIClient.post('/jobs/', data);
  }

  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    return rapidAPIClient.put(`/jobs/${id}/`, data);
  }

  async deleteJob(id: string): Promise<void> {
    return rapidAPIClient.delete(`/jobs/${id}/`);
  }
}

export const jobService = new JobService();
```

### State Management with React Query

React Query handles caching and synchronization with RapidAPI:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/api/services';

// Fetch jobs with automatic caching
export function useJobs(params: JobSearchParams) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.searchJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Create job with optimistic updates
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
    },
  });
}
```

### Authentication Flow with RapidAPI

```
1. User logs in → API (via RapidAPI) returns JWT tokens
2. Tokens stored in localStorage
3. Access token added to Authorization header (along with RapidAPI headers)
4. On 401 error → Refresh token used automatically
5. On 403 error → User prompted to upgrade subscription
6. On 429 error → Automatic retry with backoff
```

## 🎨 Component Library

### Job Search with RapidAPI

```typescript
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/jobs/JobCard';
import { Spinner } from '@/components/common/Spinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { RateLimitWarning } from '@/components/common/RateLimitWarning';

function JobSearchPage() {
  const [params, setParams] = useState<JobSearchParams>({
    q: '',
    location: '',
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, error, isError } = useJobs(params);

  // Check for RapidAPI specific errors
  const isRateLimitError = error?.response?.status === 429;
  const isSubscriptionError = error?.response?.status === 403;

  if (isLoading) return <Spinner />;
  
  if (isRateLimitError) {
    return <RateLimitWarning />;
  }

  if (isSubscriptionError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Upgrade Required</h2>
        <p className="mb-6">You've reached your API quota. Please upgrade your plan.</p>
        <a href="/upgrade" className="btn btn-primary">Upgrade Now</a>
      </div>
    );
  }

  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      <JobFilters params={params} onChange={setParams} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <Pagination total={data?.count} params={params} onChange={setParams} />
    </div>
  );
}
```

## 🧪 Testing

### Testing RapidAPI Integration

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rapidAPIClient } from '@/api/rapidapi-client';
import { jobService } from '@/api/services';

describe('RapidAPI Integration', () => {
  beforeEach(() => {
    // Mock RapidAPI responses
    vi.mock('axios');
  });

  it('should include RapidAPI headers in requests', async () => {
    const spy = vi.spyOn(rapidAPIClient, 'get');
    
    await jobService.searchJobs({ q: 'developer' });

    expect(spy).toHaveBeenCalledWith(
      '/jobs/search/',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-RapidAPI-Key': expect.any(String),
          'X-RapidAPI-Host': 'job-board-api.p.rapidapi.com',
        }),
      })
    );
  });

  it('should handle rate limit errors gracefully', async () => {
    // Mock 429 response
    vi.spyOn(rapidAPIClient, 'get').mockRejectedValueOnce({
      response: { status: 429, headers: { 'retry-after': '5' } },
    });

    await expect(jobService.searchJobs({})).rejects.toThrow();
    // Verify retry mechanism was triggered
  });

  it('should handle subscription errors', async () => {
    // Mock 403 response
    vi.spyOn(rapidAPIClient, 'get').mockRejectedValueOnce({
      response: { status: 403 },
    });

    await expect(jobService.searchJobs({})).rejects.toThrow();
  });
});
```

## ⚡ Performance Optimization

### RapidAPI-Specific Optimizations

1. **Request Batching**: Combine multiple requests when possible
2. **Aggressive Caching**: Cache responses to reduce API calls
3. **Rate Limit Buffer**: Stay under quota limits
4. **Conditional Requests**: Use ETags for unchanged data
5. **Pagination**: Fetch only needed data

```typescript
// Aggressive caching for static data
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => rapidAPIClient.get('/categories/'),
    staleTime: Infinity, // Never refetch (until manually invalidated)
    cacheTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });
}

// Prefetch next page
export function useJobsWithPrefetch(params: JobSearchParams) {
  const queryClient = useQueryClient();
  const query = useJobs(params);

  // Prefetch next page
  useEffect(() => {
    if (query.data?.next) {
      queryClient.prefetchQuery({
        queryKey: ['jobs', { ...params, page: params.page + 1 }],
        queryFn: () => jobService.searchJobs({ ...params, page: params.page + 1 }),
      });
    }
  }, [query.data, params, queryClient]);

  return query;
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
# Production RapidAPI Configuration
VITE_RAPIDAPI_KEY=your_production_rapidapi_key
VITE_RAPIDAPI_HOST=job-board-api.p.rapidapi.com
VITE_RAPIDAPI_BASE_URL=https://job-board-api.p.rapidapi.com/api/v1
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_RAPIDAPI_LOGS=false
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add VITE_RAPIDAPI_KEY
vercel env add VITE_RAPIDAPI_HOST

# Deploy
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build args for RapidAPI
ARG VITE_RAPIDAPI_KEY
ARG VITE_RAPIDAPI_HOST
ENV VITE_RAPIDAPI_KEY=$VITE_RAPIDAPI_KEY
ENV VITE_RAPIDAPI_HOST=$VITE_RAPIDAPI_HOST

# Build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📚 RapidAPI Best Practices

### 1. API Key Security

```typescript
// ❌ NEVER expose API key in client code
const apiKey = 'abc123def456'; // DON'T DO THIS

// ✅ Use environment variables
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;

// ✅ For sensitive operations, use backend proxy
async function sensitiveOperation() {
  // Call your own backend, which then calls RapidAPI
  return fetch('/api/proxy/sensitive-operation', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
}
```

### 2. Rate Limit Management

```typescript
// Implement client-side rate limiting
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();

  async acquire() {
    // Reset window if needed
    if (Date.now() - this.windowStart > 1000) {
      this.requestCount = 0;
      this.windowStart = Date.now();
    }

    // Wait if limit exceeded
    if (this.requestCount >= 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.acquire();
    }

    this.requestCount++;
  }
}
```

### 3. Error Handling

```typescript
// Comprehensive error handling
async function handleRapidAPIError(error: AxiosError) {
  if (error.response?.status === 429) {
    // Rate limit exceeded
    toast.error('Too many requests. Please wait a moment.');
    return { retry: true, delay: 5000 };
  } else if (error.response?.status === 403) {
    // Subscription required
    toast.error('Please upgrade your subscription to continue.');
    return { redirect: '/upgrade' };
  } else if (error.response?.status === 401) {
    // Authentication failed
    toast.error('Please log in again.');
    return { redirect: '/login' };
  } else if (error.response?.status >= 500) {
    // Server error
    toast.error('Service temporarily unavailable. Please try again.');
    return { retry: true, delay: 10000 };
  }
}
```

### 4. Monitoring Usage

```typescript
// Track API usage
export function useRapidAPIUsage() {
  return useQuery({
    queryKey: ['rapidapi-usage'],
    queryFn: async () => {
      // Call RapidAPI analytics endpoint
      return rapidAPIClient.get('/analytics/usage/');
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

// Display usage warning
function UsageWarning() {
  const { data } = useRapidAPIUsage();
  const usagePercent = (data?.used / data?.limit) * 100;

  if (usagePercent > 80) {
    return (
      <Alert variant="warning">
        You've used {usagePercent.toFixed(0)}% of your API quota.
        Consider upgrading your plan.
      </Alert>
    );
  }

  return null;
}
```

### 5. Caching Strategy

```typescript
// Cache static/semi-static data aggressively
const CACHE_TIMES = {
  categories: 24 * 60 * 60 * 1000,  // 24 hours
  companies: 60 * 60 * 1000,         // 1 hour
  jobs: 5 * 60 * 1000,               // 5 minutes
  profile: 15 * 60 * 1000,           // 15 minutes
};

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => rapidAPIClient.get('/categories/'),
    staleTime: CACHE_TIMES.categories,
    cacheTime: CACHE_TIMES.categories,
  });
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### RapidAPI Testing Guidelines

- Test with RapidAPI Test environment first
- Never commit API keys
- Document rate limit considerations
- Test error scenarios (429, 403, 401)
- Include API usage metrics in PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Documentation
- [RapidAPI Hub](https://rapidapi.com/hub)
- [Job Board API Docs](https://rapidapi.com/your-api/job-board-api)
- [Component Storybook](https://storybook.yourjobboard.com)

### Community
- GitHub Issues: [Report bugs](https://github.com/yourusername/job-board-frontend/issues)
- RapidAPI Support: support@rapidapi.com
- Discord: [Join our community](https://discord.gg/your-invite)
- Email: support@yourjobboard.com

### Upgrading Your RapidAPI Plan

Visit your [RapidAPI Dashboard](https://rapidapi.com/developer/billing) to:
- View current usage
- Upgrade subscription tier
- Manage billing
- View analytics

---

**Powered by RapidAPI 🚀 | Made with ❤️ using React and TypeScript**

*Version 1.
