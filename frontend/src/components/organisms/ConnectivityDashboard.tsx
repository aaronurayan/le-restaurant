/**
 * Connectivity Dashboard Component
 * 
 * Displays real-time connectivity status between frontend and backend.
 * Shows endpoint verification, health status, and configuration details.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { verifyEndpoints, printVerificationReport, type VerificationReport } from '../../utils/endpointVerifier';
import { apiClient } from '../../services/apiClient.unified';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { useConnectivity } from '../../hooks/useConnectivity';
import { verifyConnectivity } from '../../utils/connectivityVerifier';

export const ConnectivityDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [verificationReport, setVerificationReport] = useState<VerificationReport | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Check backend health
  const checkHealth = async () => {
    setChecking(true);
    try {
      // Health check fails silently if backend is not available
      const isHealthy = await apiClient.checkHealth();
      setHealthStatus(isHealthy);
    } catch (error) {
      // Silently handle - backend may not be running
      setHealthStatus(false);
    } finally {
      setChecking(false);
    }
  };

  // Verify all endpoints
  const verifyAllEndpoints = async () => {
    setVerifying(true);
    try {
      const report = await verifyEndpoints();
      setVerificationReport(report);
      printVerificationReport(report);
    } catch (error) {
      console.error('Endpoint verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connectivity Dashboard</h2>
        <p className="text-neutral-600">Monitor frontend-backend connectivity and API endpoint status</p>
      </div>

      {/* Configuration Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Base URL:</span>
            <span className="ml-2 text-blue-600">{API_CONFIG.baseURL}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Environment:</span>
            <span className="ml-2 text-blue-600">
              {import.meta.env.PROD ? 'Production' : 'Development'}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Timeout:</span>
            <span className="ml-2 text-blue-600">{API_CONFIG.timeout}ms</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Retries:</span>
            <span className="ml-2 text-blue-600">{API_CONFIG.retries}</span>
          </div>
        </div>
      </div>

      {/* Health Status */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Backend Health</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={checkHealth}
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${
            healthStatus === true ? 'bg-green-500' : 
            healthStatus === false ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></div>
          <span className="text-sm text-neutral-600">
            {healthStatus === true ? '✅ Backend is healthy and accessible' :
             healthStatus === false ? '❌ Backend is not accessible' :
             '⏳ Checking...'}
          </span>
        </div>
        {apiClient.getHealthStatus() && (
          <div className="mt-2 text-xs text-neutral-500">
            Last checked: {new Date(apiClient.getHealthStatus()!.lastChecked).toLocaleString()}
            {apiClient.getHealthStatus()!.responseTime && (
              <span className="ml-2">Response time: {apiClient.getHealthStatus()!.responseTime}ms</span>
            )}
          </div>
        )}
      </div>

      {/* Endpoint Verification */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Endpoint Verification</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={verifyAllEndpoints}
            disabled={verifying}
          >
            {verifying ? 'Verifying...' : 'Verify All Endpoints'}
          </Button>
        </div>

        {verificationReport && (
          <div className="mt-4">
            <div className="mb-4 p-3 bg-white rounded border">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-700">Total:</span>
                  <span className="ml-2 text-neutral-600">{verificationReport.summary.total}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Passed:</span>
                  <span className="ml-2 text-green-600">{verificationReport.summary.passed}</span>
                </div>
                <div>
                  <span className="font-medium text-red-700">Failed:</span>
                  <span className="ml-2 text-red-600">{verificationReport.summary.failed}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Success Rate:</span>
                  <span className="ml-2 text-neutral-600">
                    {verificationReport.summary.successRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {verificationReport.endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    endpoint.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{endpoint.success ? '✅' : '❌'}</span>
                      <span className="font-mono text-sm">
                        {endpoint.method} {endpoint.endpoint}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600">
                      {endpoint.actualStatus && (
                        <span className="mr-2">Status: {endpoint.actualStatus}</span>
                      )}
                      {endpoint.responseTime && (
                        <span>{endpoint.responseTime}ms</span>
                      )}
                    </div>
                  </div>
                  {endpoint.error && (
                    <div className="mt-2 text-xs text-red-600">{endpoint.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-neutral-50 rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={checkHealth} disabled={checking}>
            Check Health
          </Button>
          <Button variant="secondary" size="sm" onClick={verifyAllEndpoints} disabled={verifying}>
            Verify Endpoints
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(`${API_CONFIG.baseURL}${API_ENDPOINTS.health}`, '_blank')}
          >
            Open Health Endpoint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityDashboard;

