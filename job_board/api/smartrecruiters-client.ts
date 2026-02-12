// SmartRecruiters Axios Client with Interceptors

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { smartRecruitersConfig, featureFlags, rateLimitConfig } from '@/config/smartrecruiters';
import { RateLimiter } from './rate-limiter';

class SmartRecruitersClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor() {
    // Create axios instance
    this.client = axios.create({
      baseURL: smartRecruitersConfig.baseURL,
      timeout: smartRecruitersConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      maxRequests: rateLimitConfig.maxRequestsPerSecond,
      perSeconds: 1,
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Wait for rate limiter
        await this.rateLimiter.acquire();

        // Add Smart Token if available (for Customer API)
        // Public Posting API doesn't need authentication
        if (smartRecruitersConfig.apiKey && config.headers) {
          config.headers['X-SmartToken'] = smartRecruitersConfig.apiKey;
        }

        // Log request in development
        if (featureFlags.enableLogs) {
          console.log('🚀 SmartRecruiters Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response
        if (featureFlags.enableLogs) {
          console.log('✅ SmartRecruiters Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle specific errors
        if (error.response?.status === 429) {
          console.error('⚠️ SmartRecruiters Rate Limit Exceeded');
          return this.handleRateLimitError(error);
        } else if (error.response?.status === 401) {
          console.error('🔐 SmartRecruiters Authentication Failed');
        } else if (error.response?.status && error.response.status >= 500) {
          console.error('🔥 SmartRecruiters Server Error:', error.response.status);
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleRateLimitError(error: AxiosError): Promise<any> {
    const retryAfter = error.response?.headers['retry-after'];
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;

    console.log(`⏳ Retrying after ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry the request
    if (error.config) {
      return this.client.request(error.config);
    }
    return Promise.reject(error);
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
export const smartRecruitersClient = new SmartRecruitersClient();
export default smartRecruitersClient;
