export default function Timeline({ skill }) {
  if (!skill) return <div className="card">Timeline will appear here.</div>;

  return (
    <div className="card">
      <h3>{skill.name} Timeline</h3>
      {skill.timeline.map((item, idx) => (
        <div className="timeline-item" key={`${skill.id}-t-${idx}`}>
          <strong>{item.action}</strong>
          <div className="meta">{item.date} · Upload {item.uploadId}</div>
        </div>
      ))}
    </div>
  );
}
