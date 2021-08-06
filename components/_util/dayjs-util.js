import interopDefault from './interopDefault';
import dayjs from 'dayjs';
import warning from './warning';
import isNil from 'lodash-es/isNil';

import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);
import badMutable from 'dayjs/plugin/badMutable';
dayjs.extend(badMutable);
import weekYear from 'dayjs/plugin/weekYear';
dayjs.extend(weekYear);
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export const TimeType = {
  validator(value) {
    return typeof value === 'string' || isNil(value) || dayjs.isDayjs(value);
  },
};

export const TimesType = {
  validator(value) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.findIndex(val => typeof val !== 'string') === -1 ||
        value.findIndex(val => !isNil(val) && !dayjs.isDayjs(val)) === -1
      );
    }
    return false;
  },
};

export const TimeOrTimesType = {
  validator(value) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.findIndex(val => typeof val !== 'string') === -1 ||
        value.findIndex(val => !isNil(val) && !dayjs.isDayjs(val)) === -1
      );
    } else {
      return typeof value === 'string' || isNil(value) || dayjs.isDayjs(value);
    }
  },
};

export function checkValidate(componentName, value, propName, valueFormat) {
  const values = Array.isArray(value) ? value : [value];
  values.forEach(val => {
    if (!val) return;
    valueFormat &&
      warning(
        interopDefault(dayjs)(val, valueFormat).isValid(),
        componentName,
        `When set \`valueFormat\`, \`${propName}\` should provides invalidate string time. `,
      );
    !valueFormat &&
      warning(
        interopDefault(dayjs).isDayjs(val) && val.isValid(),
        componentName,
        `\`${propName}\` provides invalidate dayjs time. If you want to set empty value, use \`null\` instead.`,
      );
  });
}
export const stringToDayjs = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val =>
      typeof val === 'string' && val ? interopDefault(dayjs)(val, valueFormat) : val || null,
    );
  } else {
    return typeof value === 'string' && value
      ? interopDefault(dayjs)(value, valueFormat)
      : value || null;
  }
};

export const dayjsToString = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val => (interopDefault(dayjs).isDayjs(val) ? val.format(valueFormat) : val));
  } else {
    return interopDefault(dayjs).isDayjs(value) ? value.format(valueFormat) : value;
  }
};
