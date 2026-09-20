// Confident, distinguishable hues for student cards. Deliberately avoids the
// green/red used for positive/negative behaviours so colours never get
// confused with a point gain or loss.
export const STUDENT_COLOURS = [
  "#2563eb", // blue
  "#7c3aed", // violet
  "#c026d3", // fuchsia
  "#d97706", // amber
  "#0891b2", // cyan
  "#db2777", // pink
  "#4f46e5", // indigo
  "#ea580c", // orange
  "#0d9488", // teal
  "#9333ea", // purple
  "#0284c7", // sky
  "#65a30d", // lime-ish green (distinct enough from the emerald accent)
];

export const STUDENT_EMOJIS = [
  "🦊",
  "🐢",
  "🦉",
  "🐝",
  "🐬",
  "🦁",
  "🐯",
  "🐨",
  "🦄",
  "🐙",
  "🐧",
  "🦋",
  "🐳",
  "🐸",
  "🐼",
  "🦈",
  "🐘",
  "🦒",
  "🐿️",
  "🦔",
  "🐺",
  "🦓",
  "🐊",
  "🦖",
  "🐝",
  "🦩",
  "🐡",
  "🦥",
  "🐿️",
  "🦦",
];

export const EMOJI_PICKER_OPTIONS = Array.from(new Set(STUDENT_EMOJIS));

export function colourForIndex(index: number): string {
  return STUDENT_COLOURS[index % STUDENT_COLOURS.length];
}

export function emojiForIndex(index: number): string {
  return STUDENT_EMOJIS[index % STUDENT_EMOJIS.length];
}
