import { DECADE_UNIT_DIFF } from '../panels/DecadePanel/index';
import type { PanelMode, NullableDateType, PickerMode, Locale, CustomFormat } from '../interface';
import type { GenerateConfig } from '../generate';

export const WEEK_DAY_COUNT = 7;

export function isNullEqual<T>(value1: T, value2: T): boolean | undefined {
  if (!value1 && !value2) {
    return true;
  }
  if (!value1 || !value2) {
    return false;
  }
  return undefined;
}

export function isSameDecade<DateType>(
  generateConfig: GenerateConfig<DateType>,
  decade1: NullableDateType<DateType>,
  decade2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(decade1, decade2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  const num1 = Math.floor(generateConfig.getYear(decade1!) / 10);
  const num2 = Math.floor(generateConfig.getYear(decade2!) / 10);
  return num1 === num2;
}

export function isSameYear<DateType>(
  generateConfig: GenerateConfig<DateType>,
  year1: NullableDateType<DateType>,
  year2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(year1, year2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return generateConfig.getYear(year1!) === generateConfig.getYear(year2!);
}

export function getQuarter<DateType>(generateConfig: GenerateConfig<DateType>, date: DateType) {
  const quota = Math.floor(generateConfig.getMonth(date) / 3);
  return quota + 1;
}

export function isSameQuarter<DateType>(
  generateConfig: GenerateConfig<DateType>,
  quarter1: NullableDateType<DateType>,
  quarter2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(quarter1, quarter2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return (
    isSameYear(generateConfig, quarter1, quarter2) &&
    getQuarter(generateConfig, quarter1!) === getQuarter(generateConfig, quarter2!)
  );
}

export function isSameMonth<DateType>(
  generateConfig: GenerateConfig<DateType>,
  month1: NullableDateType<DateType>,
  month2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(month1, month2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return (
    isSameYear(generateConfig, month1, month2) &&
    generateConfig.getMonth(month1!) === generateConfig.getMonth(month2!)
  );
}

export function isSameDate<DateType>(
  generateConfig: GenerateConfig<DateType>,
  date1: NullableDateType<DateType>,
  date2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(date1, date2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return (
    generateConfig.getYear(date1!) === generateConfig.getYear(date2!) &&
    generateConfig.getMonth(date1!) === generateConfig.getMonth(date2!) &&
    generateConfig.getDate(date1!) === generateConfig.getDate(date2!)
  );
}

export function isSameTime<DateType>(
  generateConfig: GenerateConfig<DateType>,
  time1: NullableDateType<DateType>,
  time2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(time1, time2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return (
    generateConfig.getHour(time1!) === generateConfig.getHour(time2!) &&
    generateConfig.getMinute(time1!) === generateConfig.getMinute(time2!) &&
    generateConfig.getSecond(time1!) === generateConfig.getSecond(time2!)
  );
}

export function isSameWeek<DateType>(
  generateConfig: GenerateConfig<DateType>,
  locale: string,
  date1: NullableDateType<DateType>,
  date2: NullableDateType<DateType>,
) {
  const equal = isNullEqual(date1, date2);
  if (typeof equal === 'boolean') {
    return equal;
  }

  return (
    generateConfig.locale.getWeek(locale, date1!) === generateConfig.locale.getWeek(locale, date2!)
  );
}

export function isEqual<DateType>(
  generateConfig: GenerateConfig<DateType>,
  value1: NullableDateType<DateType>,
  value2: NullableDateType<DateType>,
) {
  return isSameDate(generateConfig, value1, value2) && isSameTime(generateConfig, value1, value2);
}

/** Between in date but not equal of date */
export function isInRange<DateType>(
  generateConfig: GenerateConfig<DateType>,
  startDate: NullableDateType<DateType>,
  endDate: NullableDateType<DateType>,
  current: NullableDateType<DateType>,
) {
  if (!startDate || !endDate || !current) {
    return false;
  }

  return (
    !isSameDate(generateConfig, startDate, current) &&
    !isSameDate(generateConfig, endDate, current) &&
    generateConfig.isAfter(current, startDate) &&
    generateConfig.isAfter(endDate, current)
  );
}

export function getWeekStartDate<DateType>(
  locale: string,
  generateConfig: GenerateConfig<DateType>,
  value: DateType,
) {
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale);
  const monthStartDate = generateConfig.setDate(value, 1);
  const startDateWeekDay = generateConfig.getWeekDay(monthStartDate);

  let alignStartDate = generateConfig.addDate(monthStartDate, weekFirstDay - startDateWeekDay);

  if (
    generateConfig.getMonth(alignStartDate) === generateConfig.getMonth(value) &&
    generateConfig.getDate(alignStartDate) > 1
  ) {
    alignStartDate = generateConfig.addDate(alignStartDate, -7);
  }

  return alignStartDate;
}

export function getClosingViewDate<DateType>(
  viewDate: DateType,
  picker: PickerMode,
  generateConfig: GenerateConfig<DateType>,
  offset = 1,
): DateType {
  switch (picker) {
    case 'year':
      return generateConfig.addYear(viewDate, offset * 10);
    case 'quarter':
    case 'month':
      return generateConfig.addYear(viewDate, offset);
    default:
      return generateConfig.addMonth(viewDate, offset);
  }
}

export function formatValue<DateType>(
  value: DateType,
  {
    generateConfig,
    locale,
    format,
  }: {
    generateConfig: GenerateConfig<DateType>;
    locale: Locale;
    format: string | CustomFormat<DateType>;
  },
) {
  return typeof format === 'function'
    ? format(value)
    : generateConfig.locale.format(locale.locale, value, format);
}

export function parseValue<DateType>(
  value: string,
  {
    generateConfig,
    locale,
    formatList,
  }: {
    generateConfig: GenerateConfig<DateType>;
    locale: Locale;
    formatList: (string | CustomFormat<DateType>)[];
  },
) {
  if (!value || typeof formatList[0] === 'function') {
    return null;
  }

  return generateConfig.locale.parse(locale.locale, value, formatList as string[]);
}

// eslint-disable-next-line consistent-return
export function getCellDateDisabled<DateType>({
  cellDate,
  mode,
  disabledDate,
  generateConfig,
}: {
  cellDate: DateType;
  mode: Omit<PanelMode, 'time'>;
  generateConfig: GenerateConfig<DateType>;
  disabledDate?: (date: DateType) => boolean;
}): boolean {
  if (!disabledDate) return false;
  // Whether cellDate is disabled in range
  const getDisabledFromRange = (
    currentMode: 'date' | 'month' | 'year',
    start: number,
    end: number,
  ) => {
    let current = start;
    while (current <= end) {
      let date: DateType;
      switch (currentMode) {
        case 'date': {
          date = generateConfig.setDate(cellDate, current);
          if (!disabledDate(date)) {
            return false;
          }
          break;
        }
        case 'month': {
          date = generateConfig.setMonth(cellDate, current);
          if (
            !getCellDateDisabled({
              cellDate: date,
              mode: 'month',
              generateConfig,
              disabledDate,
            })
          ) {
            return false;
          }
          break;
        }
        case 'year': {
          date = generateConfig.setYear(cellDate, current);
          if (
            !getCellDateDisabled({
              cellDate: date,
              mode: 'year',
              generateConfig,
              disabledDate,
            })
          ) {
            return false;
          }
          break;
        }
      }
      current += 1;
    }
    return true;
  };
  switch (mode) {
    case 'date':
    case 'week': {
      return disabledDate(cellDate);
    }
    case 'month': {
      const startDate = 1;
      const endDate = generateConfig.getDate(generateConfig.getEndDate(cellDate));
      return getDisabledFromRange('date', startDate, endDate);
    }
    case 'quarter': {
      const startMonth = Math.floor(generateConfig.getMonth(cellDate) / 3) * 3;
      const endMonth = startMonth + 2;
      return getDisabledFromRange('month', startMonth, endMonth);
    }
    case 'year': {
      return getDisabledFromRange('month', 0, 11);
    }
    case 'decade': {
      const year = generateConfig.getYear(cellDate);
      const startYear = Math.floor(year / DECADE_UNIT_DIFF) * DECADE_UNIT_DIFF;
      const endYear = startYear + DECADE_UNIT_DIFF - 1;
      return getDisabledFromRange('year', startYear, endYear);
    }
  }
}
