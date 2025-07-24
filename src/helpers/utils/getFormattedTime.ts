import { format } from 'date-fns';

export function getFormattedTime(timeFormat: string) {
  return format(new Date(), timeFormat);
}
