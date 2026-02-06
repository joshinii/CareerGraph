import ConfidenceBreakdown from './ConfidenceBreakdown';

function scoreColor(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  return 'weak';
}

export default function SkillCard({ skill, expanded, onToggle, onSelect }) {
  const badgeClass = scoreColor(skill.confidence.totalScore);

  return (
    <div className={`skill-card ${expanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="skill-summary"
        onClick={() => {
          onToggle(skill.id);
          onSelect(skill.id);
        }}
        aria-expanded={expanded}
      >
        <div>
          <h3>{skill.name}</h3>
          <p className="meta-line">{skill.category}</p>
        </div>
        <div className={`score-pill ${badgeClass}`}>
          <span className="score-value">{skill.confidence.totalScore}</span>
          <span className="score-label">Confidence</span>
        </div>
      </button>
      {expanded && (
        <div className="skill-details">
          <div className="detail-row">
            <div>
              <p className="detail-label">Mentions</p>
              <p className="detail-value">{skill.mentions}</p>
            </div>
            <div>
              <p className="detail-label">Last Seen</p>
              <p className="detail-value">{skill.lastSeen}</p>
            </div>
          </div>
          <ConfidenceBreakdown breakdown={skill.confidence.breakdown} />
        </div>
      )}
    </div>
  );
}
