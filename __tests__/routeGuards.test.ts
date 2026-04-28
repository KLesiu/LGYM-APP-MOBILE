import { useAuthStore } from '../stores/useAuthStore';
import { getBootstrapRoute } from '../lib/authRouting';

describe('route guard bootstrap behavior', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
    });
  });

  it('resolves to Home after hydrated authenticated bootstrap', () => {
    useAuthStore.setState({ isHydrated: true, isAuthenticated: true });
    expect(getBootstrapRoute(useAuthStore.getState())).toBe('/(app)/home');
  });

  it('resolves to Login after a 401-triggered session clear', () => {
    useAuthStore.setState({ isHydrated: true, isAuthenticated: false });
    expect(getBootstrapRoute(useAuthStore.getState())).toBe('/(auth)/login');
  });
});
