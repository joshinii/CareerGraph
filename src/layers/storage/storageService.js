const STORAGE_VERSION = 1;
const SKILL_KEY = 'careergraph_skillgraph';
const JOB_KEY = 'careergraph_jobmatches';
const UPLOAD_KEY = 'careergraph_uploads';

const emptyState = {
  skillGraph: [],
  uploads: [],
  jobMatches: []
};

function safeParse(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return { version: STORAGE_VERSION, data: null };
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeLoadKey(key) {
  const payload = safeParse(key);
  if (!payload || payload.version !== STORAGE_VERSION) return null;
  return payload.data;
}

export function loadState() {
  try {
    const skillGraph = safeLoadKey(SKILL_KEY) ?? [];
    const uploads = safeLoadKey(UPLOAD_KEY) ?? [];
    const jobMatches = safeLoadKey(JOB_KEY) ?? [];
    return { data: { skillGraph, uploads, jobMatches }, corrupted: false };
  } catch {
    return { data: { ...emptyState }, corrupted: true };
  }
}

function saveKey(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, data }));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

export function saveState(state) {
  saveKey(SKILL_KEY, state.skillGraph);
  saveKey(UPLOAD_KEY, state.uploads);
  saveKey(JOB_KEY, state.jobMatches);
}

export function clearStorage() {
  localStorage.removeItem(SKILL_KEY);
  localStorage.removeItem(JOB_KEY);
  localStorage.removeItem(UPLOAD_KEY);
}

export function mergeUpload(state, { upload, skillFindings }) {
  const today = new Date().toISOString().slice(0, 10);
  const skillMap = new Map(state.skillGraph.map((skill) => [skill.name.toLowerCase(), skill]));

  skillFindings.forEach((finding) => {
    const key = finding.skill.toLowerCase();
    const existing = skillMap.get(key);
    if (!existing) {
      skillMap.set(key, {
        id: `${key.replace(/\s+/g, '_')}_${Date.now()}`,
        name: finding.skill,
        category: finding.category,
        evidence: [finding],
        mentions: 1,
        firstSeen: today,
        lastSeen: today,
        timeline: [{ date: today, uploadId: upload.id, action: 'discovered' }]
      });
      return;
    }

    existing.evidence.push(finding);
    existing.mentions += 1;
    existing.lastSeen = today;
    existing.timeline.push({ date: today, uploadId: upload.id, action: 'reinforced' });
  });

  const uploads = [upload, ...state.uploads];
  return { ...state, skillGraph: [...skillMap.values()], uploads };
}

export function addJobMatch(state, match) {
  return { ...state, jobMatches: [match, ...state.jobMatches] };
}
