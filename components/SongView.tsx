"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Paywall from "@/components/Paywall";
import Player, { Cover } from "@/components/Player";
import { ownerKeyFor } from "@/lib/mySongs";
import { OCCASIONS, labelOf } from "@/lib/options";
import type { PublicSong } from "@/lib/song";

const GEN_STEPS = ["Текст готов", "Сочиняем мелодию", "Записываем вокал", "Сводим трек"];

function Lyrics({ text }: { text: string }) {
  return (
    <div className="lyrics-box">
      {text.split("\n").map((line, i) => {
        const tag = line.match(/^\s*\[(.+)\]\s*$/);
        if (tag) return <span key={i} className="tag">{tag[1]}</span>;
        return <span key={i}>{line}{"\n"}</span>;
      })}
    </div>
  );
}

export default function SongView({ initial }: { initial: PublicSong }) {
  const [song, setSong] = useState(initial);
  const [isOwner, setIsOwner] = useState(false);
  const [version, setVersion] = useState(0);
  const [paywall, setPaywall] = useState(false);
  const [toast, setToast] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const done = song.status === "ready" || song.status === "failed";

  // Опрашиваем статус, пока песня записывается.
  useEffect(() => {
    const key = ownerKeyFor(song.id);
    let stop = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/songs/${song.id}${key ? `?key=${key}` : ""}`, { cache: "no-store" });
        const data = await res.json();
        if (stop || !res.ok) return;
        setSong(data.song);
        setIsOwner(data.isOwner);
        if (data.song.status === "ready" || data.song.status === "failed") return;
      } catch {}
      if (!stop) setTimeout(tick, 4000);
    };
    tick();
    return () => { stop = true; };
  }, [song.id]);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [done]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  const share = async () => {
    const url = `${location.origin}/s/${song.id}`;
    const text = `🎵 ${song.name}, это песня для тебя!`;
    if (navigator.share) {
      try { await navigator.share({ title: song.title, text, url }); return; } catch { /* отменили — копируем */ }
    }
    try { await navigator.clipboard.writeText(url); flash("Ссылка скопирована 💝"); } catch { flash(url); }
  };

  const playable = song.tracks.filter((t) => t.audioUrl || t.streamUrl);
  const track = playable[Math.min(version, playable.length - 1)];
  const occasion = labelOf(OCCASIONS, song.occasion).toLowerCase();
  const genIdx = Math.min(1 + Math.floor(elapsed / 25), GEN_STEPS.length - 1);

  return (
    <div className="song-card">
      <div className="gift-head">
        <div className="kicker">{isOwner ? "Ваша песня" : `🎁 Подарок · ${occasion}`}</div>
        <h1>{isOwner ? song.title : `${song.name}, это для тебя!`}</h1>
        <p>{isOwner ? `🎁 ${song.name} · ${occasion}` : "Кто-то очень тебя любит и написал песню только про тебя"}</p>
      </div>

      {song.status === "failed" ? (
        <div className="gen">
          <h2>Не получилось записать песню 😔</h2>
          <p style={{ color: "var(--ink-soft)" }}>{song.error || "Попробуйте ещё раз — обычно со второй попытки всё получается."}</p>
          <Link href="/#create" className="btn btn-primary" style={{ marginTop: 16 }}>Попробовать снова</Link>
        </div>
      ) : !track ? (
        <div className="gen" aria-live="polite">
          <Cover spinning />
          <h2>{isOwner ? "Записываем вашу песню…" : "Песня ещё записывается…"}</h2>
          <p style={{ color: "var(--ink-soft)", margin: "8px 0 0" }}>Обычно это 1–3 минуты. Можно не обновлять страницу.</p>
          <ul className="gen-steps">
            {GEN_STEPS.map((s, i) => (
              <li key={s} className={i < genIdx ? "done" : i === genIdx ? "cur" : ""}>
                <span className="dot">{i < genIdx ? "✓" : ""}</span>{s}
              </li>
            ))}
          </ul>
          {isOwner && (
            <>
              <div className="song-actions"><button className="btn btn-ghost" onClick={share}>🔗 Скопировать ссылку уже сейчас</button></div>
              <p className="share-hint">Ссылкой можно поделиться заранее — песня появится, как только запишется.</p>
            </>
          )}
        </div>
      ) : (
        <>
          {playable.length > 1 && (
            <div className="versions">
              <div className="seg" role="group" aria-label="Версия">
                {playable.map((_, i) => (
                  <button key={i} aria-pressed={version === i} onClick={() => setVersion(i)}>Версия {i + 1}</button>
                ))}
              </div>
            </div>
          )}
          <Player track={track} title={song.title} subtitle={`🎁 ${song.name}${song.status === "streaming" ? " · дозаписывается…" : ""}`} />
          <div className="song-actions">
            <button className="btn btn-primary" onClick={share}>🔗 Отправить {isOwner ? song.name : "ссылку"}</button>
            {isOwner && <button className="btn btn-ghost" onClick={() => setPaywall(true)}>⬇ Скачать MP3</button>}
          </div>
          {isOwner && <p className="share-hint">Получатель откроет песню по ссылке без регистрации.</p>}
        </>
      )}

      {song.lyrics && <Lyrics text={song.lyrics} />}

      {!isOwner && (
        <div className="cta-strip">
          <h3>Хочешь так же удивить друга?</h3>
          <p>Песня по вашей истории за пару минут — бесплатно.</p>
          <Link href="/#create" className="btn btn-primary">Создать песню</Link>
        </div>
      )}

      {paywall && <Paywall quality={song.quality} onClose={() => setPaywall(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
