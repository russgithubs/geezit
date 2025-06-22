import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (message: string, type?: 'success' | 'error') => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    const alert = { id, message, type };
    
    setAlerts(prev => [...prev, alert]);
    
    setTimeout(() => {
      removeAlert(id);
    }, 3000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}