/**
 * Utility functions for handling API requests
 * - Prevents duplicate concurrent requests
 * - Implements debouncing for rapid updates
 * - Manages request queuing
 */

/**
 * Simple debounce function
 * Delays function execution and prevents multiple rapid calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Request manager to prevent concurrent duplicate requests
 * Useful for preventing multiple API calls for the same resource
 */
export class RequestManager {
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Execute a request only if one with the same key isn't already pending
   * @param key - Unique identifier for this request
   * @param requestFn - Async function that makes the API call
   * @returns Promise that resolves when request completes
   */
  async executeOnce<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T | null> {
    // If request with this key is already pending, return existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request promise
    const requestPromise = requestFn()
      .then((result) => {
        // Remove from pending on success
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store promise as pending
    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Cancel a pending request
   */
  cancel(key: string): void {
    this.pendingRequests.delete(key);
  }

  /**
   * Clear all pending requests
   */
  clearAll(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get count of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

/**
 * Creates a request queue that executes requests sequentially
 * Prevents race conditions when multiple requests need to happen one after another
 */
export class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private isProcessing = false;

  /**
   * Add a request to the queue
   * @param requestFn - Async function to execute
   * @returns Promise that resolves when this request completes
   */
  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() =>
        requestFn()
          .then(resolve)
          .catch(reject)
      );

      if (!this.isProcessing) {
        this.process();
      }
    });
  }

  /**
   * Process queue items sequentially
   */
  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const requestFn = this.queue.shift();
      if (requestFn) {
        try {
          await requestFn();
        } catch (error) {
          console.error('Request queue error:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Get current queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear all pending requests in queue
   */
  clear(): void {
    this.queue = [];
    this.isProcessing = false;
  }
}

/**
 * Throttle function - execute at most once per specified time period
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
