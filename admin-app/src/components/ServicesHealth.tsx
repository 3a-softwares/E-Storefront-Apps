/**
 * Services Health Check Component
 * Displays health status of all microservices
 * Allows seeding data to database
 */

import { SERVICE_URLS } from '@3asoftwares/utils/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { Button, Input, Table } from '@3asoftwares/ui';
import { useAppSelector } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faXmark } from '@fortawesome/free-solid-svg-icons';

const GATEWAY_URL = process.env.VITE_GRAPHQL_API || SERVICE_URLS.GRAPHQL_GATEWAY;

export const ServicesHealth = () => {
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['servicesHealth'],
    queryFn: async () => {
      const response = await axios.get(`${GATEWAY_URL}/api/health/services`);
      return response.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const { data: seedStatusData, refetch: refetchSeedStatus } = useQuery({
    queryKey: ['seedStatus'],
    queryFn: async () => {
      const response = await axios.get(`${GATEWAY_URL}/api/seed/status`);
      return response.data;
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
  });

  const handleSeedData = async () => {
    setSeedLoading(true);
    setSeedStatus(null);
    try {
      const response = await axios.post(`${GATEWAY_URL}/api/seed`, user);
      setSeedStatus({
        success: response.data.success,
        message: response.data.message,
      });
      // Refetch seed status after successful seeding
      setTimeout(() => {
        refetchSeedStatus();
      }, 1000);
    } catch (error: any) {
      setSeedStatus({
        success: false,
        message: error?.response?.data?.message || 'Error seeding data',
      });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all seeded data? This action cannot be undone.')) {
      return;
    }
    setSeedLoading(true);
    setSeedStatus(null);
    try {
      const response = await axios.post(`${GATEWAY_URL}/api/seed/clear`, user);
      setSeedStatus({
        success: response.data.success,
        message: response.data.message,
      });
      setTimeout(() => {
        refetchSeedStatus();
      }, 1000);
    } catch (error: any) {
      setSeedStatus({
        success: false,
        message: error?.response?.data?.message || 'Error clearing data',
      });
    } finally {
      setSeedLoading(false);
    }
  };

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

  const [filter, setFilter] = useState('');

  const filteredServices = useMemo(() => {
    if (!data?.services) return [];
    if (!filter) return data.services;
    return data.services.filter((s: any) => s.name.toLowerCase().includes(filter.toLowerCase()));
  }, [data?.services, filter]);

  const columns = useMemo(
    () => [
      { header: 'Service', accessor: 'name' },
      {
        header: 'Status',
        key: 'status',
        cell: (row: any) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'healthy' ? 'bg-gray-100 text-gray-800' : row.status === 'unhealthy' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {row.status}
          </span>
        ),
      },
      { header: 'URL', accessor: 'url' },
      { header: 'Response Time', accessor: 'responseTime' },
      {
        header: 'Uptime (s)',
        accessor: 'uptime',
        cell: (row: any) => (row.uptime ? Math.floor(row.uptime) : '-'),
      },
      {
        header: 'Last Checked',
        accessor: 'timestamp',
        cell: (row: any) => (row.timestamp ? new Date(row.timestamp).toLocaleString() : '-'),
      },
      {
        header: 'Actions',
        key: 'actions',
        cell: (row: any) => (
          <div className="flex gap-2">
            {row.url && (
              <a href={`${row.url}/health`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                Check
              </a>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Services Health Status</h3>
        <Button
          className='!w-auto'
          variant='outline'
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSync} className="mr-1" />
          {isLoading ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      <div className={`mb-4 p-3 rounded ${getStatusColor(data?.overallStatus || 'unknown')}`}>
        <p className="font-semibold">
          {getStatusBadge(data?.overallStatus || 'unknown')} Overall Status:{' '}
          {data?.overallStatus?.toUpperCase() || 'CHECKING'}
        </p>
        {data?.healthyCount !== undefined && (
          <p className="text-sm mt-1">
            {data.healthyCount} / {data.totalServices} services healthy
          </p>
        )}
      </div>

      {/* Services Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 gap-3">
          <div className="flex items-start gap-2">
            <Input className="max-w-sm"
              value={filter} placeholder='Search service...' onChange={(e) => setFilter(e.target.value)} />
            {filter !== '' && <Button variant='outline' onClick={() => setFilter('')} className="!w-auto">
              <FontAwesomeIcon icon={faXmark} />
            </Button>}
          </div>
          <div className="text-sm text-gray-500">Showing {filteredServices.length} of {data?.totalServices || 0}</div>
        </div>

        <Table
          columns={columns}
          data={filteredServices}
          loading={isLoading}
          emptyMessage="No services found"
          hoverable
          striped
        />
      </div>

      {/* Seed Data Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
        <h4 className="font-semibold mb-3">Database Status</h4>

        {seedStatusData && (
          <div className="mb-3 p-2 bg-white rounded text-sm">
            <p className="font-semibold mb-1">Current Database Status:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(seedStatusData.stats || {}).map(([collection, count]: [string, any]) => (
                <div key={collection} className="text-sm capitalize">
                  <span className="font-bold">{count}</span> {collection}
                </div>
              ))}
            </div>
            {seedStatusData.isEmpty && (
              <p className="text-red-600 text-xs mt-2">Database is empty</p>
            )}
          </div>
        )}

        {seedStatus && (
          <div
            className={`mb-3 p-2 rounded text-sm ${seedStatus.success
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}
          >
            {seedStatus.message}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" className='!w-auto'
            disabled={seedLoading} onClick={handleClearData}>
            {seedLoading ? 'Clearing...' : 'Clear Data'}
          </Button>
          <Button variant="primary" className='!w-auto'
            disabled={seedLoading} onClick={handleSeedData}>
            {seedLoading ? 'Seeding...' : 'Seed Data'}
          </Button>
        </div>
      </div>

      {data?.timestamp && (
        <div className="mt-4 text-xs text-gray-500 text-right">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ServicesHealth;
