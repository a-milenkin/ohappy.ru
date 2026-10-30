// Простое key-value хранилище: Upstash/Vercel KV через REST в проде, файлы в .data/ локально.
import { promises as fs } from "fs";
import path from "path";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const DATA_DIR = path.join(process.cwd(), ".data");

async function kv(command: (string | number)[]) {
  const res = await fetch(KV_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  return (await res.json()).result;
}

function filePath(key: string) {
  return path.join(DATA_DIR, key.replace(/[^a-zA-Z0-9_-]/g, "_") + ".json");
}

export async function getJSON<T>(key: string): Promise<T | null> {
  if (KV_URL) {
    const raw = await kv(["GET", key]);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  try {
    return JSON.parse(await fs.readFile(filePath(key), "utf8")) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown, ttlSeconds?: number) {
  const raw = JSON.stringify(value);
  if (KV_URL) {
    await kv(ttlSeconds ? ["SET", key, raw, "EX", ttlSeconds] : ["SET", key, raw]);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath(key), raw);
}

// Счётчик с истечением — для лимита бесплатных генераций.
export async function incr(key: string, ttlSeconds: number): Promise<number> {
  if (KV_URL) {
    const n = await kv(["INCR", key]);
    if (n === 1) await kv(["EXPIRE", key, ttlSeconds]);
    return n;
  }
  const cur = (await getJSON<{ n: number; exp: number }>(key)) ?? { n: 0, exp: 0 };
  const next = cur.exp > Date.now() ? { n: cur.n + 1, exp: cur.exp } : { n: 1, exp: Date.now() + ttlSeconds * 1000 };
  await setJSON(key, next);
  return next.n;
}
