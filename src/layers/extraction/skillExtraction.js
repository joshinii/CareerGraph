import { getAllSkills, getSkillCategory } from '../utils/skillsTaxonomy';
import { buildSkillRegex, splitSentences, extractSnippetAroundMatch } from '../utils/textUtils';

const SKILL_PATTERNS = getAllSkills().map((skill) => ({
  skill,
  pattern: buildSkillRegex(skill),
  category: getSkillCategory(skill)
}));

export function extractSkillsFromText(text, { source, uploadId, uploadName }) {
  const sentences = splitSentences(text);
  const findings = [];

  sentences.forEach((sentence, index) => {
    SKILL_PATTERNS.forEach(({ skill, pattern, category }) => {
      if (pattern.test(sentence)) {
        findings.push({
          skill,
          category,
          sentence,
          sentenceIndex: index,
          snippet: extractSnippetAroundMatch(sentence, skill),
          source,
          uploadId,
          uploadName
        });
      }
    });
  });

  const deduped = new Map();
  findings.forEach((entry) => {
    const key = `${entry.skill}-${entry.sentenceIndex}-${entry.uploadId}-${entry.source}`;
    if (!deduped.has(key)) {
      deduped.set(key, entry);
    }
  });

  return [...deduped.values()];
}
