import { NextResponse } from "next/server";
import { loadSong, saveSong, taskKey } from "@/lib/song";
import { getJSON } from "@/lib/store";
import { extractTracks } from "@/lib/suno";

// kie.ai присылает сюда этапы генерации: text → first → complete.
// Данным колбэка не доверяем слепо: берём только треки для известной задачи.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const taskId: string | undefined = body?.data?.task_id ?? body?.data?.taskId;
  if (!taskId) return NextResponse.json({ code: 200 });

  const songId = await getJSON<string>(taskKey(taskId));
  const song = songId ? await loadSong(songId) : null;
  if (!song || song.status === "ready") return NextResponse.json({ code: 200 });

  const tracks = extractTracks(body.data.data);
  const type = body.data.callbackType;
  if (body.code !== 200) {
    await saveSong({ ...song, status: "failed", error: body.msg || "Генерация не удалась" });
  } else if (tracks.length) {
    const ready = type === "complete" && tracks.every((t) => t.audioUrl);
    await saveSong({ ...song, tracks, status: ready ? "ready" : "streaming" });
  }
  return NextResponse.json({ code: 200 });
}
