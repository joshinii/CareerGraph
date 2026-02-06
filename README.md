# CareerGraph Phase 0 (On-Device MVP)

React + Vite SPA that processes resume/job uploads in-browser, extracts candidate skills with evidence, computes confidence scores, and persists a simple skill graph plus semantic job matching in localStorage.

## Setup

```bash
npm install
npm run dev
```

## Phase 0 capabilities

- Upload PDF/DOCX files
- Auto-detect resume vs. job description
- Extract metadata (`company`, `jobTitle`, `years`) from resume-like text
- Extract skills with sentence-level evidence (transformers.js NER with regex fallback)
- Build incremental skill graph and timeline across uploads
- Compute confidence scores with evidence + context + depth + job relevance
- Compare resume text to pasted job descriptions using on-device embeddings
- Persist everything to localStorage (`careerGraph.phase0`)

## localStorage schema

```json
{
  "skillGraph": [
    {
      "id": "react_1738800",
      "name": "React",
      "evidence": [
        {
          "skill": "React",
          "source": "resume",
          "evidence": {
            "sentence": "Built web apps using React and Redux at TechCorp (2022-2024)",
            "company": "TechCorp",
            "jobTitle": "Frontend Engineer",
            "years": "2022-2024"
          },
          "discoveredAt": "2025-02-05",
          "uploadId": "upload_17388"
        }
      ],
      "timeline": [
        { "action": "discovered", "date": "2025-02-05", "uploadId": "upload_17388" }
      ],
      "lastUpdated": "2025-02-05",
      "discoveredAt": "2025-02-05"
    }
  ],
  "uploads": [
    {
      "id": "upload_17388",
      "type": "resume",
      "fileName": "resume.pdf",
      "text": "...",
      "metadata": { "company": "TechCorp", "jobTitle": "Frontend Engineer", "years": "2022-2024" },
      "uploadedAt": "2025-02-05T12:00:00.000Z"
    }
  ],
  "jobMatches": [
    {
      "jobId": "job_1",
      "jobDescription": "...",
      "matchScore": 78,
      "matchType": "Strong",
      "analyzedAt": "2025-02-06T12:00:00.000Z",
      "uploadId": "upload_17388"
    }
  ]
}
```

## Evidence extraction algorithm

1. Parse file text in browser (`pdfjs-dist` for PDF; basic DOCX text decode fallback).
2. Identify source type (`resume`/`job`) using keyword heuristics.
3. Run sentence splitting and NER (`@xenova/transformers` token-classification pipeline).
4. Convert detected tokens into candidate skills.
5. Attach evidence payload with sentence + metadata + upload id.
6. Deduplicate by `skill + sentence`.

## Semantic job matching

- Embeddings: `Xenova/all-MiniLM-L6-v2` via transformers.js (on-device).
- First run downloads the model (~30MB); subsequent runs use the cached model.
- Typical first-run latency: ~3-5 seconds; subsequent runs: <1 second.

## Confidence scoring formula

- Evidence presence (0-30)
- Context quality via recency (0-20 currently implemented from date range)
- Depth indicators (0-15)
- Job relevance (0-15)
- Clamped at 100.

Displayed per skill as a score bar and percentage.

## LM Studio note (Phase 1)

Phase 0 does not include chat. For Phase 1, run LM Studio locally and configure a local endpoint integration from the client.
