import React from 'react';

/**
 * Official NCoreSoft Brand Logo & Mark
 * Features the signature concentric orbital crescent swoosh in warm coral/orange
 * with the deep corporate navy "NCoreSoft" wordmark and "TechTracker" product identifier.
 */
export const NCoreSoftMark = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={Math.round(size * 0.78)}
    viewBox="0 0 110 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* Outer Primary Crescent */}
    <path
      d="M 94 48 C 94 66 75 78 52 78 C 28 78 10 65 10 47 C 10 28 29 14 55 14 C 74 14 89 22 92 34"
      stroke="#FF4622"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Mid Translucent Orbital Ring */}
    <path
      d="M 86 46 C 86 60 70 70 52 70 C 33 70 19 59 19 46 C 19 32 34 21 54 21 C 69 21 81 28 84 37"
      stroke="#FF7A59"
      strokeWidth="5"
      strokeOpacity="0.75"
      strokeLinecap="round"
    />
    {/* Inner Ambient Glow Ring */}
    <path
      d="M 76 45 C 76 54 64 62 51 62 C 37 62 27 54 27 45 C 27 35 38 27 53 27 C 64 27 72 32 75 39"
      stroke="#FFA388"
      strokeWidth="3.5"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

export const NCoreSoftLogo = ({
  subtitle = 'TechTracker',
  showTagline = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="d-flex align-items-center gap-2 text-decoration-none"
      style={{ cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
    >
      <NCoreSoftMark size={40} />
      <div>
        <div className="d-flex align-items-baseline gap-1" style={{ lineHeight: 1.15 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#002B49',
              letterSpacing: '-0.025em',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            NCore<span style={{ fontWeight: 800, color: '#002B49' }}>Soft</span>
          </span>
          {subtitle && (
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: '#FF4622',
                letterSpacing: '-0.02em',
                marginLeft: '3px'
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
        {showTagline && (
          <div
            style={{
              fontSize: '0.71rem',
              color: '#64748B',
              letterSpacing: '0.02em',
              fontWeight: 500,
              marginTop: '1px'
            }}
          >
            Upwork Technology & Skill Demand Intelligence
          </div>
        )}
      </div>
    </div>
  );
};
