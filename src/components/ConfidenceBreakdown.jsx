export default function ConfidenceBreakdown({ breakdown }) {
  return (
    <div className="confidence-breakdown">
      <h4>Confidence Breakdown</h4>
      <ul>
        {breakdown.map((item) => (
          <li key={item.label}>
            <div className="breakdown-header">
              <span className="breakdown-label">{item.label}</span>
              <span className="score-tag">+{item.score}/{item.max}</span>
            </div>
            <div className="breakdown-bar-track">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${(item.score / item.max) * 100}%` }}
              />
            </div>
            <p className="breakdown-explanation">{item.explanation}</p>
          </li>
        ))}
      </ul>
      <div className="breakdown-total">
        Total: {breakdown.reduce((s, i) => s + i.score, 0)}/{breakdown.reduce((s, i) => s + i.max, 0)}
      </div>
    </div>
  );
}
