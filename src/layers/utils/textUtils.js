export function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildSkillRegex(skill) {
  const escaped = escapeRegExp(skill);
  return new RegExp(`(?<![\\w+#.])${escaped}(?![\\w+#.])`, 'i');
}

export function findRecentYear(text) {
  const matches = text.match(/\b(20\d{2})\b/g) ?? [];
  const years = matches.map((year) => Number(year)).filter((year) => year >= 2000);
  if (!years.length) return null;
  return Math.max(...years);
}
