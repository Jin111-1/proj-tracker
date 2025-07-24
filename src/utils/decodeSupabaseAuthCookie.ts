export function decodeSupabaseAuthCookie(rawCookie?: string): string | undefined {
  if (!rawCookie) return undefined;
  const accessToken = rawCookie;
  if (accessToken.startsWith('base64-')) {
    try {
      const base64Str = accessToken.replace('base64-', '');
      const jsonStr = Buffer.from(base64Str, 'base64').toString('utf-8');
      const parsed = JSON.parse(jsonStr);
      return parsed.access_token;
    } catch {
      return undefined;
    }
  }
  return accessToken;
} 