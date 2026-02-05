// RapidAPI Configuration

export const rapidAPIConfig = {
  apiKey: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
  host: process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'job-board-api.p.rapidapi.com',
  baseURL: process.env.NEXT_PUBLIC_RAPIDAPI_BASE_URL || 'https://job-board-api.p.rapidapi.com/api/v1',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
};

export const rateLimitConfig = {
  maxRequestsPerSecond: parseInt(process.env.NEXT_PUBLIC_MAX_REQUESTS_PER_SECOND || '10'),
  enableRequestQueue: process.env.NEXT_PUBLIC_ENABLE_REQUEST_QUEUE === 'true',
};

export const featureFlags = {
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enablePushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  enableRapidAPILogs: process.env.NEXT_PUBLIC_ENABLE_RAPIDAPI_LOGS === 'true',
};

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Job Board',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
};
