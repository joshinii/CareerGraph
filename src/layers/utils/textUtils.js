const CURRENT_YEAR = new Date().getFullYear();

export function splitSentences(text) {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .flatMap((chunk) => chunk.split(/\s*[•●■◦▪▸▹►–—]\s+/))
    .flatMap((chunk) => chunk.split(/\s*;\s+/))
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 5);
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
  const years = matches
    .map((year) => Number(year))
    .filter((year) => year >= 2000 && year <= CURRENT_YEAR);
  if (!years.length) return null;
  return Math.max(...years);
}

export function extractSnippetAroundMatch(sentence, skill) {
  const idx = sentence.toLowerCase().indexOf(skill.toLowerCase());
  if (idx === -1) return sentence.slice(0, 200);

  const radius = 100;
  const start = Math.max(0, idx - radius);
  const end = Math.min(sentence.length, idx + skill.length + radius);
  let snippet = sentence.slice(start, end);

  if (start > 0) snippet = '…' + snippet;
  if (end < sentence.length) snippet = snippet + '…';

  return snippet;
}
