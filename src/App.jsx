import { useMemo, useState } from 'react';
import UploadBox from './components/UploadBox';
import SkillList from './components/SkillList';
import EvidencePanel from './components/EvidencePanel';
import Timeline from './components/Timeline';
import { loadState, saveState, upsertSkills } from './utils/storage';
import { extractTextFromPDF, extractTextFromDocx, detectType, extractMetadata } from './utils/textExtraction';
import { calculateConfidence, extractSkills } from './utils/skills';

export default function App() {
  const [state, setState] = useState(loadState);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [busy, setBusy] = useState(false);

  const skillsWithConfidence = useMemo(() => {
    const jobSkills = new Set(
      state.skillGraph
        .filter((s) => s.evidence.some((e) => e.source === 'job'))
        .map((s) => s.name.toLowerCase())
    );

    return state.skillGraph.map((skill) => {
      const years = skill.evidence.find((e) => e.evidence.years)?.evidence.years;
      const confidence = calculateConfidence(skill.evidence, years, jobSkills.has(skill.name.toLowerCase()));
      return { ...skill, confidence };
    });
  }, [state.skillGraph]);

  async function handleUpload(file) {
    setBusy(true);
    try {
      const uploadId = `upload_${Date.now()}`;
      const text = file.name.toLowerCase().endsWith('.pdf') ? await extractTextFromPDF(file) : await extractTextFromDocx(file);
      const source = detectType(text);
      const metadata = extractMetadata(text, source);
      const skillEvidence = await extractSkills(text, metadata, source, uploadId);

      const next = upsertSkills(state, skillEvidence, {
        id: uploadId,
        type: source,
        fileName: file.name,
        text,
        metadata,
        uploadedAt: new Date().toISOString()
      });
      setState(next);
      saveState(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app">
      <h1>CareerGraph · Phase 0 MVP</h1>
      <p className="meta">Browser-only resume/job parsing, skill extraction, confidence scoring, and local timeline.</p>
      <UploadBox onUpload={handleUpload} />
      {busy && <p>Processing upload...</p>}
      <div className="grid">
        <SkillList skills={skillsWithConfidence} onSelect={setSelectedSkill} />
        <EvidencePanel skill={selectedSkill} />
      </div>
      <Timeline skill={selectedSkill} />
    </main>
  );
}
