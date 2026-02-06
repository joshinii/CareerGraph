const KEY = 'careerGraph.phase0';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { skillGraph: [], uploads: [], jobMatches: [] };
    const parsed = JSON.parse(raw);
    return {
      skillGraph: parsed.skillGraph ?? [],
      uploads: parsed.uploads ?? [],
      jobMatches: parsed.jobMatches ?? []
    };
  } catch {
    return { skillGraph: [], uploads: [], jobMatches: [] };
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function upsertSkills(state, newSkills, upload) {
  const date = new Date().toISOString().slice(0, 10);
  const map = new Map(state.skillGraph.map((s) => [s.name.toLowerCase(), s]));

  newSkills.forEach((skill) => {
    const key = skill.skill.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        id: `${key.replace(/\s+/g, '_')}_${Date.now()}`,
        name: skill.skill,
        evidence: [skill],
        timeline: [{ action: 'discovered', date, uploadId: upload.id }],
        lastUpdated: date,
        discoveredAt: date
      });
      return;
    }

    const existing = map.get(key);
    existing.evidence.push(skill);
    existing.timeline.push({ action: 'upgraded', date, uploadId: upload.id });
    existing.lastUpdated = date;
  });

  const uploads = [upload, ...state.uploads];
  return { ...state, skillGraph: [...map.values()], uploads };
}

export function addJobMatch(state, match) {
  const jobMatches = [match, ...(state.jobMatches ?? [])];
  return { ...state, jobMatches };
}
