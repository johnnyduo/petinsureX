/**
 * Service Health Monitor Component
 * Displays the current status of external services like SEA-LION API
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seaLionAPI, ServiceHealth } from '@/lib/sea-lion';
import { useTranslation } from '@/lib/translation';
import { cn } from '@/lib/utils';

interface ServiceHealthMonitorProps {
  variant?: 'compact' | 'detailed';
  showRefresh?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  className?: string;
}

export const ServiceHealthMonitor: React.FC<ServiceHealthMonitorProps> = ({
  variant = 'compact',
  showRefresh = true,
  autoRefresh = true,
  refreshInterval = 300, // 5 minutes
  className
}) => {
  const { t } = useTranslation();
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkHealth = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const healthStatus = await seaLionAPI.checkHealth(forceRefresh);
      setHealth(healthStatus);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        checkHealth();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return t('service.status.healthy', 'Healthy');
      case 'degraded':
        return t('service.status.degraded', 'Degraded');
      case 'down':
        return t('service.status.down', 'Down');
      default:
        return t('service.status.unknown', 'Unknown');
    }
  };

  const formatResponseTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return t('time.just_now', 'Just now');
    if (diffMinutes < 60) return t('time.minutes_ago', `${diffMinutes} minutes ago`);
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return t('time.hours_ago', `${diffHours} hours ago`);
    
    return date.toLocaleString();
  };

  if (!health) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">{t('service.checking', 'Checking service status...')}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {getStatusIcon(health.status)}
        <Badge variant="outline" className={getStatusColor(health.status)}>
          {getStatusText(health.status)}
        </Badge>
        {health.responseTime && (
          <span className="text-xs text-gray-500">
            {formatResponseTime(health.responseTime)}
          </span>
        )}
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => checkHealth(true)}
            disabled={isLoading}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          </Button>
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {getStatusIcon(health.status)}
            {t('service.ai_service_status', 'AI Service Status')}
          </CardTitle>
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => checkHealth(true)}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
              {t('common.refresh', 'Refresh')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getStatusColor(health.status)}>
            {getStatusText(health.status)}
          </Badge>
          {health.responseTime && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              {formatResponseTime(health.responseTime)}
            </div>
          )}
        </div>

        {lastUpdate && (
          <p className="text-xs text-gray-500">
            {t('service.last_checked', 'Last checked')}: {formatRelativeTime(lastUpdate)}
          </p>
        )}

        {health.availableModels.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {t('service.available_models', 'Available Models')} ({health.availableModels.length})
            </p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {Object.entries(health.modelsHealth).map(([model, status]) => (
                <div key={model} className="flex items-center justify-between">
                  <span className="font-mono text-gray-600">
                    {model.split('/').pop()?.replace('-', ' ')}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      status === 'working' && 'bg-green-50 text-green-700 border-green-200',
                      status === 'failing' && 'bg-red-50 text-red-700 border-red-200',
                      status === 'unknown' && 'bg-gray-50 text-gray-700 border-gray-200'
                    )}
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {health.errors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-red-700 mb-1">
              {t('service.errors', 'Errors')}:
            </p>
            <div className="space-y-1">
              {health.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Hook for using service health in components
export const useServiceHealth = (autoRefresh = true, refreshInterval = 300) => {
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const healthStatus = await seaLionAPI.checkHealth(forceRefresh);
      setHealth(healthStatus);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();

    if (autoRefresh) {
      const interval = setInterval(() => {
        checkHealth();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    health,
    isLoading,
    checkHealth,
    isHealthy: health?.status === 'healthy',
    isDegraded: health?.status === 'degraded',
    isDown: health?.status === 'down'
  };
};