import React, { useEffect, useState } from 'react';
import { Shield, Clock, CheckCircle } from 'lucide-react';

interface LoginEvent {
  id: number;
  timestamp: string;
  ipAddress: string | null;
  status: string;
}

interface LoginHistoryPanelProps {
  userId: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:8080/api';

const LoginHistoryPanel: React.FC<LoginHistoryPanelProps> = ({ userId }) => {
  const [history, setHistory] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(`${API_BASE_URL}/users/${userId}/login-history`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not load login history');
        return res.json();
      })
      .then(setHistory)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-AU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-neutral-900">Login History</h3>
        <span className="text-xs text-neutral-500">(last 20 logins)</span>
      </div>

      {loading && (
        <p className="text-sm text-neutral-500 text-center py-4">Loading...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && history.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-4">No login events recorded yet.</p>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-2">
          {history.map(event => (
            <div key={event.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">{event.status}</p>
                  <p className="text-xs text-neutral-500">
                    {event.ipAddress ?? 'IP not recorded'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="w-3 h-3" />
                {formatDate(event.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoginHistoryPanel;
