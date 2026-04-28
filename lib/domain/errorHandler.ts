import i18n from '../i18n';

type SanitizedError = {
  i18nKey: string;
  devDetails?: string;
};

type ErrorLike = {
  code?: string;
  message?: string;
  response?: {
    status?: number;
  };
};

const ERROR_KEY_BY_STATUS: Record<number, string> = {
  401: 'common.unauthorized',
  403: 'common.forbidden',
  404: 'common.notFound',
  408: 'common.requestTimeout',
  409: 'common.conflict',
  422: 'common.unprocessableEntity',
  429: 'common.tooManyRequests',
};

const normalizeError = (error: unknown): ErrorLike => (error as ErrorLike | null | undefined) ?? {};

const isNetworkLikeError = (error: unknown): boolean => {
  const normalizedError = normalizeError(error);
  const code = String(normalizedError?.code ?? '').toUpperCase();
  const message = String(normalizedError?.message ?? '').toLowerCase();

  return code === 'ERR_NETWORK' || code === 'ECONNABORTED' || message.includes('network error');
};

const getStatus = (error: unknown): number | undefined => normalizeError(error)?.response?.status;

const getI18nKey = (error: unknown): string => {
  const normalizedError = normalizeError(error);

  if (isNetworkLikeError(error) || !normalizedError.response) {
    return 'common.networkError';
  }

  const status = getStatus(error);
  if (typeof status === 'number') {
    if (status >= 500) {
      return 'common.serverError';
    }

    return ERROR_KEY_BY_STATUS[status] ?? 'common.tryAgain';
  }

  return 'common.tryAgain';
};

const buildDevDetails = (error: unknown): string | undefined => {
  const normalizedError = normalizeError(error);
  const status = getStatus(error);
  const code = normalizedError?.code ? ` code=${String(normalizedError.code)}` : '';
  const message = normalizedError?.message ? ` message=${String(normalizedError.message)}` : '';

  if (!status && !code && !message) {
    return undefined;
  }

  return `status=${status ?? 'unknown'}${code}${message}`;
};

export const sanitize = (error: unknown): SanitizedError => ({
  i18nKey: getI18nKey(error),
  ...(buildDevDetails(error) ? { devDetails: buildDevDetails(error)! } : {}),
});

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An error occurred',
): string => {
  const { i18nKey } = sanitize(error);
  const translatedMessage = i18n.t(i18nKey);

  return translatedMessage === i18nKey ? defaultMessage : translatedMessage;
};
