import { Linking } from 'react-native';

const ALLOWED_HOSTS = ['lgym.app', 'play.google.com', 'apps.apple.com'] as const;

const isAllowedHost = (host: string): boolean =>
  ALLOWED_HOSTS.includes(host as (typeof ALLOWED_HOSTS)[number]);

export const safeOpenUrl = async (rawUrl?: string | null): Promise<void> => {
  if (!rawUrl) {
    throw new Error('Missing URL');
  }

  const normalizedUrl = rawUrl.trim();
  const parsed = new URL(normalizedUrl);

  if (parsed.protocol !== 'https:') {
    throw new Error('URL must use HTTPS');
  }

  if (!isAllowedHost(parsed.hostname)) {
    throw new Error('URL host is not allowlisted');
  }

  const supported = await Linking.canOpenURL(parsed.toString());
  if (!supported) {
    throw new Error('Cannot open URL');
  }

  await Linking.openURL(parsed.toString());
};
