import { resolveBackendBaseUrl } from '../lib/resolveBackendBaseUrl';

describe('resolveBackendBaseUrl', () => {
  const originalDev = __DEV__;

  afterEach(() => {
    Object.defineProperty(globalThis, '__DEV__', {
      configurable: true,
      value: originalDev,
    });
  });

  it('keeps https backend URLs stable in dev', () => {
    Object.defineProperty(globalThis, '__DEV__', {
      configurable: true,
      value: true,
    });

    expect(resolveBackendBaseUrl('https://localhost:7025/', { dev: true })).toBe(
      'https://localhost:7025',
    );
  });

  it('rejects http backend URLs in release', () => {
    Object.defineProperty(globalThis, '__DEV__', {
      configurable: true,
      value: false,
    });

    expect(() => resolveBackendBaseUrl('http://192.168.1.10:4000', { dev: false })).toThrow(
      'HTTPS required in release',
    );
  });
});
