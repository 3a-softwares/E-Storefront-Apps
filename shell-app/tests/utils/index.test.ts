import { renderApp, changeTheme, MFE_CONFIG } from '../../src/utils';
import { getCurrentUser } from '@3asoftwares/utils/client';

// Mock utils/client
jest.mock('@3asoftwares/utils/client', () => ({
  getCurrentUser: jest.fn(),
  ADMIN_APP_URL: 'http://localhost:3001',
  SELLER_APP_URL: 'http://localhost:3002',
  getAccessToken: jest.fn(),
}));

describe('Utils', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe('MFE_CONFIG', () => {
    it('should have default configuration', () => {
      expect(MFE_CONFIG.useMicroFrontends).toBe(true);
      expect(MFE_CONFIG.adminAppUrl).toBeDefined();
      expect(MFE_CONFIG.sellerAppUrl).toBeDefined();
    });
  });

  describe('renderApp', () => {
    describe('with setActiveApp (MFE mode)', () => {
      it('should set active app to admin when role is admin', () => {
        const mockSetActiveApp = jest.fn();
        (getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1', email: 'test@test.com' });

        renderApp('admin', mockSetActiveApp);

        expect(mockSetActiveApp).toHaveBeenCalledWith('admin');
        expect(window.location.href).toBe('');
      });

      it('should set active app to seller when role is seller', () => {
        const mockSetActiveApp = jest.fn();
        (getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1', email: 'test@test.com' });

        renderApp('seller', mockSetActiveApp);

        expect(mockSetActiveApp).toHaveBeenCalledWith('seller');
        expect(window.location.href).toBe('');
      });

      it('should not set active app for unknown role', () => {
        const mockSetActiveApp = jest.fn();
        (getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1' });

        renderApp('customer', mockSetActiveApp);

        expect(mockSetActiveApp).not.toHaveBeenCalled();
      });
    });

    describe('without setActiveApp (redirect mode)', () => {
      beforeEach(() => {
        // Temporarily disable MFE mode
        (MFE_CONFIG as any).useMicroFrontends = false;
      });

      afterEach(() => {
        (MFE_CONFIG as any).useMicroFrontends = true;
      });

      it('should redirect to admin app with userId', () => {
        (getCurrentUser as jest.Mock).mockReturnValue({ id: 'user123' });

        renderApp('admin');

        expect(window.location.href).toContain('localhost:3001');
        expect(window.location.href).toContain('userId=user123');
      });

      it('should redirect to seller app with userId', () => {
        (getCurrentUser as jest.Mock).mockReturnValue({ _id: 'user456' });

        renderApp('seller');

        expect(window.location.href).toContain('localhost:3002');
        expect(window.location.href).toContain('userId=user456');
      });

      it('should handle user without id', () => {
        (getCurrentUser as jest.Mock).mockReturnValue({});

        renderApp('admin');

        expect(window.location.href).toContain('localhost:3001');
      });

      it('should handle null user', () => {
        (getCurrentUser as jest.Mock).mockReturnValue(null);

        renderApp('admin');

        expect(window.location.href).toContain('localhost:3001');
      });
    });
  });

  describe('changeTheme', () => {
    it('should add dark class when theme is dark', () => {
      changeTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when theme is light', () => {
      document.documentElement.classList.add('dark');
      changeTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should toggle between themes', () => {
      changeTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      changeTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      changeTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});

describe('Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default ADMIN_APP_URL when env is not set', () => {
    delete process.env.ADMIN_APP_URL;
    expect(MFE_CONFIG.adminAppUrl).toBeDefined();
  });

  it('should use default SELLER_APP_URL when env is not set', () => {
    delete process.env.SELLER_APP_URL;
    expect(MFE_CONFIG.sellerAppUrl).toBeDefined();
  });
});
