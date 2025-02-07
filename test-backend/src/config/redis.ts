import Redis from "ioredis";

export const AppRedis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

export default AppRedis;