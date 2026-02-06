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

export function detectType(text) {
  const lower = text.toLowerCase();
  if (/(experience|education|skills|projects)/.test(lower)) return 'resume';
  if (/(requirements|responsibilities|qualifications|job description)/.test(lower)) return 'job';
  return 'unknown';
}

export function extractMetadata(text, type) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (type !== 'resume') return { company: null, jobTitle: null, years: null };

  const yearMatch = text.match(/(20\d{2})\s*[-–]\s*(20\d{2}|present)/i);
  const companyLine = lines.find((l) => /(inc|llc|corp|technologies|systems|labs)/i.test(l)) || null;
  const titleLine = lines.find((l) => /(engineer|developer|manager|designer|analyst)/i.test(l)) || null;

  return {
    company: companyLine,
    jobTitle: titleLine,
    years: yearMatch ? `${yearMatch[1]}-${yearMatch[2]}` : null
  };
}
