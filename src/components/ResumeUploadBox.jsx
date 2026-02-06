import { UploadCloud } from 'lucide-react';

export default function ResumeUploadBox({ onFileSelect, busy, error }) {
  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      event.target.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <section className="card">
      <div
        className={`upload-box${busy ? ' is-busy' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.querySelector('input')?.click();
          }
        }}
      >
        <UploadCloud aria-hidden="true" />
        <div>
          <p className="upload-title">Upload your resume (PDF or DOCX)</p>
          <p className="upload-subtitle">Drag and drop or browse files. Parsing runs locally.</p>
        </div>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} disabled={busy} />
      </div>
      {busy && <p className="status-line">Extracting text and skills…</p>}
      {error && <p className="status-line error">{error}</p>}
    </section>
  );
}
