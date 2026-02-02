import { useState, useEffect } from 'react';
import { Button, Spinner, ToasterBox } from '@3asoftwares/ui';
import { formatIndianCompact } from '@3asoftwares/utils/client';
import { orderApi, handleApiError } from '../api/client';
import { useSellerAuthStore } from '../store/authStore';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sellerId: string;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  sellerSubtotal?: number;
  sellerItemCount?: number;
  totalItemCount?: number;
  isMultiSellerOrder?: boolean;
}

export const SellerOrders: React.FC = () => {
  const { user } = useSellerAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToaster, setShowToaster] = useState<boolean>(false);
  const [toasterMsg, setToasterMsg] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setError('Seller ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderApi.getBySeller(user.id, 1, 20);
        setOrders(response.data.data.orders || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus.toUpperCase() } : o))
      );
      setShowToaster(true);
      setToasterMsg(`Order status updated to ${newStatus}`);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setToasterMsg(errorMsg);
      setShowToaster(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {showToaster && (
        <ToasterBox message={toasterMsg} type="success" onClose={() => setShowToaster(false)} />
      )}

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        Order Fulfillment
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">No orders yet</p>
        </div>
      ) : (
            <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {order.isMultiSellerOrder && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      Multi-Seller Order ({order.sellerItemCount}/{order.totalItemCount} items
                      yours)
                    </span>
                  )}
                </div>
                <div className="sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatIndianCompact(order.sellerSubtotal ?? order.total)}
                  </p>
                  {order.isMultiSellerOrder && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your portion</p>
                  )}
                </div>
              </div>

              {/* Show seller's items in this order */}
              <div className="mb-4 space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity} × {formatIndianCompact(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatIndianCompact(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
                <div className="flex gap-2">
                  {order.orderStatus !== 'CONFIRMED' && order.orderStatus !== 'confirmed' && (
                    <Button size="sm" onClick={() => handleUpdateStatus(order._id, 'CONFIRMED')}>
                      Confirm
                    </Button>
                  )}
                  {order.orderStatus !== 'SHIPPED' && order.orderStatus !== 'shipped' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUpdateStatus(order._id, 'SHIPPED')}
                    >
                      Ship
                    </Button>
                  )}
                  {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'delivered' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUpdateStatus(order._id, 'DELIVERED')}
                    >
                      Deliver
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
