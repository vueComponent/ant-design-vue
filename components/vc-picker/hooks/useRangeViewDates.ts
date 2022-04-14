import type { RangeValue, PickerMode } from '../interface';
import type { GenerateConfig } from '../generate';
import { getValue, updateValues } from '../utils/miscUtil';
import { getClosingViewDate, isSameYear, isSameMonth, isSameDecade } from '../utils/dateUtil';
import type { Ref } from 'vue';
import { watchEffect, computed, ref } from 'vue';

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
  values: Ref<RangeValue<DateType>>;
  picker: Ref<PickerMode>;
  defaultDates: RangeValue<DateType> | undefined;
  generateConfig: Ref<GenerateConfig<DateType>>;
}): [Ref<DateType>, Ref<DateType>, (viewDate: DateType | null, index: 0 | 1) => void] {
  const defaultViewDates = ref<[DateType | null, DateType | null]>([
    getValue(defaultDates, 0),
    getValue(defaultDates, 1),
  ]);
  const viewDates = ref<RangeValue<DateType>>(null);
  const startDate = computed(() => getValue(values.value, 0));
  const endDate = computed(() => getValue(values.value, 1));

  const getViewDate = (index: 0 | 1): DateType => {
    // If set default view date, use it
    if (defaultViewDates.value[index]) {
      return defaultViewDates.value[index]! as DateType;
    }

    return (
      (getValue(viewDates.value, index) as any) ||
      getRangeViewDate(values.value, index, picker.value, generateConfig.value) ||
      startDate.value ||
      endDate.value ||
      generateConfig.value.getNow()
    );
  };

  const startViewDate = ref(null);

  const endViewDate = ref(null);
  watchEffect(() => {
    startViewDate.value = getViewDate(0);
    endViewDate.value = getViewDate(1);
  });

  function setViewDate(viewDate: DateType | null, index: 0 | 1) {
    if (viewDate) {
      let newViewDates = updateValues(viewDates.value, viewDate as any, index);
      // Set view date will clean up default one
      // Should always be an array
      defaultViewDates.value = updateValues(defaultViewDates.value, null, index) || [null, null];

      // Reset another one when not have value
      const anotherIndex = (index + 1) % 2;
      if (!getValue(values.value, anotherIndex)) {
        newViewDates = updateValues(newViewDates, viewDate, anotherIndex);
      }

      viewDates.value = newViewDates;
    } else if (startDate.value || endDate.value) {
      // Reset all when has values when `viewDate` is `null` which means from open trigger
      viewDates.value = null;
    }
  }

  return [startViewDate, endViewDate, setViewDate];
}
