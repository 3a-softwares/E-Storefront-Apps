// Mock for 3asoftwares/utils
export const SHELL_APP_URL = 'http://localhost:3000';
export const API_BASE_URL = 'http://localhost:4000';
export const AUTH_SERVICE_BASE_URL = 'http://localhost:4000/api/auth';

export const clearAuth = jest.fn();
export const storeAuth = jest.fn();
export const getStoredAuth = jest.fn(() => null);

export const formatCurrency = jest.fn((amount: number) => `$${amount.toFixed(2)}`);
export const formatDate = jest.fn((date: string | Date) => new Date(date).toLocaleDateString());

export const Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

export default {
  SHELL_APP_URL,
  API_BASE_URL,
  AUTH_SERVICE_BASE_URL,
  clearAuth,
  storeAuth,
  getStoredAuth,
  formatCurrency,
  formatDate,
  Logger,
};
