import * as React from 'react';
import type { RangeValue, PickerMode, Locale } from '../interface';
import { getValue } from '../utils/miscUtil';
import type { GenerateConfig } from '../generate';
import { isSameDate, getQuarter } from '../utils/dateUtil';

export default function useRangeDisabled<DateType>(
  {
    picker,
    locale,
    selectedValue,
    disabledDate,
    disabled,
    generateConfig,
  }: {
    picker: PickerMode;
    selectedValue: RangeValue<DateType>;
    disabledDate?: (date: DateType) => boolean;
    disabled: [boolean, boolean];
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
  },
  disabledStart: boolean,
  disabledEnd: boolean,
) {
  const startDate = getValue(selectedValue, 0);
  const endDate = getValue(selectedValue, 1);

  function weekFirstDate(date: DateType) {
    return generateConfig.locale.getWeekFirstDate(locale.locale, date);
  }

  function monthNumber(date: DateType) {
    const year = generateConfig.getYear(date);
    const month = generateConfig.getMonth(date);
    return year * 100 + month;
  }

  function quarterNumber(date: DateType) {
    const year = generateConfig.getYear(date);
    const quarter = getQuarter(generateConfig, date);
    return year * 10 + quarter;
  }

  const disabledStartDate = React.useCallback(
    (date: DateType) => {
      if (disabledDate && disabledDate(date)) {
        return true;
      }

      // Disabled range
      if (disabled[1] && endDate) {
        return !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(date, endDate);
      }

      // Disabled part
      if (disabledStart && endDate) {
        switch (picker) {
          case 'quarter':
            return quarterNumber(date) > quarterNumber(endDate);
          case 'month':
            return monthNumber(date) > monthNumber(endDate);
          case 'week':
            return weekFirstDate(date) > weekFirstDate(endDate);
          default:
            return (
              !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(date, endDate)
            );
        }
      }

      return false;
    },
    [disabledDate, disabled[1], endDate, disabledStart],
  );

  const disabledEndDate = React.useCallback(
    (date: DateType) => {
      if (disabledDate && disabledDate(date)) {
        return true;
      }

      // Disabled range
      if (disabled[0] && startDate) {
        return (
          !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(startDate, date)
        );
      }

      // Disabled part
      if (disabledEnd && startDate) {
        switch (picker) {
          case 'quarter':
            return quarterNumber(date) < quarterNumber(startDate);
          case 'month':
            return monthNumber(date) < monthNumber(startDate);
          case 'week':
            return weekFirstDate(date) < weekFirstDate(startDate);
          default:
            return (
              !isSameDate(generateConfig, date, startDate) &&
              generateConfig.isAfter(startDate, date)
            );
        }
      }

      return false;
    },
    [disabledDate, disabled[0], startDate, disabledEnd],
  );

  return [disabledStartDate, disabledEndDate];
}
