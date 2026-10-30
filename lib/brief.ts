import { GENRES, MOODS, OCCASIONS, RECIPIENTS } from "./options";
import type { SongBrief } from "./song";

const pick = (v: unknown, allowed: string[], fallback: string) =>
  typeof v === "string" && allowed.includes(v) ? v : fallback;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Нормализуем то, что пришло из формы: неизвестные значения заменяем дефолтами.
export function parseBrief(raw: Record<string, unknown>): SongBrief | null {
  const name = text(raw.name, 40);
  if (!name) return null;
  return {
    name,
    recipient: pick(raw.recipient, RECIPIENTS.map((o) => o.value), "other"),
    occasion: pick(raw.occasion, OCCASIONS.map((o) => o.value), "birthday"),
    story: text(raw.story, 1500),
    genre: pick(raw.genre, GENRES.map((o) => o.value), "pop"),
    mood: pick(raw.mood, MOODS.map((o) => o.value), "touching"),
    voice: raw.voice === "m" ? "m" : "f",
    language: raw.language === "en" ? "en" : "ru",
    quality: raw.quality === "premium" ? "premium" : "standard",
    from: raw.from === "ded_moroz" || raw.from === "snegurochka" ? raw.from : "me",
  };
}

export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
}
