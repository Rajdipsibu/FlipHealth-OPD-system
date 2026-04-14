import { createClient, type RedisClientType } from 'redis';

// Use environment variables for production flexibility
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Important: v4+ requires an explicit .connect() call
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;