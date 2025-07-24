/**
 * Converte datas string no formato "yyyy-mm-dd" para UTC.
 */
export function dateUTC(date: string): Date {
  const year = parseInt(date.substring(0, 4));
  const month = parseInt(date.substring(5, 7));
  const day = parseInt(date.substring(8, 10));

  return new Date(Date.UTC(year, month - 1, day + 1));
}

export function formatUrlDateDOM(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}%2F${month}%2F${year}`;
}
