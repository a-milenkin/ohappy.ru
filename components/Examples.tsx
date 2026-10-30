"use client";
import { useEffect, useRef, useState } from "react";
import { EXAMPLES, type Example } from "@/lib/examples";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function ExampleCard({ ex }: { ex: Example }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  // Одновременно играет только один пример.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== ex.slug) audio.current?.pause();
    };
    window.addEventListener("ohappy:play", onOther);
    return () => window.removeEventListener("ohappy:play", onOther);
  }, [ex.slug]);

  const toggle = () => {
    const a = audio.current!;
    if (a.paused) {
      window.dispatchEvent(new CustomEvent("ohappy:play", { detail: ex.slug }));
      a.play().catch(() => {});
    } else a.pause();
  };

  return (
    <article className={`ex-card${playing ? " is-playing" : ""}`}>
      <div className="ex-cover">
        <div className={`ex-art ex-art-${ex.slug}`} aria-hidden>
          <span className="ex-art-emoji">{ex.tag.split(" ")[0]}</span>
          <span className="ex-art-name">{ex.title}</span>
        </div>
        <span className="ex-tag">{ex.tag}</span>
        <button className="ex-play" onClick={toggle} aria-label={playing ? "Пауза" : `Слушать песню для ${ex.forWhom}`}>
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 20 20"><rect x="4" y="3" width="4.5" height="14" rx="1.5" fill="currentColor" /><rect x="11.5" y="3" width="4.5" height="14" rx="1.5" fill="currentColor" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 20 20"><path d="M5 2.8v14.4c0 .8.9 1.3 1.6.8l11-7.2c.6-.4.6-1.2 0-1.6l-11-7.2C5.9 1.5 5 2 5 2.8z" fill="currentColor" /></svg>
          )}
        </button>
      </div>
      <div className="ex-body">
        <h3>{ex.title}</h3>
        <p className="ex-meta">Для {ex.forWhom} · {ex.genre}</p>
        <div className="ex-progress" aria-hidden><span style={{ width: `${(t / ex.duration) * 100}%` }} /></div>
        <div className="ex-time"><span>{fmt(t)}</span><span>{fmt(ex.duration)}</span></div>
        <p className="ex-story">{ex.story}</p>
        <button className="ex-lyrics-btn" onClick={() => setShowLyrics((v) => !v)} aria-expanded={showLyrics}>
          {showLyrics ? "Скрыть текст" : "Показать текст"}
        </button>
        {showLyrics && <pre className="ex-lyrics">{ex.lyrics.replace(/^\s*\[.+\]\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim()}</pre>}
      </div>
      <audio ref={audio} src={ex.audio} preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} />
    </article>
  );
}

export default function Examples() {
  return (
    <div className="ex-grid swipe">
      {EXAMPLES.map((ex) => <ExampleCard key={ex.slug} ex={ex} />)}
    </div>
  );
}
