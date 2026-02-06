function scoreTone(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  return 'weak';
}

function scoreDescription(score) {
  if (score >= 75) return 'Strong alignment with job requirements.';
  if (score >= 50) return 'Moderate alignment — consider highlighting more relevant experience.';
  return 'Weak alignment — this role may require skills outside your current profile.';
}

export default function MatchScoreDisplay({ match }) {
  if (!match) return null;

  const tone = scoreTone(match.matchScore);

  return (
    <section className="card match-card">
      <h2>Job Match Score</h2>
      <div className="match-summary">
        <div className={`match-ring ${tone}`}>
          <span className="match-ring-value">{match.matchScore}%</span>
          <span className="match-ring-label">Match</span>
        </div>
        <div className="match-meta">
          <p className={`match-type ${tone}`}>{match.matchType} MATCH</p>
          <p className="subtle">{scoreDescription(match.matchScore)}</p>
          <p className="meta-line">
            {match.matchedSkills.length} matched · {match.missingSkills.length} missing
          </p>
        </div>
      </div>

      {(match.skillMatches?.length ?? 0) > 0 && (
        <div className="match-details">
          <h3>Skill Relevance</h3>
          <ul className="skill-relevance">
            {match.skillMatches.map((entry) => (
              <li key={entry.skill} className={entry.status}>
                <span>{entry.skill}</span>
                <span className={`relevance-badge ${entry.status}`}>
                  {entry.status === 'matched' ? 'Matched' : 'Missing'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {match.missingSkills.length > 0 && match.matchScore < 75 && (
        <div className="match-tip">
          <p>Consider adding experience with: {match.missingSkills.join(', ')}</p>
        </div>
      )}
    </section>
  );
}
