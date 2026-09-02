import test from 'node:test';
import assert from 'node:assert/strict';
import { isTemporaryNoticeActive, NOTICE_END, NOTICE_TEXT } from '../src/utils/temporaryNotice.mjs';

test('temporary notice is active before the 3-day end and hidden at/after the end', () => {
  assert.equal(isTemporaryNoticeActive(new Date('2026-09-04T23:59:59+05:30')), true);
  assert.equal(isTemporaryNoticeActive(NOTICE_END), false);
  assert.equal(isTemporaryNoticeActive(new Date('2026-09-05T00:00:01+05:30')), false);
});

test('temporary notice uses the exact approved customer message', () => {
  assert.equal(NOTICE_TEXT, '🔴 IMPORTANT NOTICE: Bring My Bite will be temporarily unavailable for the next 3 days as our team is engaged in supporting and serving people affected by the current situation. We sincerely apologize for the inconvenience. We will be back serving you after 3 days. 🙏❤️');
});
