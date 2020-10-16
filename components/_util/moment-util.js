import interopDefault from './interopDefault';
import moment from 'moment';
import warning from './warning';
import isNil from 'lodash-es/isNil';

export const TimeType = {
  validator(value) {
    return typeof value === 'string' || isNil(value) || moment.isMoment(value);
  },
};

export const TimesType = {
  validator(value) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.findIndex(val => typeof val !== 'string') === -1 ||
        value.findIndex(val => !isNil(val) && !moment.isMoment(val)) === -1
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
        value.findIndex(val => !isNil(val) && !moment.isMoment(val)) === -1
      );
    } else {
      return typeof value === 'string' || isNil(value) || moment.isMoment(value);
    }
  },
};

export function checkValidate(componentName, value, propName, valueFormat) {
  const values = Array.isArray(value) ? value : [value];
  values.forEach(val => {
    if (!val) return;
    valueFormat &&
      warning(
        interopDefault(moment)(val, valueFormat).isValid(),
        componentName,
        `When set \`valueFormat\`, \`${propName}\` should provides invalidate string time. `,
      );
    !valueFormat &&
      warning(
        interopDefault(moment).isMoment(val) && val.isValid(),
        componentName,
        `\`${propName}\` provides invalidate moment time. If you want to set empty value, use \`null\` instead.`,
      );
  });
}
export const stringToMoment = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val =>
      typeof val === 'string' && val ? interopDefault(moment)(val, valueFormat) : val || null,
    );
  } else {
    return typeof value === 'string' && value
      ? interopDefault(moment)(value, valueFormat)
      : value || null;
  }
};

export const momentToString = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val => (interopDefault(moment).isMoment(val) ? val.format(valueFormat) : val));
  } else {
    return interopDefault(moment).isMoment(value) ? value.format(valueFormat) : value;
  }
};
