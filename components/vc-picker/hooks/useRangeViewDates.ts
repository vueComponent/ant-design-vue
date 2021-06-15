import * as React from 'react';
import type { RangeValue, PickerMode } from '../interface';
import type { GenerateConfig } from '../generate';
import { getValue, updateValues } from '../utils/miscUtil';
import { getClosingViewDate, isSameYear, isSameMonth, isSameDecade } from '../utils/dateUtil';

function getStartEndDistance<DateType>(
  startDate: DateType,
  endDate: DateType,
  picker: PickerMode,
  generateConfig: GenerateConfig<DateType>,
): 'same' | 'closing' | 'far' {
  const startNext = getClosingViewDate(startDate, picker, generateConfig, 1);

  function getDistance(compareFunc: (start: DateType | null, end: DateType | null) => boolean) {
    if (compareFunc(startDate, endDate)) {
      return 'same';
    }
    if (compareFunc(startNext, endDate)) {
      return 'closing';
    }
    return 'far';
  }

  switch (picker) {
    case 'year':
      return getDistance((start, end) => isSameDecade(generateConfig, start, end));
    case 'quarter':
    case 'month':
      return getDistance((start, end) => isSameYear(generateConfig, start, end));
    default:
      return getDistance((start, end) => isSameMonth(generateConfig, start, end));
  }
}

function getRangeViewDate<DateType>(
  values: RangeValue<DateType>,
  index: 0 | 1,
  picker: PickerMode,
  generateConfig: GenerateConfig<DateType>,
): DateType | null {
  const startDate = getValue(values, 0);
  const endDate = getValue(values, 1);

  if (index === 0) {
    return startDate;
  }

  if (startDate && endDate) {
    const distance = getStartEndDistance(startDate, endDate, picker, generateConfig);
    switch (distance) {
      case 'same':
        return startDate;
      case 'closing':
        return startDate;
      default:
        return getClosingViewDate(endDate, picker, generateConfig, -1);
    }
  }

  return startDate;
}

export default function useRangeViewDates<DateType>({
  values,
  picker,
  defaultDates,
  generateConfig,
}: {
  values: RangeValue<DateType>;
  picker: PickerMode;
  defaultDates: RangeValue<DateType> | undefined;
  generateConfig: GenerateConfig<DateType>;
}): [(activePickerIndex: 0 | 1) => DateType, (viewDate: DateType | null, index: 0 | 1) => void] {
  const [defaultViewDates, setDefaultViewDates] = React.useState<
    [DateType | null, DateType | null]
  >(() => [getValue(defaultDates, 0), getValue(defaultDates, 1)]);
  const [viewDates, setInternalViewDates] = React.useState<RangeValue<DateType>>(null);

  const startDate = getValue(values, 0);
  const endDate = getValue(values, 1);

  function getViewDate(index: 0 | 1): DateType {
    // If set default view date, use it
    if (defaultViewDates[index]) {
      return defaultViewDates[index]!;
    }

    return (
      getValue(viewDates, index) ||
      getRangeViewDate(values, index, picker, generateConfig) ||
      startDate ||
      endDate ||
      generateConfig.getNow()
    );
  }

  function setViewDate(viewDate: DateType | null, index: 0 | 1) {
    if (viewDate) {
      let newViewDates = updateValues(viewDates, viewDate, index);
      // Set view date will clean up default one
      setDefaultViewDates(
        // Should always be an array
        updateValues(defaultViewDates, null, index) || [null, null],
      );

      // Reset another one when not have value
      const anotherIndex = (index + 1) % 2;
      if (!getValue(values, anotherIndex)) {
        newViewDates = updateValues(newViewDates, viewDate, anotherIndex);
      }

      setInternalViewDates(newViewDates);
    } else if (startDate || endDate) {
      // Reset all when has values when `viewDate` is `null` which means from open trigger
      setInternalViewDates(null);
    }
  }

  return [getViewDate, setViewDate];
}
