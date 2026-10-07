'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '@/lib/types';
import { DataStore } from '@/lib/store';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = () => {
    if (user) {
      const userNotifs = DataStore.getNotifications(user.id);
      setNotifications(userNotifs);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (id: string) => {
    DataStore.markNotificationRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    if (user) {
      DataStore.markAllNotificationsRead(user.id);
      refreshNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
