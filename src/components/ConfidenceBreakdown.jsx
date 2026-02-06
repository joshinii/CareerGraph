export default function ConfidenceBreakdown({ breakdown }) {
  return (
    <div className="confidence-breakdown">
      <h4>Confidence Breakdown</h4>
      <ul>
        {breakdown.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <span className="score-tag">
              {item.score}/{item.max}
            </span>
            <p>{item.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
