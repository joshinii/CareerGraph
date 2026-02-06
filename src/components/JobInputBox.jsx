export default function JobInputBox({ onAnalyze, disabled, error }) {
  return (
    <section className="card">
      <div className="job-input">
        <label htmlFor="job-description">Optional: Paste a job description</label>
        <textarea
          id="job-description"
          placeholder="Paste the job description to get a semantic match score and missing skills."
          rows={6}
          disabled={disabled}
        />
        <div className="job-actions">
          <button
            type="button"
            onClick={(event) => {
              const textarea = event.currentTarget.closest('.job-input')?.querySelector('textarea');
              onAnalyze(textarea?.value ?? '');
            }}
            disabled={disabled}
          >
            Analyze job match
          </button>
        </div>
        {disabled && !error && <p className="status-line">Analyzing job match…</p>}
        {error && <p className="status-line error">{error}</p>}
      </div>
    </section>
  );
}
