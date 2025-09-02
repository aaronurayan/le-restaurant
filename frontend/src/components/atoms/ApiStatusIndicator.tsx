import React from 'react';
import { useApiHealth } from '../../hooks/useApi';

interface ApiStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { isBackendHealthy, checking, baseUrl } = useApiHealth();

  if (checking) {
    return (
      <div className={`flex items-center space-x-2 text-yellow-600 ${className}`}>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Checking backend...</span>
      </div>
    );
  }

  if (isBackendHealthy === null) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-sm">Unknown status</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full ${
          isBackendHealthy ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></div>
      <span className={`text-sm ${
        isBackendHealthy ? 'text-green-600' : 'text-red-600'
      }`}>
        {isBackendHealthy ? 'Backend Connected' : 'Backend Disconnected'}
      </span>
      
      {showDetails && (
        <div className="ml-4 text-xs text-gray-500">
          <div>URL: {baseUrl}</div>
          <div>Status: {isBackendHealthy ? 'Healthy' : 'Unhealthy'}</div>
        </div>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
