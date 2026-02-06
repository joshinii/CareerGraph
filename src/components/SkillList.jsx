export default function SkillList({ skills, onSelect }) {
  return (
    <div className="card">
      <h3>Skill List</h3>
      <ul>
        {skills.map((skill) => (
          <li key={skill.id} className="skill-item" onClick={() => onSelect(skill)}>
            <strong>{skill.name}</strong>
            <div className="meta">Evidence: {skill.evidence.length} · Updated: {skill.lastUpdated}</div>
            <div className="bar">
              <div className="fill" style={{ width: `${skill.confidence}%` }} />
            </div>
            <small>{skill.confidence}%</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
