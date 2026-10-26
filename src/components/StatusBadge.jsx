import React from 'react';

export const StatusBadge = ({ classification, display }) => {
  const cClass = `tp-badge tp-badge-${classification || 'insufficient_data'}`;
  const label = display || classification?.replace('_', ' ') || 'Unknown';

  return (
    <span className={cClass}>
      <span style={{ fontSize: '10px' }}>●</span>
      {label}
    </span>
  );
};

export const ActionBadge = ({ action, display }) => {
  const aClass = `tp-badge tp-action-${action || 'evaluate'}`;
  const label = display || action?.replace('_', ' ') || 'Evaluate';

  return (
    <span className={aClass}>
      {label}
    </span>
  );
};
