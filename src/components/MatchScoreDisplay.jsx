function scoreTone(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  return 'weak';
}

export default function MatchScoreDisplay({ match }) {
  if (!match) {
    return (
      <section className="card">
        <h2>Job Match</h2>
        <p className="subtle">Paste a job description to see match results.</p>
      </section>
    );
  }

  const tone = scoreTone(match.matchScore);

  return (
    <section className="card">
      <div className="match-summary">
        <div className={`match-score ${tone}`}>
          <span>{match.matchScore}</span>
          <small>Match Score</small>
        </div>
        <div>
          <p className={`match-type ${tone}`}>{match.matchType}</p>
          <p className="subtle">
            {match.matchedSkills.length} matched · {match.missingSkills.length} missing
          </p>
        </div>
      </div>
      <div className="match-details">
        <h3>Skill Relevance</h3>
        <ul className="skill-relevance">
          {match.skillMatches.map((entry) => (
            <li key={entry.skill} className={entry.status}>
              <span>{entry.skill}</span>
              <span>{entry.status === 'matched' ? 'Matched' : 'Missing'}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
