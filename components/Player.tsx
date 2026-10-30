"use client";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/song";

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export function Cover({ src, spinning }: { src?: string; spinning?: boolean }) {
  return (
    <div className={`cover${spinning ? " spinning" : ""}`}>
      {src ? <img src={src} alt="" /> : <div className="vinyl" />}
    </div>
  );
}

export default function Player({ track, title, subtitle }: { track: Track; title: string; subtitle: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(track.duration ?? 0);
  const src = track.audioUrl || track.streamUrl || "";

  useEffect(() => {
    setPlaying(false);
    setT(0);
    setDur(track.duration ?? 0);
  }, [src, track.duration]);

  const toggle = () => {
    const a = audio.current!;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <div className="player">
      <Cover src={track.imageUrl} spinning={playing} />
      <div>
        <p className="player-title">{title}</p>
        <p className="player-sub">{subtitle}</p>
        <div className="player-row">
          <button className="play" onClick={toggle} aria-label={playing ? "Пауза" : "Слушать"}>
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="3" width="4.5" height="14" rx="1.5" fill="currentColor" /><rect x="11.5" y="3" width="4.5" height="14" rx="1.5" fill="currentColor" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 2.8v14.4c0 .8.9 1.3 1.6.8l11-7.2c.6-.4.6-1.2 0-1.6l-11-7.2C5.9 1.5 5 2 5 2.8z" fill="currentColor" /></svg>
            )}
          </button>
          <div className="bar">
            <input type="range" min={0} max={dur || 1} step={0.1} value={t} aria-label="Перемотка"
              onChange={(e) => { const v = Number(e.target.value); audio.current!.currentTime = v; setT(v); }} />
            <div className="time"><span>{fmt(t)}</span><span>{fmt(dur)}</span></div>
          </div>
        </div>
      </div>
      <audio ref={audio} src={src} preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)} />
    </div>
  );
}
