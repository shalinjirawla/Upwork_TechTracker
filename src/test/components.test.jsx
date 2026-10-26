import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBadge, ActionBadge } from '../components/StatusBadge.jsx';
import { ScoreBar } from '../components/ScoreBar.jsx';
import { DemoBanner } from '../components/DemoBanner.jsx';

describe('UI Component Unit Tests', () => {
  it('renders StatusBadge with correct classification label', () => {
    render(<StatusBadge classification="emerging" display="Emerging Frontier" />);
    expect(screen.getByText('Emerging Frontier')).toBeInTheDocument();
  });

  it('renders ActionBadge with strategic action label', () => {
    render(<ActionBadge action="build_poc" display="Build Proof of Concept" />);
    expect(screen.getByText('Build Proof of Concept')).toBeInTheDocument();
  });

  it('renders ScoreBar with formatted score', () => {
    render(<ScoreBar score={88.5} />);
    expect(screen.getByText('88.5')).toBeInTheDocument();
  });

  it('renders DemoBanner and handles toggle callback', () => {
    const handleToggle = vi.fn();
    render(<DemoBanner isDemo={true} onToggle={handleToggle} />);

    expect(screen.getByText(/Demonstration Mode Active/i)).toBeInTheDocument();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
