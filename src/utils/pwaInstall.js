export const getInstallPlatform = (userAgent = '') => {
  const ua = String(userAgent).toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
};

export const isStandaloneMode = (navigatorLike = {}) => Boolean(
  navigatorLike.standalone === true
);
