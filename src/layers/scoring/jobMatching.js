import { extractSkillsFromText } from '../extraction/skillExtraction';

function classifyMatch(score) {
  if (score >= 75) return 'STRONG';
  if (score >= 50) return 'MODERATE';
  return 'WEAK';
}

export function buildJobMatch({ resumeSkills, jobDescription, uploadId }) {
  const jobFindings = extractSkillsFromText(jobDescription, {
    source: 'job',
    uploadId,
    uploadName: 'Job Description'
  });

  const jobSkills = [...new Set(jobFindings.map((entry) => entry.skill))];
  const resumeSkillSet = new Set(resumeSkills.map((skill) => skill.name.toLowerCase()));

  const matchedSkills = jobSkills.filter((skill) => resumeSkillSet.has(skill.toLowerCase()));
  const missingSkills = jobSkills.filter((skill) => !resumeSkillSet.has(skill.toLowerCase()));

  const overlap = matchedSkills.length;
  const total = jobSkills.length + resumeSkills.length || 1;
  const matchScore = Math.min(100, Math.round((2 * overlap * 100) / total));

  const skillMatches = jobSkills.map((skill) => ({
    skill,
    status: resumeSkillSet.has(skill.toLowerCase()) ? 'matched' : 'missing'
  }));

  return {
    matchScore,
    matchType: classifyMatch(matchScore),
    jobSkillCount: jobSkills.length,
    resumeSkillCount: resumeSkills.length,
    jobSkills,
    matchedSkills,
    missingSkills,
    skillMatches
  };
}
