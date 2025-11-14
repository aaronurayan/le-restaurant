import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should display title and message', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should not call onCancel when dialog content is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const dialogContent = screen.getByText('Confirm Action').closest('div')?.parentElement;
    if (dialogContent) {
      await user.click(dialogContent);
    }
    
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should use custom confirm and cancel text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
  });

  it('should disable buttons when loading', () => {
    render(<ConfirmDialog {...defaultProps} loading />);
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading state on confirm button', () => {
    render(<ConfirmDialog {...defaultProps} loading />);
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    const spinner = confirmButton.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should apply correct confirm variant', () => {
    const { rerender } = render(
      <ConfirmDialog {...defaultProps} confirmVariant="secondary" />
    );
    
    let confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton.className).toContain('bg-secondary-600');
    
    rerender(<ConfirmDialog {...defaultProps} confirmVariant="outline" />);
    confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton.className).toContain('border-primary-600');
  });

  it('should prevent body scroll when open', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('');
    
    rerender(<ConfirmDialog {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should have proper ARIA attributes', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description');
  });
});

