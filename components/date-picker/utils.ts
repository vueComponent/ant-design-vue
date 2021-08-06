import type dayjs from 'dayjs';

type Value = dayjs.Dayjs | undefined | null;
type Format = string | string[] | undefined | ((val?: Value) => string | string[] | undefined);
export function formatDate(value: Value, format: Format) {
  if (!value) {
    return '';
  }
  if (Array.isArray(format)) {
    format = format[0];
  }
  if (typeof format === 'function') {
    return format(value);
  }
  return value.format(format);
}
