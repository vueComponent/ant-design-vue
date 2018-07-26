import _extends from 'babel-runtime/helpers/extends';
import moment from 'moment';

var defaultDisabledTime = {
  disabledHours: function disabledHours() {
    return [];
  },
  disabledMinutes: function disabledMinutes() {
    return [];
  },
  disabledSeconds: function disabledSeconds() {
    return [];
  }
};

export function getTodayTime(value) {
  var today = moment();
  today.locale(value.locale()).utcOffset(value.utcOffset());
  return today;
}

export function getTitleString(value) {
  return value.format('LL');
}

export function getTodayTimeStr(value) {
  var today = getTodayTime(value);
  return getTitleString(today);
}

export function getMonthName(month) {
  var locale = month.locale();
  var localeData = month.localeData();
  return localeData[locale === 'zh-cn' ? 'months' : 'monthsShort'](month);
}

export function syncTime(from, to) {
  if (!moment.isMoment(from) || !moment.isMoment(to)) return;
  to.hour(from.hour());
  to.minute(from.minute());
  to.second(from.second());
}

export function getTimeConfig(value, disabledTime) {
  var disabledTimeConfig = disabledTime ? disabledTime(value) : {};
  disabledTimeConfig = _extends({}, defaultDisabledTime, disabledTimeConfig);
  return disabledTimeConfig;
}

export function isTimeValidByConfig(value, disabledTimeConfig) {
  var invalidTime = false;
  if (value) {
    var hour = value.hour();
    var minutes = value.minute();
    var seconds = value.second();
    var disabledHours = disabledTimeConfig.disabledHours();
    if (disabledHours.indexOf(hour) === -1) {
      var disabledMinutes = disabledTimeConfig.disabledMinutes(hour);
      if (disabledMinutes.indexOf(minutes) === -1) {
        var disabledSeconds = disabledTimeConfig.disabledSeconds(hour, minutes);
        invalidTime = disabledSeconds.indexOf(seconds) !== -1;
      } else {
        invalidTime = true;
      }
    } else {
      invalidTime = true;
    }
  }
  return !invalidTime;
}

export function isTimeValid(value, disabledTime) {
  var disabledTimeConfig = getTimeConfig(value, disabledTime);
  return isTimeValidByConfig(value, disabledTimeConfig);
}

export function isAllowedDate(value, disabledDate, disabledTime) {
  if (disabledDate) {
    if (disabledDate(value)) {
      return false;
    }
  }
  if (disabledTime) {
    if (!isTimeValid(value, disabledTime)) {
      return false;
    }
  }
  return true;
}