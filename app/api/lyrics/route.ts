import { NextResponse } from "next/server";
import { clientIp, parseBrief } from "@/lib/brief";
import { writeLyrics } from "@/lib/lyrics";
import { incr } from "@/lib/store";

export const maxDuration = 60;

export async function POST(req: Request) {
  const brief = parseBrief(await req.json().catch(() => ({})));
  if (!brief) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });

  // Тексты дешёвые, но всё равно ограничиваем от злоупотреблений.
  const n = await incr(`rl:lyrics:${clientIp(req)}`, 3600);
  if (n > 30) return NextResponse.json({ error: "Слишком много попыток, попробуйте через час" }, { status: 429 });

  try {
    return NextResponse.json(await writeLyrics(brief));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не получилось написать текст, попробуйте ещё раз" }, { status: 502 });
  }
}
