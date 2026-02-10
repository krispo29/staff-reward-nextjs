import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WinnerModal } from '@/components/WinnerModal';
import { Employee } from '@/types/employee';

const mockWinner: Employee = {
  id: '123456',
  name: 'Test Employee',
  department: 'Test Dept',
  plant: 'Test Plant',
  section: 'Test Section',
  position: 'Test Position',
  nationality: 'Thai',
};

describe('WinnerModal', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <WinnerModal
        isOpen={false}
        winner={mockWinner}
        onAccept={() => {}}
        onReject={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders winner details when open', () => {
    render(
      <WinnerModal
        isOpen={true}
        winner={mockWinner}
        onAccept={() => {}}
        onReject={() => {}}
      />
    );

    expect(screen.getByText('Test Employee')).toBeDefined();
    expect(screen.getByText('123456')).toBeDefined();
    expect(screen.getByText('Test Plant')).toBeDefined();
    expect(screen.getByText('Test Section')).toBeDefined();
    expect(screen.getByText('Test Position')).toBeDefined();
  });

  it('calls onAccept when accept button is clicked', () => {
    const onAccept = vi.fn();
    render(
      <WinnerModal
        isOpen={true}
        winner={mockWinner}
        onAccept={onAccept}
        onReject={() => {}}
      />
    );

    const acceptButton = screen.getByText('รับรางวัล');
    fireEvent.click(acceptButton);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onReject when reject button is clicked', () => {
    const onReject = vi.fn();
    render(
      <WinnerModal
        isOpen={true}
        winner={mockWinner}
        onAccept={() => {}}
        onReject={onReject}
      />
    );

    const rejectButton = screen.getByText('สละสิทธิ์');
    fireEvent.click(rejectButton);
    expect(onReject).toHaveBeenCalledTimes(1);
  });
});
