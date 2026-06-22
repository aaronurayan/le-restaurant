import React from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

interface SessionTimeoutModalProps {
  remainingSeconds: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  remainingSeconds,
  onExtend,
  onLogout,
}) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeStr = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-neutral-900">Session Expiring Soon</h2>
        <p className="text-sm text-neutral-600">
          You have been inactive. Your session will end in:
        </p>

        <div className="text-3xl font-bold text-amber-600 tabular-nums">{timeStr}</div>

        <p className="text-xs text-neutral-500">
          Click "Stay Logged In" to continue your session.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          <button
            onClick={onExtend}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
