import { findRecentYear } from '../utils/textUtils';

const CONTEXT_KEYWORDS = [
  'built',
  'implemented',
  'designed',
  'developed',
  'owned',
  'led',
  'optimized',
  'shipped',
  'migrated',
  'maintained',
  'architected'
];

function scoreEvidence(mentions) {
  const score = Math.min(30, mentions * 6);
  return { score, max: 30, explanation: `${mentions} mention(s) mapped to ${score} evidence points.` };
}

function scoreContext(evidence) {
  if (!evidence.length) {
    return { score: 0, max: 40, explanation: 'No contextual sentences captured.' };
  }

  const hits = evidence.filter((entry) =>
    CONTEXT_KEYWORDS.some((keyword) => entry.sentence.toLowerCase().includes(keyword))
  ).length;
  const ratio = hits / evidence.length;
  const score = Math.round(ratio * 40);
  return {
    score,
    max: 40,
    explanation: `${hits}/${evidence.length} sentences show hands-on usage context.`
  };
}

function scoreRecency(evidence) {
  const years = evidence
    .map((entry) => findRecentYear(entry.sentence))
    .filter((year) => year);
  const mostRecent = years.length ? Math.max(...years) : null;
  if (!mostRecent) {
    return { score: 8, max: 30, explanation: 'No explicit dates found; assigning baseline recency.' };
  }
  const age = new Date().getFullYear() - mostRecent;
  let score = 10;
  if (age <= 1) score = 30;
  else if (age <= 3) score = 22;
  else if (age <= 5) score = 16;
  else score = 10;
  return {
    score,
    max: 30,
    explanation: `Most recent usage in ${mostRecent} (≈${age} year(s) ago).`
  };
}

function scoreJobRelevance(isRelevant) {
  const score = isRelevant ? 20 : 0;
  return {
    score,
    max: 20,
    explanation: isRelevant ? 'Skill appears in the current job description.' : 'Skill not referenced in job.'
  };
}

export function calculateConfidence(skill, jobSkills) {
  const evidenceScore = scoreEvidence(skill.mentions);
  const contextScore = scoreContext(skill.evidence);
  const recencyScore = scoreRecency(skill.evidence);
  const jobScore = scoreJobRelevance(jobSkills?.has(skill.name.toLowerCase()));

  const breakdown = [
    { label: 'Evidence', ...evidenceScore },
    { label: 'Context', ...contextScore },
    { label: 'Recency', ...recencyScore },
    { label: 'Job relevance', ...jobScore }
  ];

  const totalRaw = breakdown.reduce((sum, item) => sum + item.score, 0);
  const maxPossible = breakdown.reduce((sum, item) => sum + item.max, 0);
  const totalScore = Math.min(100, Math.round((totalRaw / maxPossible) * 100));

  return {
    totalScore,
    totalRaw,
    maxPossible,
    breakdown
  };
}
