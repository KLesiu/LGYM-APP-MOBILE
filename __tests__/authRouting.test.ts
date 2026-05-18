import { getBootstrapRoute, shouldResetAuthSession } from '../lib/authRouting';

describe('authRouting', () => {
  it('routes hydrated authed users to Home', () => {
    expect(getBootstrapRoute({ isHydrated: true, isTokenChecked: true, isAuthenticated: true })).toBe('/(app)/home');
  });

  it('routes hydrated guests to Login', () => {
    expect(getBootstrapRoute({ isHydrated: true, isTokenChecked: true, isAuthenticated: false })).toBe('/(auth)/login');
  });

  it('keeps bootstrap blocked until hydration finishes', () => {
    expect(getBootstrapRoute({ isHydrated: false, isTokenChecked: false, isAuthenticated: true })).toBeNull();
  });

  it('keeps bootstrap blocked until token check finishes', () => {
    expect(getBootstrapRoute({ isHydrated: true, isTokenChecked: false, isAuthenticated: true })).toBeNull();
  });

  it('treats 401 errors as auth reset signals', () => {
    expect(shouldResetAuthSession({ response: { status: 401 } })).toBe(true);
  });

  it('treats expired session messages as auth reset signals', () => {
    expect(shouldResetAuthSession({ message: 'Session expired. Please log in again.' })).toBe(true);
  });
});
