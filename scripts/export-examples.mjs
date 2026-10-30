// Выгружает готовые песни из .data в public/examples и пишет lib/examples.ts.
// Ссылки kie.ai живут 14 дней, поэтому примеры храним у себя.
// Использование: node scripts/export-examples.mjs examples.config.json
import { readFile, writeFile } from "fs/promises";

const config = JSON.parse(await readFile(process.argv[2], "utf8"));
const out = [];

for (const ex of config) {
  const song = JSON.parse(await readFile(`.data/song_${ex.id}.json`, "utf8"));
  if (song.status !== "ready") throw new Error(`${ex.id}: песня ещё не готова (${song.status})`);
  const track = song.tracks[ex.track ?? 0];
  for (const [url, file] of [[track.audioUrl, `${ex.slug}.mp3`]]) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    await writeFile(`public/examples/${file}`, Buffer.from(await res.arrayBuffer()));
  }
  out.push({
    slug: ex.slug,
    title: song.title,
    forWhom: ex.forWhom,
    tag: ex.tag,
    genre: ex.genre,
    story: ex.story,
    duration: Math.round(track.duration ?? 0),
    audio: `/examples/${ex.slug}.mp3`,
    lyrics: song.lyrics,
  });
  console.log("ok", ex.slug, song.title);
}

await writeFile(
  "lib/examples.ts",
  `// Сгенерировано scripts/export-examples.mjs — примеры песен на лендинге.
export type Example = {
  slug: string;
  title: string;
  forWhom: string;
  tag: string;
  genre: string;
  story: string;
  duration: number;
  audio: string;
  lyrics: string;
};

export const EXAMPLES: Example[] = ${JSON.stringify(out, null, 2)};
`,
);
