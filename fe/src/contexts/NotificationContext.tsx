import React, { useState, createContext, useContext, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationConfig {
  type: AlertColor | undefined;
  message: string;
  description: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, description: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context.showNotification;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationConfig | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const showNotification = (type: NotificationType, message: string, description: string) => {
    const duration = 2000; // Default duration in milliseconds

    setNotificationData({ type, message, description, duration });
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={notificationData?.duration || 2000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={notificationData?.type || 'success'}
          onClose={handleClose}
        >
          {notificationData?.message}
        </MuiAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
