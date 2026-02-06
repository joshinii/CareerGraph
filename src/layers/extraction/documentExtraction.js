const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per spec

export async function extractTextFromPDF(file) {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default;

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }

  const text = pages.join('\n');
  if (!text.trim()) {
    throw new Error('PDF appears to be empty or contains only images.');
  }
  return text;
}

export async function extractTextFromDocx(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  if (!text.trim()) {
    throw new Error('DOCX appears to be empty or could not be read.');
  }
  return text;
}

export function detectDocumentType(text) {
  const lower = text.toLowerCase();
  if (/(experience|education|skills|projects|summary)/.test(lower)) return 'resume';
  if (/(requirements|responsibilities|qualifications|job description)/.test(lower)) return 'job';
  return 'unknown';
}

export function validateResumeFile(file) {
  if (!file) return 'Select a PDF or DOCX file.';
  const lower = file.name.toLowerCase();
  if (!lower.endsWith('.pdf') && !lower.endsWith('.docx')) {
    return 'File must be a PDF or DOCX.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit.';
  }
  if (file.size === 0) {
    return 'File is empty.';
  }
  return '';
}
