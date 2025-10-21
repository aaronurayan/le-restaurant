import React from 'react';
import { Button } from '../atoms/Button';

/**
 * ConfirmDialog Molecule (Reusable)
 * 
 * Modal dialog for confirmation actions (delete, approve, reject, etc.)
 * Combines Button atoms with modal overlay.
 * 
 * @component
 * @example
 * // Delete confirmation
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Delete Order"
 *   message="Are you sure you want to delete this order? This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDialog(false)}
 * />
 */

export interface ConfirmDialogProps {
  /** Dialog visibility */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Confirmation message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Loading state */
  loading?: boolean;
  /** Confirm callback */
  onConfirm: () => void;
  /** Cancel callback */
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  // Prevent body scroll when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black bg-opacity-50
        backdrop-blur-sm
        p-4
      "
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="
          bg-white
          rounded-xl
          shadow-2xl
          max-w-md w-full
          p-6
          transform transition-all
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4">
          <h3
            id="dialog-title"
            className="text-xl font-bold text-neutral-gray-900"
          >
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p
            id="dialog-description"
            className="text-sm text-neutral-gray-600 leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
