import { useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeUploadBox from './components/ResumeUploadBox';
import SkillList from './components/SkillList';
import EvidencePanel from './components/EvidencePanel';
import JobInputBox from './components/JobInputBox';
import MatchScoreDisplay from './components/MatchScoreDisplay';
import {
  loadState,
  saveState,
  mergeUpload,
  addJobMatch,
  clearStorage
} from './layers/storage/storageService';
import {
  extractTextFromPDF,
  extractTextFromDocx,
  detectDocumentType,
  validateResumeFile
} from './layers/extraction/documentExtraction';
import { extractSkillsFromText } from './layers/extraction/skillExtraction';
import { calculateConfidence } from './layers/scoring/confidenceScoring';
import { buildJobMatch } from './layers/scoring/jobMatching';

const initialState = loadState();

export default function App() {
  const [data, setData] = useState(initialState.data);
  const [storageCorrupted, setStorageCorrupted] = useState(initialState.corrupted);
  const [uploadStatus, setUploadStatus] = useState({ busy: false, error: '' });
  const [jobStatus, setJobStatus] = useState({ busy: false, error: '' });
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  const latestJobMatch = data.jobMatches[0] ?? null;
  const jobSkillSet = useMemo(() => {
    if (!latestJobMatch?.jobSkills) return new Set();
    return new Set(latestJobMatch.jobSkills.map((skill) => skill.toLowerCase()));
  }, [latestJobMatch]);

  const skillsWithConfidence = useMemo(
    () =>
      data.skillGraph.map((skill) => ({
        ...skill,
        confidence: calculateConfidence(skill, jobSkillSet)
      })),
    [data.skillGraph, jobSkillSet]
  );

  const selectedSkill = skillsWithConfidence.find((skill) => skill.id === selectedSkillId) ?? null;

  async function handleUpload(file) {
    const validationError = validateResumeFile(file);
    if (validationError) {
      setUploadStatus({ busy: false, error: validationError });
      return;
    }

    setUploadStatus({ busy: true, error: '' });

    try {
      const uploadId = `upload_${Date.now()}`;
      const text = file.name.toLowerCase().endsWith('.pdf')
        ? await extractTextFromPDF(file)
        : await extractTextFromDocx(file);
      const source = detectDocumentType(text);
      const upload = {
        id: uploadId,
        fileName: file.name,
        type: source === 'unknown' ? 'resume' : source,
        text,
        uploadedAt: new Date().toISOString()
      };

      const skillFindings = extractSkillsFromText(text, {
        source: 'resume',
        uploadId,
        uploadName: file.name
      });

      const next = mergeUpload(data, { upload, skillFindings });
      setData(next);
      saveState(next);
      setSelectedSkillId(null);
    } catch (error) {
      setUploadStatus({ busy: false, error: 'Unable to parse the file. Try a different resume.' });
      return;
    }

    setUploadStatus({ busy: false, error: '' });
  }

  async function handleJobAnalyze(description) {
    if (!description.trim()) {
      setJobStatus({ busy: false, error: 'Paste a job description to analyze.' });
      return;
    }

    if (!data.uploads.length) {
      setJobStatus({ busy: false, error: 'Upload a resume before running job match.' });
      return;
    }

    setJobStatus({ busy: true, error: '' });
    try {
      const match = buildJobMatch({
        resumeSkills: data.skillGraph,
        jobDescription: description,
        uploadId: data.uploads[0].id
      });

      const jobMatch = {
        jobId: `job_${Date.now()}`,
        jobDescription: description,
        analyzedAt: new Date().toISOString(),
        uploadId: data.uploads[0].id,
        ...match
      };

      const next = addJobMatch(data, jobMatch);
      setData(next);
      saveState(next);
      setJobStatus({ busy: false, error: '' });
    } catch (error) {
      setJobStatus({ busy: false, error: 'Unable to analyze the job description.' });
    }
  }

  return (
    <div className="app">
      <Header />
      {storageCorrupted && (
        <section className="card warning-card" role="alert">
          <p>
            We detected corrupted storage data. You can reset local storage to recover safely.
          </p>
          <button
            type="button"
            onClick={() => {
              clearStorage();
              const reset = loadState();
              setData(reset.data);
              setStorageCorrupted(false);
            }}
          >
            Reset storage
          </button>
        </section>
      )}
      <div className="main-grid">
        <div className="left-column">
          <ResumeUploadBox
            onFileSelect={handleUpload}
            busy={uploadStatus.busy}
            error={uploadStatus.error}
          />
          <SkillList
            skills={skillsWithConfidence}
            expandedSkillId={expandedSkillId}
            onToggle={(id) => setExpandedSkillId((prev) => (prev === id ? null : id))}
            onSelect={setSelectedSkillId}
          />
        </div>
        <div className="right-column">
          <EvidencePanel skill={selectedSkill} />
          <JobInputBox onAnalyze={handleJobAnalyze} disabled={jobStatus.busy} error={jobStatus.error} />
          <MatchScoreDisplay match={latestJobMatch} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
