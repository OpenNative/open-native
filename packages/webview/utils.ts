import escapeStringRegexp from 'escape-string-regexp';

export const defaultOriginWhitelist = ['http://*', 'https://*'] as const;
export const extractOrigin = (url: string): string => {
  const result = /^[A-Za-z][A-Za-z0-9+\-.]+:(\/\/)?[^/]*/.exec(url);
  return result === null ? '' : result[0];
};

export const originWhitelistToRegex = (originWhitelist: string): string => `^${escapeStringRegexp(originWhitelist).replace(/\\\*/g, '.*')}`;

export const passesWhitelist = (compiledWhitelist: readonly string[], url: string) => {
  const origin = extractOrigin(url);
  return compiledWhitelist.some((x) => new RegExp(x).test(origin));
};

export const compileWhitelist = (originWhitelist: readonly string[]): readonly string[] => ['about:blank', ...(originWhitelist || [])].map(originWhitelistToRegex);
