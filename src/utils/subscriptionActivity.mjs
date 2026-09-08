const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    const date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSubscriptionDay = (startDate, referenceDate = new Date()) => {
  const start = parseDate(startDate);
  const reference = parseDate(referenceDate);
  if (!start || !reference) return 1;
  const elapsed = Math.floor((reference.getTime() - start.getTime()) / MS_PER_DAY);
  return Math.max(1, elapsed + 1);
};

const isActive = (subscription) => subscription?.active === true && subscription?.verificationStatus === 'Approved';

export const getSubscriptionActivityMetrics = (subscriptions = [], referenceDate = new Date()) => {
  const reference = parseDate(referenceDate);
  if (!reference) return { active: 0, newToday: 0, startedThisWeek: 0, expiringSoon: 0 };

  const activeSubscriptions = subscriptions.filter(isActive);
  const todayTime = reference.getTime();
  const weekStartTime = todayTime - (6 * MS_PER_DAY);

  return {
    active: activeSubscriptions.length,
    newToday: activeSubscriptions.filter((s) => parseDate(s.startDate)?.getTime() === todayTime).length,
    startedThisWeek: activeSubscriptions.filter((s) => {
      const start = parseDate(s.startDate)?.getTime();
      return start !== undefined && start >= weekStartTime && start <= todayTime;
    }).length,
    expiringSoon: activeSubscriptions.filter((s) => {
      const expiry = parseDate(s.expiryDate)?.getTime();
      if (expiry === undefined) return false;
      const daysRemaining = Math.ceil((expiry - todayTime) / MS_PER_DAY);
      return daysRemaining >= 0 && daysRemaining <= 3;
    }).length,
  };
};
