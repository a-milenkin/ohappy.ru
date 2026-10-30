// Генерация музыки Suno через kie.ai. Без KIE_API_KEY — демо-режим с тестовым треком.
import type { Quality } from "./options";
import type { SongStatus, Track } from "./song";

const API = "https://api.kie.ai/api/v1/jobs";
const DEMO_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const isDemo = () => !process.env.KIE_API_KEY;

type CreateInput = {
  title: string;
  style: string;
  lyrics: string;
  voice: "f" | "m";
  quality: Quality;
  callbackUrl?: string;
};

export async function createMusicTask(input: CreateInput): Promise<string> {
  if (isDemo()) return `demo_${Date.now()}`;
  const model =
    input.quality === "premium"
      ? process.env.SUNO_MODEL_PREMIUM || "V6"
      : process.env.SUNO_MODEL_STANDARD || "V6_MINI";

  const res = await fetch(`${API}/createTask`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.KIE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "ai-music-api/generate",
      ...(input.callbackUrl ? { callBackUrl: input.callbackUrl } : {}),
      input: {
        custom_mode: true,
        instrumental: false,
        model,
        title: input.title.slice(0, 80),
        lyrics: input.lyrics,
        style: input.style,
        vocal_gender: input.voice,
      },
    }),
  });
  const body = await res.json();
  if (body.code !== 200 || !body.data?.taskId) {
    throw new Error(`kie.ai createTask: ${body.code} ${body.msg}`);
  }
  return body.data.taskId as string;
}

export type TaskState = { status: SongStatus; tracks: Track[]; error?: string };

export async function getMusicTask(taskId: string): Promise<TaskState> {
  if (taskId.startsWith("demo_")) {
    const age = Date.now() - Number(taskId.slice(5));
    if (age < 6000) return { status: "generating", tracks: [] };
    const track = (id: string): Track => ({ id, audioUrl: DEMO_AUDIO, duration: 372 });
    return { status: "ready", tracks: [track("demo-a"), track("demo-b")] };
  }

  const res = await fetch(`${API}/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${process.env.KIE_API_KEY}` },
    cache: "no-store",
  });
  const body = await res.json();
  if (body.code !== 200) throw new Error(`kie.ai recordInfo: ${body.code} ${body.msg}`);
  const d = body.data ?? {};
  if (d.state === "fail") return { status: "failed", tracks: [], error: d.failMsg || "Генерация не удалась" };

  let result: unknown = d.response;
  if (!result && d.resultJson) {
    try {
      result = JSON.parse(d.resultJson);
    } catch {}
  }
  const tracks = extractTracks(result);
  if (d.state === "success") return { status: tracks.length ? "ready" : "failed", tracks };
  return { status: tracks.some((t) => t.streamUrl) ? "streaming" : "generating", tracks };
}

// Ответы kie.ai бывают разной формы (колбэк, recordInfo, старое API) — ищем треки рекурсивно.
export function extractTracks(node: unknown, out: Track[] = []): Track[] {
  if (Array.isArray(node)) {
    node.forEach((n) => extractTracks(n, out));
  } else if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    const audio = (o.audio_url ?? o.audioUrl) as string | undefined;
    const stream = (o.stream_audio_url ?? o.streamAudioUrl) as string | undefined;
    if (audio || stream) {
      out.push({
        id: String(o.id ?? out.length),
        audioUrl: audio || "",
        streamUrl: stream || undefined,
        imageUrl: (o.image_url ?? o.imageUrl) as string | undefined,
        duration: typeof o.duration === "number" ? o.duration : undefined,
      });
    } else {
      Object.values(o).forEach((v) => extractTracks(v, out));
    }
  }
  return out;
}
