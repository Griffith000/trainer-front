import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    const redisUrl = process.env.REDIS_URL || process.env.KV_URL;

    if (!redisUrl) {
      throw new Error("REDIS_URL or KV_URL environment variable is required");
    }

    client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
      },
    });

    client.on("error", (err) => {
      console.error("Redis client error:", err);
      client = null;
    });

    client.on("connect", () => {
      console.log("Redis client connected");
    });

    await client.connect();
  }

  return client;
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
