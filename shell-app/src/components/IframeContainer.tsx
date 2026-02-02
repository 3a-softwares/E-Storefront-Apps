import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser, getAccessToken } from '@3asoftwares/utils/client';

interface IframeContainerProps {
    src: string;
    title: string;
    onClose?: () => void;
}

export const IframeContainer: React.FC<IframeContainerProps> = ({ src, title, onClose }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Send auth data to iframe once loaded
        const handleIframeLoad = () => {
            setIsLoading(false);
            const user = getCurrentUser();
            const token = getAccessToken();

            if (iframeRef.current?.contentWindow && user && token) {
                // Post message to iframe with auth data
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'AUTH_DATA',
                        payload: {
                            user,
                            token,
                        },
                    },
                    '*'
                );
            }
        };

        const iframe = iframeRef.current;
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
        }

        // Listen for messages from iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'LOGOUT_REQUEST') {
                onClose?.();
                window.location.href = '/?logout=true';
            }
            if (event.data?.type === 'CLOSE_APP') {
                onClose?.();
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            if (iframe) {
                iframe.removeEventListener('load', handleIframeLoad);
            }
            window.removeEventListener('message', handleMessage);
        };
    }, [onClose]);

    // Build URL with auth params
    const buildIframeUrl = () => {
        const user = getCurrentUser();
        const token = getAccessToken();
        const url = new URL(src);

        if (user?.id || user?._id) {
            url.searchParams.set('userId', user.id || user._id);
        }
        if (token) {
            url.searchParams.set('token', token);
        }

        return url.toString();
    };

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Loading spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10" style={{ top: '48px' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
            )}

            {/* Iframe */}
            <iframe
                ref={iframeRef}
                src={buildIframeUrl()}
                title={title}
                className="w-full border-0"
                style={{ height: 'calc(100vh - 48px)' }}
                allow="clipboard-read; clipboard-write"
            />
        </div>
    );
};

export default IframeContainer;
