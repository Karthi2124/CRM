import Redis from 'ioredis';
import logger from '../utils/logger';

class CacheService {
  private client: Redis | null = null;
  private memoryStore = new Map<string, { value: string; expiry: number }>();
  private useMemoryOnly = false;

  constructor() {
    if (process.env.NODE_ENV === 'test') {
      this.useMemoryOnly = true;
      return;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true, // Don't block app start
      });

      this.client.on('connect', () => {
        logger.info('🔌 Redis connection established successfully');
        this.useMemoryOnly = false;
      });

      this.client.on('error', (err) => {
        if (!this.useMemoryOnly) {
          logger.warn(`⚠️ Redis error: ${err.message}. Falling back to in-memory cache.`);
          this.useMemoryOnly = true;
        }
      });

      // Try connecting asynchronously
      this.client.connect().catch(() => {
        this.useMemoryOnly = true;
      });
    } catch (err: any) {
      logger.warn(`⚠️ Failed to initialize Redis: ${err.message}. Using in-memory cache fallback.`);
      this.useMemoryOnly = true;
    }
  }

  /**
   * Retrieves a value from the cache.
   */
  public async get(key: string): Promise<string | null> {
    if (this.useMemoryOnly || !this.client) {
      const cached = this.memoryStore.get(key);
      if (!cached) return null;
      if (Date.now() > cached.expiry) {
        this.memoryStore.delete(key);
        return null;
      }
      return cached.value;
    }

    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  /**
   * Sets a value in the cache with a Time-To-Live (TTL) in seconds.
   */
  public async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    if (this.useMemoryOnly || !this.client) {
      const expiry = Date.now() + ttlSeconds * 1000;
      this.memoryStore.set(key, { value, expiry });
      return;
    }

    try {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } catch {
      // Fallback to memory on failure
      const expiry = Date.now() + ttlSeconds * 1000;
      this.memoryStore.set(key, { value, expiry });
    }
  }

  /**
   * Invalidates / deletes a key from the cache.
   */
  public async del(key: string): Promise<void> {
    this.memoryStore.delete(key);

    if (this.client && !this.useMemoryOnly) {
      try {
        await this.client.del(key);
      } catch {
        // Ignored
      }
    }
  }
}

export const cache = new CacheService();
export default cache;
