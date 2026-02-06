import SkillCard from './SkillCard';

export default function SkillList({ skills, expandedSkillId, onToggle, onSelect }) {
  if (!skills.length) {
    return (
      <section className="card empty-state">
        <h2>Skills</h2>
        <p className="subtle">Upload a resume to see extracted skills.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="skills-header">
        <h2>Skills</h2>
        <span className="meta-line">{skills.length} skills found</span>
      </div>
      <div className="skills-grid">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            expanded={expandedSkillId === skill.id}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
