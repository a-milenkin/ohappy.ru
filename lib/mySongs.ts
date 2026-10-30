// Песни, созданные в этом браузере (до появления аккаунтов). Хранится id + ключ владельца.
export type MySong = { id: string; key: string; title: string; name: string; createdAt: number };

const KEY = "ohappy:songs";

export function readMySongs(): MySong[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addMySong(s: MySong) {
  try {
    localStorage.setItem(KEY, JSON.stringify([s, ...readMySongs().filter((x) => x.id !== s.id)].slice(0, 100)));
  } catch {}
}

export function ownerKeyFor(id: string) {
  return readMySongs().find((s) => s.id === id)?.key;
}
