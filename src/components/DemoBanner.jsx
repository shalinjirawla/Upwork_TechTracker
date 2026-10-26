import React from 'react';
import { BiInfoCircle, BiToggleLeft, BiToggleRight } from 'react-icons/bi';

export const DemoBanner = ({ isDemo, onToggle }) => {
  return (
    <div className="tp-demo-banner mb-4">
      <div className="d-flex align-items-center gap-2">
        <BiInfoCircle size={18} className="text-warning flex-shrink-0" />
        <span>
          {isDemo ? (
            <>
              <strong>Demonstration Mode Active:</strong> Displaying labeled benchmark observations alongside verified live signals.
            </>
          ) : (
            <>
              <strong>Live Data Mode:</strong> Displaying only strictly verified records from active data sources.
            </>
          )}
        </span>
      </div>
      <button
        onClick={onToggle}
        className="btn btn-sm py-0 px-2 d-flex align-items-center gap-1"
        style={{
          backgroundColor: isDemo ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.2)',
          color: isDemo ? '#fef08a' : '#93c5fd',
          border: '1px solid currentColor',
          fontSize: '0.8rem',
          borderRadius: '4px'
        }}
        title="Toggle between Live-only data and Demonstration benchmark data"
      >
        {isDemo ? <BiToggleRight size={18} /> : <BiToggleLeft size={18} />}
        {isDemo ? 'Switch to Live Only' : 'Include Demo Benchmarks'}
      </button>
    </div>
  );
};
