jest.mock('../lib/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => `translated:${key}`,
  },
}));

import { getErrorMessage, sanitize } from '../lib/domain/errorHandler';

describe('errorHandler', () => {
  it('maps 401 errors to a stable unauthorized key', () => {
    const error = {
      response: {
        status: 401,
        data: { message: 'token expired' },
      },
      message: 'Request failed with status code 401',
    };

    expect(sanitize(error)).toEqual({
      i18nKey: 'common.unauthorized',
      devDetails: 'status=401 message=Request failed with status code 401',
    });
    expect(getErrorMessage(error, 'fallback')).toBe('translated:common.unauthorized');
  });

  it('sanitizes 500 errors without exposing backend payloads', () => {
    const error = {
      response: {
        status: 500,
        data: { message: 'raw backend failure' },
      },
      code: 'ERR_BAD_RESPONSE',
      message: 'Request failed with status code 500',
    };

    const sanitized = sanitize(error);

    expect(sanitized.i18nKey).toBe('common.serverError');
    expect(sanitized.devDetails).toContain('status=500');
    expect(sanitized.devDetails).not.toContain('raw backend failure');
    expect(getErrorMessage(error, 'fallback')).toBe('translated:common.serverError');
  });
});
