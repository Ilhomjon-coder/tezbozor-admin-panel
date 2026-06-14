// DISPLAY formatting only — never money math. All amounts shown here come
// already computed from the backend (admin-panel CLAUDE.md → "never compute
// money client-side"); these helpers just format the server's integer so'm.

/** Integer so'm → "127 000 so'm" (space thousands separator, contracts.md → Money). */
export function formatSom(uzs: number): string {
  const negative = uzs < 0;
  const grouped = Math.abs(Math.trunc(uzs))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${negative ? '-' : ''}${grouped} so'm`;
}

/** Signed so'm for deltas, e.g. "+4 000 so'm" / "-30 000 so'm". */
export function formatSignedSom(uzs: number): string {
  if (uzs === 0) return formatSom(0);
  const sign = uzs > 0 ? '+' : '-';
  return `${sign}${formatSom(Math.abs(uzs)).replace(/^-/, '')}`;
}

/** "1.50" + "kg" → "1.5 kg"; trims trailing zeros for readability. */
export function formatQty(qty: string, unitLabel: string): string {
  const n = Number(qty);
  const pretty = Number.isInteger(n) ? String(n) : String(n).replace(/0+$/, '').replace(/\.$/, '');
  return `${pretty} ${unitLabel}`;
}

/** Today's Tashkent calendar date as YYYY-MM-DD (business time; en-CA → ISO order). */
export function todayTashkent(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });
}

/** ISO timestamp → "14.06.2026 13:45" in Asia/Tashkent (business time). */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
