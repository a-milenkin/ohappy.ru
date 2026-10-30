import { randomBytes } from "crypto";
import { getJSON, setJSON } from "./store";
import type { Quality } from "./options";

export type SongBrief = {
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
};

export type Track = {
  id: string;
  audioUrl: string;
  streamUrl?: string;
  imageUrl?: string;
  duration?: number;
};

export type SongStatus = "generating" | "streaming" | "ready" | "failed";

export type Song = {
  id: string;
  ownerKey: string;
  createdAt: number;
  brief: SongBrief;
  title: string;
  style: string;
  lyrics: string;
  taskId: string;
  status: SongStatus;
  error?: string;
  tracks: Track[];
};

// То, что можно отдать любому, у кого есть ссылка: без истории и ключа владельца.
export type PublicSong = Omit<Song, "ownerKey" | "brief" | "taskId"> & {
  name: string;
  occasion: string;
  quality: Quality;
};

export function newId(bytes = 6) {
  return randomBytes(bytes).toString("base64url");
}

export const songKey = (id: string) => `song:${id}`;
export const taskKey = (taskId: string) => `task:${taskId}`;

export async function loadSong(id: string) {
  return getJSON<Song>(songKey(id));
}

export async function saveSong(song: Song) {
  await setJSON(songKey(song.id), song);
}

export function toPublic(song: Song): PublicSong {
  const { ownerKey: _o, brief, taskId: _t, ...rest } = song;
  return { ...rest, name: brief.name, occasion: brief.occasion, quality: brief.quality };
}
