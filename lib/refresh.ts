import { saveSong, type Song } from "./song";
import { getMusicTask } from "./suno";

// Пока песня не готова — спрашиваем kie.ai о статусе и сохраняем результат.
export async function refreshSong(song: Song): Promise<Song> {
  if (song.status === "ready" || song.status === "failed") return song;
  try {
    const state = await getMusicTask(song.taskId);
    const changed =
      state.status !== song.status || JSON.stringify(state.tracks) !== JSON.stringify(song.tracks);
    if (!changed) return song;
    const next: Song = { ...song, status: state.status, error: state.error, tracks: state.tracks.length ? state.tracks : song.tracks };
    await saveSong(next);
    return next;
  } catch (e) {
    console.error("refreshSong", e);
    return song;
  }
}
