import { useState } from 'react';

export default function JobInputBox({ onAnalyze, disabled, error }) {
  const [text, setText] = useState('');

  return (
    <section className="card">
      <div className="job-input">
        <label htmlFor="job-description">Analyze Job Match</label>
        <textarea
          id="job-description"
          placeholder="Paste a job description to calculate your skill match score and identify missing skills."
          rows={6}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="job-actions">
          {text.trim() && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setText('')}
              disabled={disabled}
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => onAnalyze(text)}
            disabled={disabled || !text.trim()}
          >
            Analyze job match
          </button>
        </div>
        {disabled && !error && (
          <div className="status-line loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Analyzing job match…
          </div>
        )}
        {error && <p className="status-line error" role="alert">{error}</p>}
      </div>
    </section>
  );
}
