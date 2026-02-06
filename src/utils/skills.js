const FALLBACK_SKILLS = ['React', 'Redux', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker'];

let nerPipeline;

async function getPipeline() {
  if (nerPipeline) return nerPipeline;
  const { pipeline, env } = await import('@xenova/transformers');
  env.allowLocalModels = true;
  nerPipeline = await pipeline('token-classification', 'Xenova/bert-base-NER', { quantized: true });
  return nerPipeline;
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

export async function extractSkills(text, metadata, source, uploadId) {
  const discoveredAt = new Date().toISOString().slice(0, 10);
  const sentences = splitSentences(text);
  const out = [];

  try {
    const ner = await getPipeline();
    for (const sentence of sentences) {
      const entities = await ner(sentence, { aggregation_strategy: 'simple' });
      const maybeSkills = entities
        .map((e) => e.word)
        .filter((w) => /^[A-Za-z][A-Za-z0-9.+#-]{1,20}$/.test(w));

      maybeSkills.forEach((skill) => {
        out.push({ skill, source, evidence: { sentence, ...metadata }, discoveredAt, uploadId });
      });
    }
  } catch {
    sentences.forEach((sentence) => {
      FALLBACK_SKILLS.forEach((skill) => {
        if (sentence.toLowerCase().includes(skill.toLowerCase())) {
          out.push({ skill, source, evidence: { sentence, ...metadata }, discoveredAt, uploadId });
        }
      });
    });
  }

  const dedup = new Map();
  out.forEach((item) => {
    const key = `${item.skill.toLowerCase()}-${item.evidence.sentence}`;
    if (!dedup.has(key)) dedup.set(key, item);
  });
  return [...dedup.values()];
}

export function calculateConfidence(evidence, latestYears, jobMatch) {
  let score = 0;
  const mentions = evidence.length;
  score += mentions > 1 ? 30 : mentions === 1 ? 15 : 0;

  if (latestYears) {
    const end = Number(String(latestYears).split('-')[1]?.replace(/\D/g, '') || 0);
    const age = new Date().getFullYear() - end;
    if (age < 1) score += 20;
    else if (age <= 3) score += 15;
    else score += 5;
  }

  const hasDepth = evidence.some((e) => /(using|with)\s+\w+\s+(and|&)\s+\w+/i.test(e.evidence.sentence));
  if (hasDepth) score += 10;
  if (latestYears) score += 5;

  if (jobMatch) score += 15;

  return Math.min(100, score);
}
