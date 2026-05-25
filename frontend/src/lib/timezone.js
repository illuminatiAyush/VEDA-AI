/**
 * Timezone utilities for Evalix
 * All times displayed in Asia/Kolkata (IST, GMT+5:30)
 */

const TIMEZONE = 'Asia/Kolkata';

/**
 * Formats a date/ISO string to IST display string.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options override
 * @returns {string} Formatted IST string
 */
export function formatIST(date, options = {}) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const defaults = {
    timeZone: TIMEZONE,
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return d.toLocaleString('en-IN', { ...defaults, ...options });
}

/**
 * Formats a date to show only the date portion in IST.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatISTDate(date) {
  return formatIST(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: undefined,
    minute: undefined,
    hour12: undefined,
  });
}

/**
 * Formats date as DD-MM-YYYY (Figma assignment cards).
 */
/**
 * Parses DD-MM-YYYY to ISO end-of-day UTC-ish (local midnight end).
 */
export function parseDDMMYYYYToISO(str) {
  if (!str?.trim()) return null;
  const parts = str.trim().split(/[-/]/);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((p) => parseInt(p, 10));
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d, 23, 59, 59);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function formatDDMMYYYY(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

/**
 * Converts a datetime-local input value (no timezone) to a proper ISO string.
 * The datetime-local input gives us "2026-04-27T22:30" which is local time.
 * new Date() treats this as local time, so .toISOString() converts it correctly to UTC.
 * @param {string} localDateTimeStr - Value from datetime-local input
 * @returns {string|null} ISO 8601 string in UTC, or null if empty
 */
export function localInputToISO(localDateTimeStr) {
  if (!localDateTimeStr) return null;
  try {
    const [datePart, timePart] = localDateTimeStr.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    const d = new Date(year, month - 1, day, hour, minute);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch (err) {
    return null;
  }
}

/**
 * Converts an ISO/UTC date string to a value suitable for datetime-local input.
 * @param {string} isoStr - ISO 8601 date string
 * @returns {string} Format: "YYYY-MM-DDTHH:MM" in local time
 */
export function isoToLocalInput(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
