import React, { Suspense, lazy } from 'react';
import { Logger } from '@3asoftwares/utils/client';

interface RemoteModuleConfig {
  scope: string;
  module: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for remote module loading
 */
class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; remoteName: string },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    remoteName: string;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Logger.error(
      `Failed to load remote module [${this.props.remoteName}]`,
      { error, errorInfo },
      'RemoteLoader'
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[200px] bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Failed to load {this.props.remoteName}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                The remote application could not be loaded. Please ensure it is running.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

/**
 * Dynamically loads a remote module using Module Federation
 */
export function loadRemoteModule<T = any>(config: RemoteModuleConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    const { scope, module } = config;

    // @ts-ignore - Module Federation runtime API
    const container = (window as any)[scope];

    if (!container) {
      reject(
        new Error(`Remote container "${scope}" not found. Make sure the remote app is running.`)
      );
      return;
    }

    // @ts-ignore - Module Federation runtime API
    const shareScope =
      // @ts-ignore - Webpack Module Federation global
      typeof __webpack_share_scopes__ !== 'undefined' ? __webpack_share_scopes__.default : {};
    container
      .init(shareScope)
      .then(() => container.get(module))
      .then((factory: () => any) => {
        const Module = factory();
        resolve(Module);
      })
      .catch((err: Error) => {
        reject(new Error(`Failed to load module "${module}" from "${scope}": ${err.message}`));
      });
  });
}

/**
 * Creates a lazy-loaded remote component with error boundary
 */
export function createRemoteComponent(
  remoteName: string,
  modulePath: string,
  loadingMessage?: string
): React.FC {
  const RemoteComponent = lazy(() =>
    import(/* webpackIgnore: true */ `${remoteName}/${modulePath}`).catch((err) => {
      Logger.error(`Error loading ${remoteName}/${modulePath}`, err, 'RemoteLoader');
      // Return a fallback component
      return {
        default: () => (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-400">
              Unable to load {remoteName}. Please ensure the remote app is running on the correct
              port.
            </p>
          </div>
        ),
      };
    })
  );

  const WrappedComponent: React.FC = () => (
    <RemoteErrorBoundary remoteName={remoteName}>
      <Suspense
        fallback={<LoadingSpinner message={loadingMessage || `Loading ${remoteName}...`} />}
      >
        <RemoteComponent />
      </Suspense>
    </RemoteErrorBoundary>
  );

  WrappedComponent.displayName = `Remote(${remoteName}/${modulePath})`;

  return WrappedComponent;
}

/**
 * Hook to check if a remote app is available
 */
export function useRemoteAvailability(remoteUrl: string): {
  isAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
} {
  const [state, setState] = React.useState({
    isAvailable: false,
    isLoading: true,
    error: null as Error | null,
  });

  React.useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await fetch(remoteUrl, { method: 'HEAD', mode: 'cors' });
        setState({
          isAvailable: response.ok,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isAvailable: false,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    checkAvailability();
  }, [remoteUrl]);

  return state;
}

// Pre-configured remote components
export const RemoteAdminApp = createRemoteComponent(
  'adminApp',
  'App',
  'Loading Admin Dashboard...'
);
export const RemoteSellerApp = createRemoteComponent(
  'sellerApp',
  'App',
  'Loading Seller Portal...'
);

// Individual remote pages
export const RemoteAdminDashboard = createRemoteComponent('adminApp', 'Dashboard');
export const RemoteAdminUsers = createRemoteComponent('adminApp', 'Users');
export const RemoteAdminProducts = createRemoteComponent('adminApp', 'Products');
export const RemoteAdminOrders = createRemoteComponent('adminApp', 'Orders');
export const RemoteAdminCoupons = createRemoteComponent('adminApp', 'Coupons');

export const RemoteSellerDashboard = createRemoteComponent('sellerApp', 'Dashboard');
export const RemoteSellerProducts = createRemoteComponent('sellerApp', 'SellerProducts');
export const RemoteSellerUpload = createRemoteComponent('sellerApp', 'SellerUpload');
export const RemoteSellerOrders = createRemoteComponent('sellerApp', 'SellerOrders');
export const RemoteSellerEarnings = createRemoteComponent('sellerApp', 'SellerEarnings');
