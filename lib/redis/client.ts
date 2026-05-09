import Redis from "ioredis";
import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;
let ioredisPublisher: Redis | null = null;
let ioredisSubscriber: Redis | null = null;

function getRedisUrl(): string {
  const redisUrl = process.env.REDIS_URL || process.env.KV_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL or KV_URL environment variable is required");
  }
  return redisUrl;
}

export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({
      url: getRedisUrl(),
      socket: {
        connectTimeout: 5000,
      },
    });

    client.on("error", (err) => {
      console.error("Redis client error:", err);
      client = null;
    });

    await client.connect();
  }

  return client;
}

export function getIoredisPublisher(): Redis {
  if (!ioredisPublisher) {
    ioredisPublisher = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 5000,
    });

    ioredisPublisher.on("error", (err) => {
      console.error("ioredis publisher error:", err);
      ioredisPublisher = null;
    });
  }

  return ioredisPublisher;
}

export function getIoredisSubscriber(): Redis {
  if (!ioredisSubscriber) {
    ioredisSubscriber = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 5000,
    });

    ioredisSubscriber.on("error", (err) => {
      console.error("ioredis subscriber error:", err);
      ioredisSubscriber = null;
    });
  }

  return ioredisSubscriber;
}

export async function getLatestStreamId(
  chatId: string,
): Promise<string | null> {
  try {
    const redis = await getRedisClient();
    return await redis.get(`chat:${chatId}:latest_stream`);
  } catch {
    return null;
  }
}

export async function setLatestStreamId(
  chatId: string,
  streamId: string,
): Promise<void> {
  try {
    const redis = await getRedisClient();
    await redis.set(`chat:${chatId}:latest_stream`, streamId, { EX: 86400 });
  } catch (error) {
    console.error("Failed to set latest stream ID:", error);
  }
}
