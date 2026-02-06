import { Upload } from 'lucide-react';

export default function UploadBox({ onUpload }) {
  return (
    <div className="card">
      <div className="upload-box">
        <Upload size={32} />
        <p>Upload resume or job description (PDF/DOCX)</p>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
      </div>
    </div>
  );
}
