import React from 'react';

export const ScoreBar = ({ score, showValue = true }) => {
  const safeScore = Math.min(100, Math.max(0, score || 0));

  let color = '#3b82f6'; // default blue
  if (safeScore >= 80) color = '#10b981'; // green
  else if (safeScore >= 60) color = '#38bdf8'; // light blue
  else if (safeScore >= 40) color = '#f59e0b'; // amber
  else color = '#94a3b8'; // slate

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="tp-progress-track" style={{ minWidth: '70px', maxWidth: '120px' }}>
        <div
          className="tp-progress-fill"
          style={{ width: `${safeScore}%`, backgroundColor: color }}
        />
      </div>
      {showValue && (
        <span className="font-monospace fw-semibold" style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          {safeScore.toFixed(1)}
        </span>
      )}
    </div>
  );
};
