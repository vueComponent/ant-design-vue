import {
  getDay,
  getYear,
  getMonth,
  getDate,
  endOfMonth,
  getHours,
  getMinutes,
  getSeconds,
  addYears,
  addMonths,
  addDays,
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isValid,
  getWeek,
  startOfWeek,
  format as formatDate,
  parse as parseDate,
  isDate,
  isMatch,
} from 'date-fns';
import * as Locale from 'date-fns/locale';
import type { GenerateConfig } from '.';

const dealLocal = (str: string) => {
  return str.replace(/_/g, '');
};

const localeParse = (format: string) => {
  return format
    .replace(/Y/g, 'y')
    .replace(/D/g, 'd')
    .replace(/gggg/, 'yyyy')
    .replace(/g/g, 'G')
    .replace(/([Ww])o/g, 'wo');
};

const generateConfig: GenerateConfig<Date> = {
  // get
  getNow: () => new Date(),
  getFixedDate: string => new Date(string),
  getEndDate: date => endOfMonth(date),
  getWeekDay: date => getDay(date),
  getYear: date => getYear(date),
  getMonth: date => getMonth(date),
  getDate: date => getDate(date),
  getHour: date => getHours(date),
  getMinute: date => getMinutes(date),
  getSecond: date => getSeconds(date),

  // set
  addYear: (date, diff) => addYears(date, diff),
  addMonth: (date, diff) => addMonths(date, diff),
  addDate: (date, diff) => addDays(date, diff),
  setYear: (date, year) => setYear(date, year),
  setMonth: (date, month) => setMonth(date, month),
  setDate: (date, num) => setDate(date, num),
  setHour: (date, hour) => setHours(date, hour),
  setMinute: (date, minute) => setMinutes(date, minute),
  setSecond: (date, second) => setSeconds(date, second),

  // Compare
  isAfter: (date1, date2) => isAfter(date1, date2),
  isValidate: date => isValid(date),

  locale: {
    getWeekFirstDay: locale => {
      const clone = Locale[dealLocal(locale)];
      return clone.options.weekStartsOn;
    },
    getWeekFirstDate: (locale, date) => {
      return startOfWeek(date, { locale: Locale[dealLocal(locale)] });
    },
    getWeek: (locale, date) => {
      return getWeek(date, { locale: Locale[dealLocal(locale)] });
    },
    getShortWeekDays: locale => {
      const clone = Locale[dealLocal(locale)];
      return Array.from({ length: 7 }).map((_, i) => clone.localize.day(i, { width: 'short' }));
    },
    getShortMonths: locale => {
      const clone = Locale[dealLocal(locale)];
      return Array.from({ length: 12 }).map((_, i) =>
        clone.localize.month(i, { width: 'abbreviated' }),
      );
    },
    format: (locale, date, format) => {
      if (!isValid(date)) {
        return null;
      }
      return formatDate(date, localeParse(format), {
        locale: Locale[dealLocal(locale)],
      });
    },
    parse: (locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const format = localeParse(formats[i]);
        const formatText = text;
        const date = parseDate(formatText, format, new Date(), {
          locale: Locale[dealLocal(locale)],
        });
        if (isValid(date) && formatText.length === format.length && isMatch(formatText, format)) {
          return date;
        }
      }
      return null;
    },
  },
  toDate: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map((val: any) =>
        typeof val === 'string' && val ? parseDate(val, valueFormat, new Date()) : val || null,
      ) as Date[];
    } else {
      return (
        typeof value === 'string' && value
          ? parseDate(value, valueFormat, new Date())
          : value || null
      ) as Date;
    }
  },
  toString: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map((val: any) =>
        isDate(val) ? formatDate(val as Date, valueFormat) : val,
      ) as string[];
    } else {
      return (isDate(value) ? formatDate(value as Date, valueFormat) : value) as string;
    }
  },
};

export default generateConfig;
