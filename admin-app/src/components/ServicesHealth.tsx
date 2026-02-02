/**
 * Services Health Check Component
 * Displays health status of all microservices
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000/api';

interface ServiceHealth {
    status: 'healthy' | 'unhealthy' | 'unknown';
    error?: string;
    timestamp?: string;
    uptime?: number;
    responseTime?: string;
}

export const ServicesHealth = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['servicesHealth'],
        queryFn: async () => {
            const response = await axios.get(`${GATEWAY_URL}/health/services`);
            return response.data;
        },
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-800';
            case 'unhealthy':
                return 'bg-red-100 text-red-800';
            case 'degraded':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return '🟢';
            case 'unhealthy':
                return '🔴';
            case 'degraded':
                return '🟡';
            default:
                return '⚪';
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Services Health Status</h3>
                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    {isLoading ? 'Checking...' : 'Refresh'}
                </button>
            </div>

            <div className={`mb-4 p-3 rounded ${getStatusColor(data?.overallStatus || 'unknown')}`}>
                <p className="font-semibold">
                    {getStatusBadge(data?.overallStatus || 'unknown')} Overall Status:{' '}
                    {data?.overallStatus?.toUpperCase() || 'CHECKING'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading service status...</div>
                ) : data?.services ? (
                    Object.entries(data.services).map(([serviceName, service]: [string, any]) => (
                        <div key={serviceName} className={`p-4 border rounded ${getStatusColor(service.status)}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold capitalize">{serviceName}</h4>
                                <span className="text-2xl">{getStatusBadge(service.status)}</span>
                            </div>

                            <div className="text-xs space-y-1">
                                <p>
                                    <strong>Status:</strong> {service.status?.toUpperCase() || 'UNKNOWN'}
                                </p>
                                {service.url && <p className="text-gray-600 break-all">{service.url}</p>}
                                {service.error && <p className="text-red-600">Error: {service.error}</p>}
                                {service.responseTime && <p>Response Time: {service.responseTime}</p>}
                                {service.timestamp && <p className="text-gray-500">{new Date(service.timestamp).toLocaleTimeString()}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">No data available</div>
                )}
            </div>

            {data?.timestamp && (
                <div className="mt-4 text-xs text-gray-500 text-right">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</div>
            )}
        </div>
    );
};

export default ServicesHealth;
