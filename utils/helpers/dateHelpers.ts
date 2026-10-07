/**
 * Date helpers tailored for the Tricentis form, which uses MM/DD/YYYY
 * in the UI but also accepts ISO dates (YYYY-MM-DD) for some inputs.
 *
 * Ported from the Playwright/TypeScript desktop project. Behaviour is
 * identical so the same date invariants are exercised on iOS Safari
 * and Android Chrome.
 */

export function toTricentisDate(date: Date): string {
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${m}/${d}/${date.getFullYear()}`;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return toTricentisDate(new Date());
}

export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toTricentisDate(d);
}

export function daysAhead(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toTricentisDate(d);
}

export function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return toTricentisDate(d);
}

export function isPastDate(tricentisDate: string): boolean {
  const [m, d, y] = tricentisDate.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getTime() < new Date().setHours(0, 0, 0, 0);
}

export function isFutureDate(tricentisDate: string): boolean {
  const [m, day, y] = tricentisDate.split('/').map(Number);
  const date = new Date(y, m - 1, day);
  return date.getTime() > new Date().setHours(23, 59, 59, 999);
}
