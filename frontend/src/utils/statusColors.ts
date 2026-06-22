/**
 * Centralised status → colour mapping.
 *
 * Status badges were previously implemented independently in several components
 * (OrderStatusBadge, ReservationStatusBadge, OrderCard, ReservationTable, ...),
 * each with its own hardcoded Tailwind colours. That produced the same logical
 * status rendering in different colours on different pages.
 *
 * This module defines a small set of semantic "tones" mapped to the project's
 * design-system palette (primary = orange brand, secondary = green brand,
 * neutral = greys) plus standard accent colours, and maps each domain status to
 * a tone. Components consume the resulting class strings so a status looks the
 * same everywhere and theme changes happen in one place.
 */

export type StatusTone =
  | 'neutral' // not-yet-actioned / inert
  | 'warning' // in progress / awaiting action (brand orange)
  | 'success' // confirmed / positive (brand green)
  | 'done' // finished
  | 'danger' // rejected / cancelled / failed
  | 'info'; // transient operational state

export interface StatusColorClasses {
  text: string;
  bg: string;
  border: string;
}

/** Tone → design-token class strings. Single source of truth for badge colours. */
const TONE_CLASSES: Record<StatusTone, StatusColorClasses> = {
  neutral: { text: 'text-neutral-700', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  warning: { text: 'text-primary-700', bg: 'bg-primary-100', border: 'border-primary-300' },
  success: { text: 'text-secondary-700', bg: 'bg-secondary-100', border: 'border-secondary-300' },
  done: { text: 'text-secondary-800', bg: 'bg-secondary-50', border: 'border-secondary-200' },
  danger: { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
  info: { text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300' },
};

export const getToneClasses = (tone: StatusTone): StatusColorClasses => TONE_CLASSES[tone];

/** Order lifecycle statuses → tone. */
const ORDER_STATUS_TONE: Record<string, StatusTone> = {
  PENDING: 'neutral',
  CONFIRMED: 'success',
  PREPARING: 'warning',
  READY: 'success',
  COMPLETED: 'done',
  CANCELLED: 'danger',
};

/** Reservation lifecycle statuses → tone. */
const RESERVATION_STATUS_TONE: Record<string, StatusTone> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  DENIED: 'danger',
  CANCELLED: 'neutral',
  SEATED: 'info',
  COMPLETED: 'done',
  NO_SHOW: 'danger',
};

export const getOrderStatusClasses = (status: string): StatusColorClasses =>
  getToneClasses(ORDER_STATUS_TONE[status] ?? 'neutral');

export const getReservationStatusClasses = (status: string): StatusColorClasses =>
  getToneClasses(RESERVATION_STATUS_TONE[status] ?? 'neutral');
