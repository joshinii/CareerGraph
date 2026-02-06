import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function ResumeUploadBox({ onFileSelect, busy, error, hasUploads }) {
  const [dragOver, setDragOver] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      event.target.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <section className="card">
      <div
        className={`upload-box${busy ? ' is-busy' : ''}${dragOver ? ' drag-over' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
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
        <UploadCloud size={32} aria-hidden="true" />
        <div>
          <p className="upload-title">
            {hasUploads ? 'Upload another resume' : 'Upload your resume'}
          </p>
          <p className="upload-subtitle">
            Drag and drop or browse files. Supported: PDF, DOCX (max 5MB).
          </p>
        </div>
        <label className="upload-btn">
          Choose File
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} disabled={busy} />
        </label>
      </div>
      {busy && (
        <div className="status-line loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Extracting text and skills…
        </div>
      )}
      {error && <p className="status-line error" role="alert">{error}</p>}
    </section>
  );
}
