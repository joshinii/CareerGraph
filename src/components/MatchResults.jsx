export default function MatchResults({ score, matchType }) {
  return (
    <div className="match-results">
      <h3>Job Match Score</h3>
      <div className="score-display">
        <div className="score-circle">{score}%</div>
        <p className={`match-type ${matchType.toLowerCase()}`}>{matchType} Match</p>
      </div>

      <div className="score-breakdown">
        <p>Your skills align with {score}% of job requirements.</p>
        {score < 75 && (
          <p className="warning">Consider adding more relevant keywords to your resume.</p>
        )}
      </div>
    </div>
  );
}
