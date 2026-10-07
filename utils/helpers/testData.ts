/**
 * Random data helpers for the Tricentis mobile-web test framework.
 * No external faker dependency - everything is generated locally so
 * the framework stays light and deterministic-friendly.
 *
 * Ported from the Playwright/TypeScript desktop project. The values and
 * ranges match Tricentis' idealForms rules exactly so the same validation
 * invariants are exercised on iOS Safari and Android Chrome.
 */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomString(length = 8): string {
  // Letters only - Tricentis' idealForms "name" rule rejects digits.
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let s = '';
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function randomAlphanumeric(length = 8): string {
  let s = '';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function randomEmail(domain?: string): string {
  const d = domain ?? randomItem(['example.com', 'mail.com', 'test.org', 'insurance.io']);
  return `${randomString(7).toLowerCase()}@${d}`;
}

export function randomPhone(): string {
  return `+1${randomInt(200, 999)}${randomInt(1000000, 9999999)}`;
}

export function randomUsername(prefix = 'user'): string {
  return `${prefix}_${randomAlphanumeric(6).toLowerCase()}`;
}

export function randomPassword(length = 7): string {
  // Match the Tricentis pattern (digits + uppercase + lowercase + "!Aa1")
  const digits = String(randomInt(1000, 9999));
  const upper = String.fromCharCode(65 + randomInt(0, 25));
  const lower = randomString(2);
  return `${digits}${upper}${lower}!Aa1`;
}

export function randomDateOfBirth(minAge = 18, maxAge = 70): string {
  // Tricentis' idealforms date rule requires 18 <= age <= 70.
  const today = new Date();
  const year = today.getFullYear() - randomInt(minAge, maxAge);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}

export function randomFutureDate(daysAhead = 90): string {
  // Tricentis requires start date to be at least 1 month in the future.
  // Pick a date at least 35 days ahead to be safely past that threshold.
  const d = new Date();
  d.setDate(d.getDate() + randomInt(35, daysAhead));
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${d.getFullYear()}`;
}

export function randomPastDate(yearsBack = 10): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - randomInt(1, yearsBack));
  d.setMonth(randomInt(0, 11));
  d.setDate(randomInt(1, 28));
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${d.getFullYear()}`;
}

export function randomZip(): string {
  return String(randomInt(10000, 99999));
}

export function randomLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return (
    randomInt(10, 99) +
    letters[randomInt(0, 25)] +
    letters[randomInt(0, 25)] +
    '-' +
    randomInt(1000, 9999)
  );
}

export function randomWebsite(): string {
  const names = ['example', 'test', 'demo', 'qa', 'sample'];
  return `https://www.${randomItem(names)}${randomInt(10, 999)}.com`;
}

export function randomStreetAddress(): string {
  return `${randomInt(1, 9999)} ${randomString(6)} Street`;
}

export function randomCity(): string {
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Berlin',
    'Madrid',
    'Tokyo',
  ];
  return randomItem(cities);
}

export function randomComments(): string {
  const samples = [
    'Please contact me via email.',
    'No additional comments at this time.',
    'Looking forward to your reply.',
    'Thanks for the great coverage options!',
    'Please process this quote quickly.',
  ];
  return randomItem(samples);
}
