import { useEffect, useRef, useState, useCallback } from 'react';

const IDLE_WARNING_MS = 25 * 60 * 1000; // warn at 25 min idle
const IDLE_LOGOUT_MS = 30 * 60 * 1000;  // logout at 30 min idle

interface UseSessionTimeoutOptions {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function useSessionTimeout({ isAuthenticated, onLogout }: UseSessionTimeoutOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(300);

  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  }, []);

  const startTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);

    warnTimer.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingSeconds(300);
      countdownTimer.current = setInterval(() => {
        setRemainingSeconds(prev => Math.max(0, prev - 1));
      }, 1000);
    }, IDLE_WARNING_MS);

    logoutTimer.current = setTimeout(() => {
      clearAllTimers();
      setShowWarning(false);
      onLogout();
    }, IDLE_LOGOUT_MS);
  }, [clearAllTimers, onLogout]);

  const extendSession = useCallback(() => {
    if (isAuthenticated) startTimers();
  }, [isAuthenticated, startTimers]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    startTimers();

    const resetOnActivity = () => startTimers();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetOnActivity, { passive: true }));

    return () => {
      clearAllTimers();
      events.forEach(ev => window.removeEventListener(ev, resetOnActivity));
    };
  }, [isAuthenticated, startTimers, clearAllTimers]);

  return { showWarning, remainingSeconds, extendSession };
}
