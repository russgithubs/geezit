import React from 'react';
import { useAlert } from '../contexts/AlertContext';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AlertNotification() {
  const { alerts } = useAlert();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert ${alert.type} pointer-events-auto`}
        >
          {alert.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
}