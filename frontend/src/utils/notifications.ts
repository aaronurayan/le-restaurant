type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  show(type: NotificationType, message: string, duration: number = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, type, message, duration };
    
    this.notifications = [...this.notifications, notification];
    this.notifyListeners();
    
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
    
    return id;
  }
  
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }
  
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
  
  success(message: string, duration?: number) {
    return this.show('success', message, duration);
  }
  
  error(message: string, duration?: number) {
    return this.show('error', message, duration);
  }
  
  info(message: string, duration?: number) {
    return this.show('info', message, duration);
  }
  
  warning(message: string, duration?: number) {
    return this.show('warning', message, duration);
  }
}

export const toast = new NotificationService();