import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDrawStore } from '@/store/drawStore';
import { generateMockEmployees } from '@/data/mockEmployees';

// Mock the audioUtils to prevent errors in test environment
vi.mock('@/lib/audioUtils', () => ({
  soundManager: {
    setEnabled: vi.fn(),
    playWin: vi.fn(),
    playSpin: vi.fn(),
    playReelStop: vi.fn(),
    startAmbientHum: vi.fn(),
    stopAmbientHum: vi.fn(),
  },
}));

describe('drawStore', () => {
  beforeEach(() => {
    const { reset, loadEmployees } = useDrawStore.getState();
    reset();
    // Load fresh mock data
    loadEmployees(generateMockEmployees(100));
  });

  it('initializes with default state', () => {
    const state = useDrawStore.getState();
    expect(state.employees).toHaveLength(100);
    expect(state.winners).toHaveLength(0);
    expect(state.currentWinner).toBeNull();
    expect(state.drawStatus).toBe('idle');
  });

  it('starts a draw correctly', () => {
    const { startDraw } = useDrawStore.getState();
    startDraw();
    const state = useDrawStore.getState();
    expect(state.currentDraw).toBe(1);
    expect(state.drawStatus).toBe('idle');
    expect(state.winners).toHaveLength(0);
  });

  it('draws a random winner', () => {
    const { startDraw, drawWinner } = useDrawStore.getState();
    startDraw();
    drawWinner();
    
    const state = useDrawStore.getState();
    expect(state.currentWinner).not.toBeNull();
    expect(state.drawStatus).toBe('spinning');
    
    // Validate winner is from employees list
    const winnerInList = state.employees.find(e => e.id === state.currentWinner?.id);
    expect(winnerInList).toBeDefined();
  });

  it('reveals the winner', () => {
    const { startDraw, drawWinner, revealWinner } = useDrawStore.getState();
    startDraw();
    drawWinner();
    revealWinner();
    
    const state = useDrawStore.getState();
    expect(state.drawStatus).toBe('revealed');
  });

  it('accepts a winner', () => {
    const { startDraw, drawWinner, revealWinner, acceptWinner } = useDrawStore.getState();
    startDraw();
    drawWinner();
    revealWinner();
    acceptWinner();
    
    const state = useDrawStore.getState();
    expect(state.winners).toHaveLength(1);
    expect(state.winners[0]).toEqual(state.currentWinner);
    expect(state.drawStatus).toBe('confirmed');
  });

  it('rejects a winner', () => {
    const { startDraw, drawWinner, revealWinner, rejectWinner } = useDrawStore.getState();
    startDraw();
    drawWinner();
    revealWinner();
    rejectWinner();
    
    const state = useDrawStore.getState();
    expect(state.winners).toHaveLength(0);
    expect(state.currentWinner).toBeNull();
    expect(state.drawStatus).toBe('idle');
  });
});
