import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/Chrome";
import SongView from "@/components/SongView";
import { refreshSong } from "@/lib/refresh";
import { loadSong, toPublic } from "@/lib/song";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = await loadSong((await params).id);
  if (!song) return { title: "Песня не найдена — ohappy" };
  const title = `🎵 ${song.brief.name}, это песня для тебя!`;
  const description = `«${song.title}» — персональная песня-поздравление. Нажми и послушай.`;
  return { title, description, openGraph: { title, description, images: song.tracks[0]?.imageUrl ? [song.tracks[0].imageUrl] : [] }, robots: { index: false } };
}

export default async function SongPage({ params }: Props) {
  const song = await loadSong((await params).id);
  if (!song) notFound();
  const fresh = await refreshSong(song);
  return (
    <>
      <Header />
      <main className="song-page">
        <div className="wrap">
          <SongView initial={toPublic(fresh)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
