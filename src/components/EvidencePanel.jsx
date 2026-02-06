export default function EvidencePanel({ skill }) {
  if (!skill) {
    return (
      <section className="card evidence-panel empty-state">
        <h2>Evidence</h2>
        <p className="subtle">Select a skill to view supporting sentences.</p>
      </section>
    );
  }

  return (
    <section className="card evidence-panel">
      <h2>Evidence for {skill.name}</h2>
      <div className="evidence-header">
        <span className="meta-line">Category: {skill.category}</span>
        <span className="meta-line">Confidence: {skill.confidence.totalScore}%</span>
      </div>

      <h3>Mentions ({skill.evidence?.length ?? 0})</h3>
      <ul className="evidence-list">
        {(skill.evidence ?? []).map((entry) => (
          <li key={`${entry.uploadId}-${entry.sentenceIndex}-${entry.skill}`}>
            <div className="evidence-meta">
              <span>From: {entry.uploadName}</span>
              <span>Sentence {entry.sentenceIndex + 1}</span>
            </div>
            <blockquote className="evidence-snippet">{entry.snippet}</blockquote>
          </li>
        ))}
      </ul>

      <h3>Score Breakdown</h3>
      <ul className="evidence-breakdown-list">
        {skill.confidence.breakdown.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <span className="score-tag">+{item.score}/{item.max}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
