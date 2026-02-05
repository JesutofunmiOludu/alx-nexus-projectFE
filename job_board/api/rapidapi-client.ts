// RapidAPI Axios Client with Interceptors

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { rapidAPIConfig, featureFlags } from '@/config/rapidapi';
import { RateLimiter } from './rate-limiter';

class RapidAPIClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor() {
    // Create axios instance
    this.client = axios.create({
      baseURL: rapidAPIConfig.baseURL,
      timeout: rapidAPIConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': rapidAPIConfig.apiKey,
        'X-RapidAPI-Host': rapidAPIConfig.host,
      },
    });

    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
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

        // Add auth token if available
        const token = this.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (featureFlags.enableRapidAPILogs && rapidAPIConfig.baseURL.includes('localhost') === false) {
          console.log('🚀 RapidAPI Request:', config.method?.toUpperCase(), config.url);
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
        if (featureFlags.enableRapidAPILogs) {
          console.log('✅ RapidAPI Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle RapidAPI specific errors
        if (error.response?.status === 429) {
          console.error('⚠️ RapidAPI Rate Limit Exceeded');
          return this.handleRateLimitError(error);
        } else if (error.response?.status === 403) {
          console.error('🔒 RapidAPI Subscription Required');
          // You can redirect to upgrade page or show modal
          if (typeof window !== 'undefined') {
            // window.location.href = '/upgrade';
          }
        } else if (error.response?.status === 401) {
          console.error('🔐 Authentication Failed');
          this.clearAuth();
          if (typeof window !== 'undefined') {
            // window.location.href = '/login';
          }
        } else if (error.response?.status && error.response.status >= 500) {
          console.error('🔥 Server Error:', error.response.status);
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

  // Auth token management
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private clearAuth(): void {
    if (typeof window === 'undefined') return;
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

  // Get rate limiter stats
  getRateLimiterStats() {
    return this.rateLimiter.getStats();
  }
}

// Export singleton instance
export const rapidAPIClient = new RapidAPIClient();
export default rapidAPIClient;
