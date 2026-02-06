import { useState } from 'react';

export default function JobInput({ onJobPaste, disabled }) {
  const [jobDescription, setJobDescription] = useState('');

  return (
    <div className="job-input-section">
      <label htmlFor="job-description">Job Description</label>
      <textarea
        id="job-description"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        rows={8}
        className="job-input"
      />
      <button type="button" onClick={() => onJobPaste(jobDescription)} disabled={disabled}>
        Analyze Job Match
      </button>
    </div>
  );
}
