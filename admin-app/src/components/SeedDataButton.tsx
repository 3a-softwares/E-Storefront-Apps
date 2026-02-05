/**
 * Data Seeding Component
 * Allows admins to seed the database with sample data
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const GATEWAY_URL = process.env.VITE_GATEWAY_URL || 'http://localhost:3000/api';

export const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Check seed status
  const { data: seedStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['seedStatus'],
    queryFn: async () => {
      const response = await axios.get(`${GATEWAY_URL}/seed/status`);
      return response.data;
    },
    enabled: true,
  });

  const handleSeedData = async () => {
    if (
      !window.confirm(
        'Are you sure you want to seed the database with sample data? This will replace existing data.'
      )
    ) {
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await axios.post(`${GATEWAY_URL}/seed`);
      setStatus('success');
      setMessage('Database seeded successfully!');
      console.log('Seed stats:', response.data.stats);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  const isDbEmpty = seedStatus?.isEmpty;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Database Seeding</h3>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Status:</strong>{' '}
          {statusLoading ? 'Checking...' : isDbEmpty ? '🔴 Empty' : '🟢 Populated'}
        </p>
        {seedStatus?.stats && (
          <div className="text-xs text-gray-600 space-y-1">
            {Object.entries(seedStatus.stats).map(([collection, count]) => (
              <div key={collection}>
                {collection}: {count as number} documents
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSeedData}
        disabled={loading || statusLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Seeding...' : 'Seed Database with Sample Data'}
      </button>

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ {message}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ {message}
        </div>
      )}
    </div>
  );
};

export default SeedDataButton;
