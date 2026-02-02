/**
 * Splunk On-Call Status Display for Frontend
 * Shows system health and incident status
 */

import React, { useState, useEffect } from 'react';

export interface ServiceStatus {
    service: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
        name: string;
        healthy: boolean;
        latencyMs: number;
    }[];
}

export interface SystemStatusProps {
    services?: string[];
    refreshInterval?: number;
    showDetails?: boolean;
    className?: string;
}

const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
};

const statusIcons = {
    healthy: '✓',
    degraded: '⚠',
    unhealthy: '✕',
};

/**
 * System Status Component
 * Displays health status of backend services
 */
export const SystemStatus: React.FC<SystemStatusProps> = ({
    services = ['auth-service', 'product-service', 'order-service', 'category-service', 'coupon-service'],
    refreshInterval = 30000,
    showDetails = false,
    className = '',
}) => {
    const [statuses, setStatuses] = useState<ServiceStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatuses = async () => {
        try {
            // In production, this would fetch from your API gateway
            const mockStatuses: ServiceStatus[] = services.map(service => ({
                service,
                status: 'healthy' as const,
                timestamp: new Date().toISOString(),
                checks: [
                    { name: 'mongodb', healthy: true, latencyMs: 5 },
                    { name: 'redis', healthy: true, latencyMs: 2 },
                    { name: 'memory', healthy: true, latencyMs: 0 },
                ],
            }));
            setStatuses(mockStatuses);
            setError(null);
        } catch (err) {
            setError('Failed to fetch service statuses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
        const interval = setInterval(fetchStatuses, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);

    const overallStatus = statuses.every(s => s.status === 'healthy')
        ? 'healthy'
        : statuses.some(s => s.status === 'unhealthy')
            ? 'unhealthy'
            : 'degraded';

    if (loading) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Checking status...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-500">Status unavailable</span>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${statusColors[overallStatus]} rounded-full`}></div>
                <span className="text-sm font-medium">
                    {overallStatus === 'healthy' && 'All Systems Operational'}
                    {overallStatus === 'degraded' && 'Partial System Outage'}
                    {overallStatus === 'unhealthy' && 'Major System Outage'}
                </span>
            </div>

            {showDetails && (
                <div className="mt-4 space-y-2">
                    {statuses.map(status => (
                        <div
                            key={status.service}
                            className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm ${statusColors[status.status]} text-white px-1 rounded`}>
                                    {statusIcons[status.status]}
                                </span>
                                <span className="text-sm">{status.service}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(status.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Compact status indicator for header/footer
 */
export const StatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [status, setStatus] = useState<'healthy' | 'degraded' | 'unhealthy'>('healthy');

    useEffect(() => {
        // In production, this would poll actual status endpoint
        const checkStatus = async () => {
            try {
                // Mock check - replace with actual API call
                setStatus('healthy');
            } catch {
                setStatus('unhealthy');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center space-x-1 ${className}`} title={`System status: ${status}`}>
            <div className={`w-2 h-2 ${statusColors[status]} rounded-full`}></div>
            <span className="text-xs text-gray-500 hidden sm:inline">
                {status === 'healthy' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Outage'}
            </span>
        </div>
    );
};

/**
 * Incident Banner Component
 * Displays active incidents at the top of the page
 */
export interface Incident {
    id: string;
    title: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    startTime: string;
    affectedServices: string[];
}

export const IncidentBanner: React.FC<{ incidents?: Incident[] }> = ({ incidents = [] }) => {
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const activeIncidents = incidents.filter(i => !dismissed.has(i.id));

    if (activeIncidents.length === 0) {
        return null;
    }

    const bannerColors = {
        critical: 'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white',
    };

    return (
        <div className="space-y-1">
            {activeIncidents.map(incident => (
                <div
                    key={incident.id}
                    className={`px-4 py-2 ${bannerColors[incident.severity]} flex items-center justify-between`}
                >
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">{incident.title}:</span>
                        <span>{incident.message}</span>
                    </div>
                    <button
                        onClick={() => setDismissed(prev => new Set([...prev, incident.id]))}
                        className="p-1 hover:opacity-75"
                        aria-label="Dismiss incident notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SystemStatus;
