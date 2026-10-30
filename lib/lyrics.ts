// Текст песни и стиль для Suno пишет Claude. Без ключа — шаблонный демо-текст.
import { GENRES, MOODS, OCCASIONS, RECIPIENTS, labelOf } from "./options";
import type { SongBrief } from "./song";

export type LyricsDraft = { title: string; style: string; lyrics: string };

const SYSTEM = `Ты — сонграйтер, который пишет персональные песни-подарки на русском языке.
Пишешь живо, конкретно и с юмором там, где он уместен. Никаких штампов вроде «пусть сбудутся мечты» и «счастья, здоровья».
Каждая строка должна опираться на детали из истории: имена, случаи, словечки, увлечения.
Ритм ровный, рифма точная, строки короткие и поются легко. Имя адресата звучит в припеве.

Структура для Suno (теги в квадратных скобках на английском):
[Intro] (необязательно, 1-2 строки или пусто)
[Verse 1] 4-8 строк
[Pre-Chorus] 2-4 строки (необязательно)
[Chorus] 4 строки, запоминающийся хук с именем
[Verse 2] 4-8 строк
[Chorus]
[Bridge] 2-4 строки
[Final Chorus]
[Outro] 1-2 строки
Общая длина — до 2200 символов.

Ответь строго JSON без пояснений и markdown:
{"title": "короткое название песни на языке песни", "style": "теги стиля для Suno на английском через запятую: жанр, инструменты, темп, настроение, тип вокала; до 200 символов", "lyrics": "полный текст с тегами секций"}`;

const SINGERS: Record<SongBrief["from"], string> = {
  me: "от лица дарителя (я / мы)",
  ded_moroz: "от лица Деда Мороза: он сам обращается к ребёнку, хвалит за год, вспоминает его успехи и обещает подарок; добрый, басовитый, сказочный тон",
  snegurochka: "от лица Снегурочки: она обращается к ребёнку, зовёт в зимнюю сказку, хвалит за год; нежный, весёлый, сказочный тон",
};

function userPrompt(b: SongBrief) {
  const genre = GENRES.find((g) => g.value === b.genre);
  return [
    `Кому: ${labelOf(RECIPIENTS, b.recipient)}`,
    `Имя: ${b.name}`,
    `Повод: ${labelOf(OCCASIONS, b.occasion)}`,
    `Жанр: ${genre?.label ?? b.genre} (${genre?.hint ?? ""})`,
    `Настроение: ${labelOf(MOODS, b.mood)}`,
    `Голос: ${b.voice === "f" ? "женский" : "мужской"}`,
    `Язык песни: ${b.language === "en" ? "английский" : "русский"}`,
    `От чьего имени поётся: ${SINGERS[b.from]}`,
    `История и детали:\n${b.story || "(деталей нет — напиши тёплую универсальную песню, но с именем)"}`,
  ].join("\n");
}

export async function writeLyrics(brief: SongBrief): Promise<LyricsDraft> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return demoLyrics(brief);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 6000,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt(brief) }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text: string = data.content?.find((c: { type: string }) => c.type === "text")?.text ?? "";
  if (data.stop_reason === "max_tokens") throw new Error("Claude: ответ обрезан по max_tokens");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const draft = JSON.parse(json) as LyricsDraft;
  return {
    title: String(draft.title).slice(0, 80),
    style: withVoice(String(draft.style), brief).slice(0, 900),
    lyrics: String(draft.lyrics).slice(0, 4800),
  };
}

// Стиль по умолчанию, если пользователь написал текст сам.
export function defaultStyle(brief: SongBrief) {
  const genre = GENRES.find((g) => g.value === brief.genre)?.hint ?? "pop";
  const mood: Record<string, string> = {
    touching: "heartfelt, emotional",
    fun: "upbeat, joyful",
    funny: "playful, humorous",
    romantic: "romantic, tender",
    epic: "anthemic, celebratory",
  };
  return withVoice(`${genre}, ${mood[brief.mood] ?? "warm"}`, brief);
}

function withVoice(style: string, b: SongBrief) {
  const voice = b.voice === "f" ? "female vocals" : "male vocals";
  const lang = b.language === "en" ? "english lyrics" : "russian lyrics";
  const extra = [voice, lang].filter((s) => !style.toLowerCase().includes(s));
  return [style, ...extra].join(", ");
}

function demoLyrics(b: SongBrief): LyricsDraft {
  const n = b.name || "друг";
  return {
    title: `Песня для ${n}`,
    style: defaultStyle(b),
    lyrics: `[Verse 1]
Этот день начался с солнца на стекле,
Кто-то тихо улыбнулся о тебе.
Мы собрали все слова, что берегли,
Чтобы в песню их сегодня принести.

[Chorus]
${n}, ${n}, это всё для тебя,
Звёзды светят ярче, ведь сегодня — твой день!
${n}, ${n}, подпевай и смейся,
Пусть этот год будет лучшим из всех!

[Verse 2]
Помнишь, как смеялись мы до самых слёз,
Как ловили ветер и не брали всерьёз.
Ты умеешь делать праздник из пустяка —
Вот за это любим мы тебя наверняка.

[Chorus]
${n}, ${n}, это всё для тебя,
Звёзды светят ярче, ведь сегодня — твой день!

[Outro]
С днём рождения, ${n}!`,
  };
}
