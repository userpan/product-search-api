import Redis from 'ioredis';

let redis: Redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  console.error('REDIS_URL is not defined in the environment variables');
  // 你可以选择抛出一个错误，或者使用默认配置
  // throw new Error('REDIS_URL is not defined');
  redis = new Redis(); 
}

export default redis;