# CareerGraph Phase 0 (On-Device MVP)

React + Vite SPA that processes resume uploads in-browser, extracts candidate skills with evidence, computes confidence scores, and persists a skill graph with job matching in localStorage.

All processing runs locally in the browser — no data leaves your device.

## Setup

```bash
npm install
npm run dev
```

## Features

- Upload PDF or DOCX files (parsed via `pdfjs-dist` and `mammoth`)
- Extract technical skills from resume text using taxonomy-based regex matching (~200 skills)
- Track sentence-level evidence for each detected skill
- Calculate 4-factor confidence scores per skill (evidence, context, recency, job relevance)
- Paste a job description to compute skill match score (0-100%)
- Identify matched and missing skills compared to job requirements
- Persist skill graph, upload history, and job matches to localStorage
- Merge skills across multiple resume uploads with timeline tracking

## Architecture

```
src/
  layers/
    extraction/    – PDF/DOCX text extraction and regex-based skill detection
    scoring/       – 4-factor confidence scoring and Dice-coefficient job matching
    storage/       – localStorage read/write with versioning
    utils/         – Skills taxonomy (~200 skills, 8 categories) and text helpers
  components/      – React UI (SkillCard, EvidencePanel, MatchScoreDisplay, etc.)
```

## Skill extraction

Skills are matched against a curated taxonomy of ~200 technical skills across 8 categories (programming languages, frameworks, cloud/DevOps, databases, data tools, monitoring, practices, tools). Matching uses case-insensitive regex with word boundary detection to avoid false positives.

Each match captures the containing sentence as evidence.

## Confidence scoring

Each skill receives a 0-100% confidence score based on four weighted factors:

| Factor | Max points | Description |
|--------|-----------|-------------|
| Evidence | 30 | Number of mentions (6 pts each, capped at 30) |
| Context | 40 | Ratio of sentences with action verbs (built, implemented, etc.) |
| Recency | 30 | Most recent year mentioned (30 if ≤1yr, 22 if ≤3yr, etc.) |
| Job relevance | 20 | Whether skill appears in a job description |

Total is computed dynamically from the breakdown and normalized to 0-100%.

## Job matching

Compares resume skills against skills extracted from a pasted job description using a Dice coefficient formula, clamped to 0-100%. Results show matched skills, missing skills, and an overall match type (STRONG ≥75%, MODERATE ≥50%, WEAK <50%).

## localStorage schema

Three keys are used, each versioned:

- `careergraph_skillgraph` — Array of skill objects with evidence, mentions, timeline
- `careergraph_uploads` — Upload history (id, fileName, type, text, date)
- `careergraph_jobmatches` — Job match results with scores and skill breakdowns

## Browser support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
