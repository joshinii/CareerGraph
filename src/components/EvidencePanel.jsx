export default function EvidencePanel({ skill }) {
  if (!skill) {
    return (
      <section className="card">
        <h2>Evidence</h2>
        <p className="subtle">Select a skill to see supporting sentences.</p>
      </section>
    );
  }

  return (
    <section className="card evidence-panel">
      <h2>Evidence for {skill.name}</h2>
      <ul className="evidence-list">
        {skill.evidence.map((entry) => (
          <li key={`${entry.uploadId}-${entry.sentenceIndex}-${entry.skill}`}>
            <div className="evidence-meta">
              <span>{entry.uploadName}</span>
              <span>Sentence {entry.sentenceIndex + 1}</span>
            </div>
            <p className="evidence-snippet">{entry.snippet}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
