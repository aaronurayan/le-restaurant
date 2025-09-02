import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { toast } from '../../utils/notifications';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const NotificationItem: React.FC<{ 
  notification: Notification; 
  onRemove: (id: string) => void; 
}> = ({ notification, onRemove }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };
  
  const colors = {
    success: 'bg-secondary-50 border-secondary-200 text-secondary-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  
  const iconColors = {
    success: 'text-secondary-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  };

  return (
    <div className={`
      flex items-start space-x-3 p-4 rounded-lg border shadow-md
      animate-slide-up ${colors[notification.type]}
    `}>
      <span className={iconColors[notification.type]}>
        {icons[notification.type]}
      </span>
      
      <p className="flex-1 text-sm font-medium">
        {notification.message}
      </p>
      
      <button
        onClick={() => onRemove(notification.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return toast.subscribe(setNotifications);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={toast.remove.bind(toast)}
        />
      ))}
    </div>
  );
};