/**
 * Connectivity Indicator Component
 * 
 * Visual indicator for frontend-backend connectivity status.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

import React from 'react';
import { useConnectivity } from '../../hooks/useConnectivity';

interface ConnectivityIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const ConnectivityIndicator: React.FC<ConnectivityIndicatorProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { isConnected, checking, status } = useConnectivity(true, true, 30000);

  if (checking && !status) {
    return (
      <div className={`flex items-center space-x-2 text-yellow-600 ${className}`}>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Checking connection...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } ${isConnected ? 'animate-pulse' : ''}`}
        title={isConnected ? 'Connected to backend' : 'Not connected to backend'}
      ></div>
      <span className={`text-sm ${
        isConnected ? 'text-green-600' : 'text-red-600'
      }`}>
        {isConnected ? 'Backend Connected' : 'Backend Disconnected'}
      </span>
      
      {showDetails && status && (
        <div className="ml-4 text-xs text-gray-500">
          <div>URL: {status.baseUrl}</div>
          {status.healthCheck.responseTime && (
            <div>Response: {status.healthCheck.responseTime}ms</div>
          )}
          <div>Last Check: {new Date(status.timestamp).toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
};

