"use client";
import { useEffect, useRef, useState } from "react";

// Диктовка через встроенное распознавание речи браузера (Chrome, Яндекс, Edge, Safari).
// Где его нет (Firefox) — кнопка не показывается.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function createRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export default function Dictation({ lang, onText }: { lang: string; onText: (text: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const rec = useRef<Recognition | null>(null);
  const wanted = useRef(false);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  useEffect(() => {
    setSupported(!!createRecognition());
    return () => {
      wanted.current = false;
      rec.current?.stop();
    };
  }, []);

  const start = () => {
    const r = createRecognition();
    if (!r) return;
    r.lang = lang === "en" ? "en-US" : "ru-RU";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) onTextRef.current(res[0].transcript.trim());
        else live += res[0].transcript;
      }
      setInterim(live);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("Разрешите доступ к микрофону в браузере, чтобы надиктовать");
        wanted.current = false;
      } else if (e.error === "audio-capture") {
        setError("Микрофон не найден");
        wanted.current = false;
      }
    };
    // Браузер сам останавливает распознавание после паузы — перезапускаем, пока человек не нажал «Стоп».
    r.onend = () => {
      setInterim("");
      if (wanted.current) {
        try { r.start(); return; } catch {}
      }
      setListening(false);
    };
    rec.current = r;
    wanted.current = true;
    setError("");
    try {
      r.start();
      setListening(true);
    } catch {
      setError("Не получилось включить микрофон");
    }
  };

  const stop = () => {
    wanted.current = false;
    rec.current?.stop();
    setListening(false);
  };

  if (!supported) return null;

  return (
    <div className="dictation">
      <button type="button" className={`mic-btn${listening ? " on" : ""}`} onClick={listening ? stop : start}
        aria-pressed={listening} aria-label={listening ? "Остановить диктовку" : "Надиктовать голосом"}>
        <span className="mic-ico" aria-hidden>
          {listening ? (
            <svg width="18" height="18" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 20 20"><rect x="7" y="2" width="6" height="10" rx="3" fill="currentColor" /><path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
          )}
        </span>
        {listening ? "Слушаю… нажмите, чтобы закончить" : "Надиктовать голосом"}
        {listening && <span className="mic-wave" aria-hidden><i /><i /><i /><i /></span>}
      </button>
      {listening && interim && <p className="mic-interim" aria-live="polite">{interim}</p>}
      {!listening && !error && <span className="mic-hint">Не хочется печатать? Просто расскажите вслух</span>}
      {error && <p className="mic-error" role="alert">{error}</p>}
    </div>
  );
}
