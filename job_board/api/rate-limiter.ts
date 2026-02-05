// Client-side Rate Limiter for RapidAPI

interface RateLimiterOptions {
  maxRequests: number;
  perSeconds: number;
}

export class RateLimiter {
  private queue: Array<() => void> = [];
  private requestTimestamps: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.perSeconds * 1000;
  }

  /**
   * Acquire permission to make a request
   * Will wait if rate limit is exceeded
   */
  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        const now = Date.now();
        
        // Remove timestamps outside the current window
        this.requestTimestamps = this.requestTimestamps.filter(
          (timestamp) => now - timestamp < this.windowMs
        );

        // Check if we can make a request
        if (this.requestTimestamps.length < this.maxRequests) {
          this.requestTimestamps.push(now);
          resolve();
        } else {
          // Calculate wait time
          const oldestTimestamp = this.requestTimestamps[0];
          const waitTime = this.windowMs - (now - oldestTimestamp);
          
          // Wait and try again
          setTimeout(tryAcquire, waitTime);
        }
      };

      tryAcquire();
    });
  }

  /**
   * Get current usage statistics
   */
  getStats() {
    const now = Date.now();
    const activeRequests = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.windowMs
    ).length;

    return {
      activeRequests,
      maxRequests: this.maxRequests,
      availableRequests: this.maxRequests - activeRequests,
      utilizationPercent: (activeRequests / this.maxRequests) * 100,
    };
  }

  /**
   * Reset the rate limiter
   */
  reset() {
    this.requestTimestamps = [];
    this.queue = [];
  }
}

export default RateLimiter;
