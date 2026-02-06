import { ChevronDown, ChevronUp } from 'lucide-react';
import ConfidenceBreakdown from './ConfidenceBreakdown';

function scoreColor(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  return 'weak';
}

function scoreLabel(score) {
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
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
        <div className="skill-info">
          <h3>{skill.name}</h3>
          <p className="meta-line">{skill.category}</p>
        </div>
        <div className="skill-score-area">
          <div className={`score-pill ${badgeClass}`}>
            <span className="score-value">{skill.confidence.totalScore}%</span>
            <span className="score-label">{scoreLabel(skill.confidence.totalScore)}</span>
          </div>
          {expanded
            ? <ChevronUp size={18} aria-hidden="true" />
            : <ChevronDown size={18} aria-hidden="true" />
          }
        </div>
      </button>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${badgeClass}`}
          style={{ width: `${skill.confidence.totalScore}%` }}
        />
      </div>
      {expanded && (
        <div className="skill-details">
          <div className="detail-row">
            <div>
              <p className="detail-label">Mentions</p>
              <p className="detail-value">{skill.mentions}</p>
            </div>
            <div>
              <p className="detail-label">First Seen</p>
              <p className="detail-value">{skill.firstSeen}</p>
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
