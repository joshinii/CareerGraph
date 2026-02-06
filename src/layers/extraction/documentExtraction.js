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

  return pages.join('\n');
}

export async function extractTextFromDocx(file) {
  const data = await file.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(data).replace(/[^\x20-\x7E\n]/g, ' ');
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
  if (file.size > 10 * 1024 * 1024) {
    return 'File size exceeds 10MB limit.';
  }
  return '';
}
