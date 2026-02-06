import { useMemo, useState } from 'react';
import UploadBox from './components/UploadBox';
import SkillList from './components/SkillList';
import EvidencePanel from './components/EvidencePanel';
import Timeline from './components/Timeline';
import JobInput from './components/JobInput';
import MatchResults from './components/MatchResults';
import { loadState, saveState, upsertSkills, addJobMatch } from './utils/storage';
import { extractTextFromPDF, extractTextFromDocx, detectType, extractMetadata } from './utils/textExtraction';
import { calculateConfidence, extractSkills } from './utils/skills';
import { compareResumeToJob, extractJobRequirements } from './lib/semanticMatching';

export default function App() {
  const [state, setState] = useState(loadState);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [busy, setBusy] = useState(false);
  const [jobBusy, setJobBusy] = useState(false);
  const [jobError, setJobError] = useState('');

  const latestJobMatch = state.jobMatches?.[0] ?? null;

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

  async function handleJobPaste(jobDescription) {
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      setJobError('Paste a job description to analyze.');
      return;
    }

    const resumeUpload = state.uploads.find((upload) => upload.type === 'resume');
    if (!resumeUpload) {
      setJobError('Upload a resume first so we can compare it to the job description.');
      return;
    }

    setJobError('');
    setJobBusy(true);
    try {
      const requirements = await extractJobRequirements(trimmed);
      const match = await compareResumeToJob(resumeUpload.text, trimmed);
      const analyzedAt = new Date().toISOString();
      const jobMatch = {
        jobId: `job_${Date.now()}`,
        jobDescription: trimmed,
        matchScore: match.overallScore,
        matchType: match.matchType,
        analyzedAt,
        uploadId: resumeUpload.id,
        requirements
      };

      const next = addJobMatch(state, jobMatch);
      setState(next);
      saveState(next);
    } finally {
      setJobBusy(false);
    }
  }

  return (
    <main className="app">
      <h1>CareerGraph · Phase 0 MVP</h1>
      <p className="meta">Browser-only resume/job parsing, skill extraction, confidence scoring, and local timeline.</p>
      <UploadBox onUpload={handleUpload} />
      {busy && <p>Processing upload...</p>}
      <section className="card job-card">
        <JobInput onJobPaste={handleJobPaste} disabled={jobBusy} />
        {jobBusy && <p>Analyzing job match...</p>}
        {jobError && <p className="warning">{jobError}</p>}
      </section>
      {latestJobMatch && (
        <section className="card">
          <MatchResults score={latestJobMatch.matchScore} matchType={latestJobMatch.matchType} />
        </section>
      )}
      <div className="grid">
        <SkillList skills={skillsWithConfidence} onSelect={setSelectedSkill} />
        <EvidencePanel skill={selectedSkill} />
      </div>
      <Timeline skill={selectedSkill} />
    </main>
  );
}
