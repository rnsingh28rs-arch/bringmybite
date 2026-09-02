export const NOTICE_TEXT = '🔴 IMPORTANT NOTICE: Bring My Bite will be temporarily unavailable for the next 3 days as our team is engaged in supporting and serving people affected by the current situation. We sincerely apologize for the inconvenience. We will be back serving you after 3 days. 🙏❤️';

export const NOTICE_END = new Date('2026-09-05T00:00:00+05:30');

export function isTemporaryNoticeActive(now = new Date()) {
  return now < NOTICE_END;
}
