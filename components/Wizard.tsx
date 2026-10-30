"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { addMySong } from "@/lib/mySongs";
import { GENRES, LANGUAGES, MOODS, OCCASIONS, QUALITIES, RECIPIENTS, SINGERS, STORY_HINTS, VOICES, type Quality } from "@/lib/options";

type Form = {
  recipient: string;
  name: string;
  occasion: string;
  story: string;
  genre: string;
  mood: string;
  voice: "f" | "m";
  language: "ru" | "en";
  quality: Quality;
  from: "me" | "ded_moroz" | "snegurochka";
  title: string;
  style: string;
  lyrics: string;
  sig: string; // для какого брифа написан текст
};

const EMPTY: Form = {
  recipient: "girlfriend",
  name: "",
  occasion: "birthday",
  story: "",
  genre: "pop",
  mood: "touching",
  voice: "f",
  language: "ru",
  quality: "standard",
  from: "me",
  title: "",
  style: "",
  lyrics: "",
  sig: "",
};

const DRAFT_KEY = "ohappy:draft";
const STEPS = ["Кому", "История", "Звучание", "Качество", "Текст"];

export default function Wizard() {
  const router = useRouter();
  const [f, setF] = useState<Form>(EMPTY);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<"" | "lyrics" | "song">("");
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);

  // Черновик переживает перезагрузку страницы.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved) setF({ ...EMPTY, ...saved });
    } catch {}
    const occ = new URLSearchParams(location.search).get("occasion");
    if (occ && OCCASIONS.some((o) => o.value === occ)) setF((p) => ({ ...p, occasion: occ }));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
    } catch {}
  }, [f]);

  // Пресеты из блоков лендинга: «Для каждого момента», «Песня от Деда Мороза».
  useEffect(() => {
    const onPreset = (e: Event) => {
      const preset = (e as CustomEvent<Partial<Form>>).detail;
      setF((p) => ({ ...p, from: "me", ...preset }));
      setStep(0);
    };
    window.addEventListener("ohappy:preset", onPreset);
    return () => window.removeEventListener("ohappy:preset", onPreset);
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const briefSig = JSON.stringify([f.recipient, f.name, f.occasion, f.story, f.genre, f.mood, f.voice, f.language, f.from]);

  const go = (n: number) => {
    setError("");
    setStep(n);
    // Прокручиваем, только если верх формы ушёл под шапку.
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < 70) root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function genLyrics() {
    setBusy("lyrics");
    setError("");
    try {
      const res = await fetch("/api/lyrics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setF((p) => ({ ...p, title: data.title, style: data.style, lyrics: data.lyrics, sig: briefSig }));
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Что-то пошло не так");
    } finally {
      setBusy("");
    }
  }

  // На шаге «Текст» пишем текст автоматически, если бриф поменялся.
  useEffect(() => {
    if (step === 4 && f.sig !== briefSig && busy === "") genLyrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function createSong() {
    setBusy("song");
    setError("");
    try {
      const res = await fetch("/api/songs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addMySong({ id: data.id, key: data.ownerKey, title: f.title || `Песня для ${f.name}`, name: f.name, createdAt: Date.now() });
      router.push(`/s/${data.id}`);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Что-то пошло не так");
      setBusy("");
    }
  }

  const who = f.recipient === "friend" || f.recipient === "dad" || f.recipient === "beloved_m" || f.recipient === "husband" ? "нём" : "ней";

  return (
    <div className="wizard" id="create" ref={root}>
      <div className="wz-top">
        <span className="wz-step">Шаг {step + 1} из {STEPS.length} · {STEPS[step]}</span>
        <div className="wz-dots" aria-hidden>
          {STEPS.map((_, i) => (
            <span key={i} className={`${i <= step ? "on" : ""} ${i === step ? "cur" : ""}`} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="wz-body" key="s0">
          <h3 className="wz-title">Кому дарим песню?</h3>
          <p className="wz-sub">Начните прямо сейчас — регистрация не нужна.</p>
          <label className="wz-label" htmlFor="wz-name">Как зовут?</label>
          <input id="wz-name" className="field" placeholder="Например, Оля" value={f.name} maxLength={40} autoComplete="off"
            onChange={(e) => set("name", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && f.name.trim() && go(1)} />
          <span className="wz-label">Кто это для вас</span>
          <div className="chips" role="group" aria-label="Кому">
            {RECIPIENTS.map((o) => (
              <button key={o.value} type="button" className="chip" aria-pressed={f.recipient === o.value} onClick={() => set("recipient", o.value)}>
                <span aria-hidden>{o.emoji}</span>{o.label}
              </button>
            ))}
          </div>
          <span className="wz-label">Повод</span>
          <div className="chips" role="group" aria-label="Повод">
            {OCCASIONS.map((o) => (
              <button key={o.value} type="button" className="chip" aria-pressed={f.occasion === o.value} onClick={() => set("occasion", o.value)}>
                <span aria-hidden>{o.emoji}</span>{o.label}
              </button>
            ))}
          </div>
          {f.occasion === "newyear" && (
            <>
              <span className="wz-label">Кто поёт</span>
              <div className="chips" role="group" aria-label="Кто поёт">
                {SINGERS.map((o) => (
                  <button key={o.value} type="button" className="chip" aria-pressed={f.from === o.value}
                    onClick={() => setF((p) => ({ ...p, from: o.value as Form["from"], voice: o.value === "ded_moroz" ? "m" : o.value === "snegurochka" ? "f" : p.voice }))}>
                    <span aria-hidden>{o.emoji}</span>{o.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="wz-actions">
            <button className="btn btn-primary" disabled={!f.name.trim()} onClick={() => go(1)}>Дальше →</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wz-body" key="s1">
          <h3 className="wz-title">Расскажите о {who}</h3>
          <p className="wz-sub">Пара живых деталей — и песня будет точно про {f.name || "этого человека"}. Можно коротко, списком.</p>
          <textarea className="field" value={f.story} maxLength={1500} autoFocus
            placeholder={`Например: ${f.name || "Оля"} обожает котов и путешествия, всегда опаздывает на 5 минут, но с кофе для всех. Познакомились в универе на паре по философии…`}
            onChange={(e) => set("story", e.target.value)} />
          <div className="counter">{f.story.length} / 1500</div>
          <div className="chips" style={{ marginTop: 8 }}>
            {STORY_HINTS.map((h) => (
              <button key={h} type="button" className="chip add" onClick={() => set("story", (f.story ? f.story.trimEnd() + "\n" : "") + h + ": ")}>
                + {h}
              </button>
            ))}
          </div>
          <div className="wz-actions">
            <button className="btn btn-text" onClick={() => go(0)}>← Назад</button>
            <button className="btn btn-primary" onClick={() => go(2)}>{f.story.trim() ? "Дальше →" : "Пропустить →"}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wz-body" key="s2">
          <h3 className="wz-title">Как должна звучать?</h3>
          <p className="wz-sub">Жанр, настроение и голос.</p>
          <div className="tiles" role="group" aria-label="Жанр">
            {GENRES.map((o) => (
              <button key={o.value} type="button" className="tile" aria-pressed={f.genre === o.value} onClick={() => set("genre", o.value)}>
                <span aria-hidden>{o.emoji}</span><span>{o.label}</span>
              </button>
            ))}
          </div>
          <span className="wz-label">Настроение</span>
          <div className="chips" role="group" aria-label="Настроение">
            {MOODS.map((o) => (
              <button key={o.value} type="button" className="chip" aria-pressed={f.mood === o.value} onClick={() => set("mood", o.value)}>
                <span aria-hidden>{o.emoji}</span>{o.label}
              </button>
            ))}
          </div>
          <div className="row2">
            <div>
              <span className="wz-label">Голос</span>
              <div className="seg" role="group" aria-label="Голос">
                {VOICES.map((o) => (
                  <button key={o.value} type="button" aria-pressed={f.voice === o.value} onClick={() => set("voice", o.value as Form["voice"])}>{o.label}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="wz-label">Язык</span>
              <div className="seg" role="group" aria-label="Язык">
                {LANGUAGES.map((o) => (
                  <button key={o.value} type="button" aria-pressed={f.language === o.value} onClick={() => set("language", o.value as Form["language"])}>{o.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="wz-actions">
            <button className="btn btn-text" onClick={() => go(1)}>← Назад</button>
            <button className="btn btn-primary" onClick={() => go(3)}>Дальше →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wz-body" key="s3">
          <h3 className="wz-title">Выберите качество</h3>
          <p className="wz-sub">Создать и послушать — бесплатно в любом варианте.</p>
          <div className="quality">
            {QUALITIES.map((q) => (
              <button key={q.value} type="button" className="qcard" aria-pressed={f.quality === q.value} onClick={() => set("quality", q.value)}>
                {q.value === "premium" && <span className="badge">Хит</span>}
                <header><h4>{q.label}</h4><span className="price">{q.price} ₽</span></header>
                <ul>{q.perks.map((p) => <li key={p}>{p}</li>)}</ul>
              </button>
            ))}
          </div>
          <div className="free-note">
            <span aria-hidden>💝</span>
            <span>Сейчас ничего платить не нужно. Послушайте песню и поделитесь ссылкой бесплатно — оплата нужна, только если захотите скачать MP3.</span>
          </div>
          <div className="wz-actions">
            <button className="btn btn-text" onClick={() => go(2)}>← Назад</button>
            <button className="btn btn-primary" onClick={() => go(4)}>Написать текст ✍️</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wz-body" key="s4">
          {busy === "lyrics" ? (
            <div className="writing" aria-live="polite">
              <div className="quill" aria-hidden>✍️</div>
              <b style={{ color: "var(--wine)" }}>Пишем текст для {f.name}…</b>
              <span>Подбираем рифмы к вашим историям, это около 30 секунд</span>
            </div>
          ) : (
            <>
              <h3 className="wz-title">Текст песни готов</h3>
              <p className="wz-sub">Поправьте всё, что хочется — именно этот текст споёт вокалист.</p>
              <label className="wz-label" htmlFor="wz-title">Название</label>
              <input id="wz-title" className="field" value={f.title} maxLength={80} onChange={(e) => set("title", e.target.value)} placeholder={`Песня для ${f.name}`} />
              <label className="wz-label" htmlFor="wz-lyrics">Слова</label>
              <textarea id="wz-lyrics" className="field lyrics" value={f.lyrics} maxLength={4800} onChange={(e) => set("lyrics", e.target.value)}
                placeholder="[Verse 1]&#10;Ваш текст…&#10;&#10;[Chorus]&#10;…" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 6 }}>
                <button className="btn btn-text btn-sm" onClick={genLyrics}>↻ Переписать</button>
                <span className="counter" style={{ margin: 0 }}>{f.lyrics.length} / 4800</span>
              </div>
            </>
          )}
          {error && <div className="error" role="alert">{error}</div>}
          <div className="wz-actions">
            <button className="btn btn-text" onClick={() => go(3)} disabled={busy !== ""}>← Назад</button>
            <button className="btn btn-primary" disabled={busy !== "" || !f.lyrics.trim()} onClick={createSong}>
              {busy === "song" ? "Запускаем…" : "Создать песню 🎵"}
            </button>
          </div>
          <p className="wz-note">Бесплатно · Готово за 1–3 минуты</p>
        </div>
      )}

      {error && step !== 4 && <div className="error" role="alert">{error}</div>}
    </div>
  );
}
