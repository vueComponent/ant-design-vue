import * as moment from 'moment';
import padStart from 'lodash/padStart';

import interopDefault from '../_util/interopDefault';

// Countdown
const timeUnits = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

function formatTimeStr(duration, format) {
  let leftDuration = duration;

  return timeUnits.reduce((current, [name, unit]) => {
    if (current.indexOf(name) !== -1) {
      const value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(`${name}+`, 'g'), match => {
        const len = match.length;
        return padStart(value.toString(), len, '0');
      });
    }
    return current;
  }, format);
}

export function formatCountdown(value, config) {
  const { format = '' } = config;
  const target = interopDefault(moment)(value).valueOf();
  const current = interopDefault(moment)().valueOf();
  const diff = Math.max(target - current, 0);
  return formatTimeStr(diff, format);
}
