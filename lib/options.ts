// Справочники для формы создания песни. value уходит в API, label видит пользователь.

export type Option = { value: string; label: string; emoji?: string; hint?: string };

export const RECIPIENTS: Option[] = [
  { value: "girlfriend", label: "Подруге", emoji: "👭" },
  { value: "friend", label: "Другу", emoji: "🤝" },
  { value: "mom", label: "Маме", emoji: "👩" },
  { value: "dad", label: "Папе", emoji: "👨" },
  { value: "beloved_f", label: "Любимой", emoji: "🌹" },
  { value: "beloved_m", label: "Любимому", emoji: "💘" },
  { value: "wife", label: "Жене", emoji: "👰" },
  { value: "husband", label: "Мужу", emoji: "🤵" },
  { value: "sibling", label: "Сестре / брату", emoji: "🫶" },
  { value: "child", label: "Ребёнку", emoji: "🧸" },
  { value: "colleague", label: "Коллеге", emoji: "💼" },
  { value: "other", label: "Другое", emoji: "✨" },
];

export const OCCASIONS: Option[] = [
  { value: "birthday", label: "День рождения", emoji: "🎂" },
  { value: "jubilee", label: "Юбилей", emoji: "🎉" },
  { value: "anniversary", label: "Годовщина", emoji: "🥂" },
  { value: "wedding", label: "Свадьба", emoji: "💍" },
  { value: "love", label: "Признание в любви", emoji: "💕" },
  { value: "thanks", label: "Благодарность", emoji: "🙏" },
  { value: "newyear", label: "Новый год", emoji: "🎄" },
  { value: "sorry", label: "Извинение", emoji: "🥺" },
  { value: "justbecause", label: "Просто так", emoji: "☀️" },
];

export const GENRES: Option[] = [
  { value: "pop", label: "Поп", emoji: "🎤", hint: "modern russian pop, catchy hook, bright synths" },
  { value: "ballad", label: "Баллада", emoji: "🎹", hint: "emotional piano ballad, strings, heartfelt" },
  { value: "acoustic", label: "Акустика", emoji: "🎸", hint: "warm acoustic guitar, intimate, folk-pop" },
  { value: "dance", label: "Танцевальная", emoji: "🪩", hint: "upbeat dance pop, four on the floor, party" },
  { value: "rock", label: "Рок", emoji: "🤘", hint: "energetic pop-rock, electric guitars, live drums" },
  { value: "rap", label: "Рэп", emoji: "🎧", hint: "russian hip-hop, punchy beat, rhythmic flow" },
  { value: "rnb", label: "R&B", emoji: "🌙", hint: "smooth r&b, soulful vocals, groovy bass" },
  { value: "chanson", label: "Шансон", emoji: "🎻", hint: "russian chanson, accordion, guitar, soulful" },
  { value: "jazz", label: "Джаз", emoji: "🎷", hint: "swing jazz, brass section, upright bass" },
  { value: "disco80", label: "Диско 80-х", emoji: "🕺", hint: "80s italo disco, retro synths, groovy" },
  { value: "kids", label: "Детская", emoji: "🧸", hint: "cheerful children's song, playful, simple melody" },
  { value: "lofi", label: "Лоу-фай", emoji: "☁️", hint: "chill lo-fi pop, mellow, dreamy" },
];

export const MOODS: Option[] = [
  { value: "touching", label: "Трогательная", emoji: "🥹" },
  { value: "fun", label: "Весёлая", emoji: "😄" },
  { value: "funny", label: "Смешная", emoji: "😂" },
  { value: "romantic", label: "Романтичная", emoji: "💞" },
  { value: "epic", label: "Торжественная", emoji: "✨" },
];

export const VOICES: Option[] = [
  { value: "f", label: "Женский", emoji: "👩‍🎤" },
  { value: "m", label: "Мужской", emoji: "👨‍🎤" },
];

export const SINGERS: Option[] = [
  { value: "me", label: "От меня", emoji: "💌" },
  { value: "ded_moroz", label: "Дед Мороз", emoji: "🎅" },
  { value: "snegurochka", label: "Снегурочка", emoji: "❄️" },
];

export const LANGUAGES: Option[] = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];

export type Quality = "standard" | "premium";

export const QUALITIES: { value: Quality; label: string; price: number; perks: string[] }[] = [
  {
    value: "standard",
    label: "Стандарт",
    price: 290,
    perks: ["Две версии песни на выбор", "Звучание как на радио", "MP3 после оплаты"],
  },
  {
    value: "premium",
    label: "Супер-качество",
    price: 590,
    perks: ["Новейшая модель Suno", "Живее вокал и аранжировка", "MP3 320 kbps после оплаты"],
  },
];

export const STORY_HINTS = [
  "Как вы познакомились",
  "Смешной случай, который вы оба помните",
  "Любимая фраза или словечко",
  "Чем увлекается",
  "За что вы её/его любите",
  "Чего пожелать",
];

export function labelOf(list: Option[], value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}
