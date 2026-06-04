import { scoreColor } from '../../utils/helpers';

/**
 * Circular progress ring for a 0-100 score, drawn with SVG (no animation).
 */
const ScoreRing = ({ score = 0, size = 96, stroke = 8 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const ringColor =
    clamped >= 71 ? '#22c55e' : clamped >= 41 ? '#eab308' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute text-xl font-semibold ${scoreColor(clamped)}`}>{clamped}</span>
    </div>
  );
};

export default ScoreRing;
