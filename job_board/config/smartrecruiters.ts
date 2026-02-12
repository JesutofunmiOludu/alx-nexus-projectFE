// SmartRecruiters Configuration

export const smartRecruitersConfig = {
  apiKey: process.env.NEXT_PUBLIC_SMARTRECRUITERS_API_KEY || '',
  companyId: process.env.NEXT_PUBLIC_SMARTRECRUITERS_COMPANY_ID || 'smartrecruiters', // Default for testing
  baseURL: process.env.NEXT_PUBLIC_SMARTRECRUITERS_BASE_URL || 'https://api.smartrecruiters.com',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
};

export const rateLimitConfig = {
  maxRequestsPerSecond: 10, // SmartRecruiters limit is 10/s
  maxConcurrentRequests: 8, // SmartRecruiters limit is 8 concurrent
};

export const featureFlags = {
  enableLogs: process.env.NEXT_PUBLIC_ENABLE_SMARTRECRUITERS_LOGS === 'true' || true,
};
