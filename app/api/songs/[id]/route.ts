import { NextResponse } from "next/server";
import { refreshSong } from "@/lib/refresh";
import { loadSong, toPublic } from "@/lib/song";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await loadSong(id);
  if (!song) return NextResponse.json({ error: "Песня не найдена" }, { status: 404 });

  const fresh = await refreshSong(song);
  const isOwner = new URL(req.url).searchParams.get("key") === song.ownerKey;
  return NextResponse.json({ song: toPublic(fresh), isOwner });
}
