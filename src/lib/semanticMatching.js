import { env, pipeline } from '@xenova/transformers';

let embeddingModel = null;

export async function getEmbedding(text) {
  if (!embeddingModel) {
    env.allowLocalModels = true;
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const embedding = await embeddingModel(text, {
    pooling: 'mean',
    normalize: true
  });

  return Array.from(embedding.data);
}

export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

export async function compareResumeToJob(resumeText, jobDescription) {
  const resumeEmbedding = await getEmbedding(resumeText);
  const jobEmbedding = await getEmbedding(jobDescription);

  const overallScore = Math.round(cosineSimilarity(resumeEmbedding, jobEmbedding) * 100);

  return {
    overallScore,
    matchType: overallScore >= 75 ? 'Strong' : overallScore >= 50 ? 'Moderate' : 'Weak'
  };
}

export async function extractJobRequirements(jobDescription) {
  const sections = jobDescription.split(/\n\n+/);

  const requirements = {
    skills: [],
    experience: null,
    seniority: null,
    rawText: jobDescription
  };

  sections.forEach((section) => {
    const lower = section.toLowerCase();
    if (lower.includes('require') || lower.includes('skill')) {
      const lines = section.split('\n');
      requirements.skills.push(...lines.filter((line) => line.trim().length > 5));
    }
    if (lower.includes('year') || lower.includes('experience')) {
      requirements.experience = section.slice(0, 200);
    }
  });

  return requirements;
}
