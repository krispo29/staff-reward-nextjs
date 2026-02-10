import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DrawCounter } from '@/components/DrawCounter';

describe('DrawCounter', () => {
  it('renders current draw and max draws correctly', () => {
    render(<DrawCounter currentDraw={5} maxDraws={10} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('จาก 10')).toBeInTheDocument();
  });

  it('renders initial state correctly', () => {
    render(<DrawCounter currentDraw={1} maxDraws={50} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('จาก 50')).toBeInTheDocument();
  });
});
