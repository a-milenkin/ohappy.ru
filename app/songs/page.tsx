"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/Chrome";
import { Cover } from "@/components/Player";
import { readMySongs, type MySong } from "@/lib/mySongs";

export default function MySongsPage() {
  const [songs, setSongs] = useState<MySong[] | null>(null);
  useEffect(() => setSongs(readMySongs()), []);

  return (
    <>
      <Header />
      <main className="song-page">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 28 }}>
            <div className="kicker">Мои песни</div>
            <h2>Ваши подарки</h2>
            <p>Песни, созданные в этом браузере. После входа через Яндекс они будут доступны с любого устройства.</p>
          </div>
          {songs && songs.length === 0 && (
            <div className="song-card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: 17, marginTop: 0 }}>Здесь пока пусто — самое время это исправить.</p>
              <Link href="/#create" className="btn btn-primary">Создать первую песню</Link>
            </div>
          )}
          <div className="my-list">
            {songs?.map((s) => (
              <Link key={s.id} href={`/s/${s.id}`} className="my-item">
                <Cover />
                <div>
                  <b>{s.title}</b>
                  <span>для {s.name} · {new Date(s.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
