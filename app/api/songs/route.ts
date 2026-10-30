import { NextResponse } from "next/server";
import { clientIp, parseBrief } from "@/lib/brief";
import { defaultStyle, writeLyrics } from "@/lib/lyrics";
import { newId, saveSong, taskKey, type Song } from "@/lib/song";
import { incr, setJSON } from "@/lib/store";
import { createMusicTask } from "@/lib/suno";

export const maxDuration = 60;

function siteUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const brief = parseBrief(body);
  if (!brief) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });

  const limit = Number(process.env.FREE_SONGS_PER_DAY || 5);
  const n = await incr(`rl:songs:${clientIp(req)}`, 86400);
  if (n > limit) {
    return NextResponse.json({ error: `Сегодня можно создать до ${limit} песен бесплатно. Возвращайтесь завтра!` }, { status: 429 });
  }

  try {
    let lyrics = typeof body.lyrics === "string" ? body.lyrics.trim().slice(0, 4800) : "";
    let title = typeof body.title === "string" ? body.title.trim().slice(0, 80) : "";
    let style = typeof body.style === "string" ? body.style.trim().slice(0, 900) : "";
    if (!lyrics) ({ lyrics, title, style } = await writeLyrics(brief));
    title ||= `Песня для ${brief.name}`;
    style ||= defaultStyle(brief);

    const site = siteUrl(req);
    const callbackUrl = site.startsWith("https://") ? `${site}/api/suno/callback` : undefined;
    const taskId = await createMusicTask({ title, style, lyrics, voice: brief.voice, quality: brief.quality, callbackUrl });

    const song: Song = {
      id: newId(),
      ownerKey: newId(12),
      createdAt: Date.now(),
      brief,
      title,
      style,
      lyrics,
      taskId,
      status: "generating",
      tracks: [],
    };
    await saveSong(song);
    await setJSON(taskKey(taskId), song.id);
    return NextResponse.json({ id: song.id, ownerKey: song.ownerKey });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось запустить генерацию, попробуйте ещё раз" }, { status: 502 });
  }
}
