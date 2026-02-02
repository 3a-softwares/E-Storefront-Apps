import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@3asoftwares/ui';
import { useSellerAuthStore } from '../store/authStore';
import { orderApi, handleApiError } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatIndianCompact } from '@3asoftwares/utils/client';
import {
  faClipboard,
  faPlus,
  faRupee,
  faChartLine,
  faBox,
  faShoppingCart,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  processingOrders: number;
  completionRate: number;
  avgOrderValue: number;
  successRate: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSellerAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await orderApi.getSellerStats(user.id);

        if (response.data?.success && response.data?.data) {
          setStats(response.data.data);
        } else {
          setError('Failed to load dashboard stats');
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Here's what's happening with your business today.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : stats ? (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                    Total Revenue
                  </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 truncate">
                    {formatIndianCompact(Number(stats.totalRevenue.toFixed(2)))}
                  </p>
                </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 sm:p-4 rounded-full flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faRupee}
                      className="text-lg sm:text-2xl text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
            </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                    Total Orders
                  </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                    {stats.totalOrders}
                  </p>
                </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-2 sm:p-4 rounded-full flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                      className="text-lg sm:text-2xl text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
            </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 border-l-4 border-yellow-500 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                    Pending Orders
                  </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
                    {stats.pendingOrders}
                  </p>
                </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 sm:p-4 rounded-full flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faBox}
                      className="text-lg sm:text-2xl text-yellow-600 dark:text-yellow-400"
                  />
                </div>
              </div>
            </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                    Completed Orders
                  </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2">
                    {stats.completedOrders}
                  </p>
                </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-2 sm:p-4 rounded-full flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                      className="text-lg sm:text-2xl text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
            </div>
          </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Summary</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Completion Rate</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {stats.completionRate}%
                </p>
              </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Avg Order Value</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {formatIndianCompact(stats.avgOrderValue)}
                </p>
              </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Processing</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {stats.processingOrders}
                </p>
              </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Success Rate</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.successRate}%
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Button onClick={() => navigate('/products/new')} className="w-full justify-center text-sm sm:text-base">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" /> <span className="hidden sm:inline">Add New</span> Product
              </Button>
              <Button
                onClick={() => navigate('/orders')}
                variant="secondary"
                  className="w-full justify-center text-sm sm:text-base"
              >
                  <FontAwesomeIcon icon={faClipboard} className="mr-2" /> <span className="hidden sm:inline">View</span> Orders
              </Button>
              <Button
                onClick={() => navigate('/earnings')}
                variant="secondary"
                  className="w-full justify-center text-sm sm:text-base"
              >
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" /> <span className="hidden sm:inline">View</span> Analytics
              </Button>
            </div>
          </div>
        </>
      ) : !loading ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
          No data available. Please try refreshing the page.
        </div>
      ) : null}
    </div>
  );
};
