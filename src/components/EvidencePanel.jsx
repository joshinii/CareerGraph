export default function EvidencePanel({ skill }) {
  if (!skill) return <div className="card">Select a skill to view evidence.</div>;

  return (
    <div className="card">
      <h3>{skill.name} Evidence</h3>
      {skill.evidence.map((entry, idx) => (
        <div key={`${skill.id}-${idx}`} className="timeline-item">
          <div>{entry.evidence.sentence}</div>
          <div className="meta">
            {entry.evidence.company || 'Unknown company'} · {entry.evidence.jobTitle || 'Unknown role'} ·{' '}
            {entry.evidence.years || 'Unknown years'}
          </div>
        </div>
      ))}
    </div>
  );
}
