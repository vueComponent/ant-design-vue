// MIT License from https://github.com/kaimallea/isMobile

const applePhone = /iPhone/i;
const appleIpod = /iPod/i;
const appleTablet = /iPad/i;
const androidPhone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
const androidTablet = /Android/i;
const amazonPhone = /\bAndroid(?:.+)SD4930UR\b/i;
const amazonTablet = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i;
const windowsPhone = /Windows Phone/i;
const windowsTablet = /\bWindows(?:.+)ARM\b/i; // Match 'Windows' AND 'ARM'
const otherBlackberry = /BlackBerry/i;
const otherBlackberry10 = /BB10/i;
const otherOpera = /Opera Mini/i;
const otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
const otherFirefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

function match(regex, userAgent) {
  return regex.test(userAgent);
}

function isMobile(userAgent) {
  let ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  // Facebook mobile app's integrated browser adds a bunch of strings that
  // match everything. Strip it out if it exists.
  let tmp = ua.split('[FBAN');
  if (typeof tmp[1] !== 'undefined') {
    [ua] = tmp;
  }

  // Twitter mobile app's integrated browser on iPad adds a "Twitter for
  // iPhone" string. Same probably happens on other tablet platforms.
  // This will confuse detection so strip it out if it exists.
  tmp = ua.split('Twitter');
  if (typeof tmp[1] !== 'undefined') {
    [ua] = tmp;
  }

  const result = {
    apple: {
      phone: match(applePhone, ua) && !match(windowsPhone, ua),
      ipod: match(appleIpod, ua),
      tablet: !match(applePhone, ua) && match(appleTablet, ua) && !match(windowsPhone, ua),
      device:
        (match(applePhone, ua) || match(appleIpod, ua) || match(appleTablet, ua)) &&
        !match(windowsPhone, ua),
    },
    amazon: {
      phone: match(amazonPhone, ua),
      tablet: !match(amazonPhone, ua) && match(amazonTablet, ua),
      device: match(amazonPhone, ua) || match(amazonTablet, ua),
    },
    android: {
      phone:
        (!match(windowsPhone, ua) && match(amazonPhone, ua)) ||
        (!match(windowsPhone, ua) && match(androidPhone, ua)),
      tablet:
        !match(windowsPhone, ua) &&
        !match(amazonPhone, ua) &&
        !match(androidPhone, ua) &&
        (match(amazonTablet, ua) || match(androidTablet, ua)),
      device:
        (!match(windowsPhone, ua) &&
          (match(amazonPhone, ua) ||
            match(amazonTablet, ua) ||
            match(androidPhone, ua) ||
            match(androidTablet, ua))) ||
        match(/\bokhttp\b/i, ua),
    },
    windows: {
      phone: match(windowsPhone, ua),
      tablet: match(windowsTablet, ua),
      device: match(windowsPhone, ua) || match(windowsTablet, ua),
    },
    other: {
      blackberry: match(otherBlackberry, ua),
      blackberry10: match(otherBlackberry10, ua),
      opera: match(otherOpera, ua),
      firefox: match(otherFirefox, ua),
      chrome: match(otherChrome, ua),
      device:
        match(otherBlackberry, ua) ||
        match(otherBlackberry10, ua) ||
        match(otherOpera, ua) ||
        match(otherFirefox, ua) ||
        match(otherChrome, ua),
    },

    // Additional
    any: null,
    phone: null,
    tablet: null,
  };
  result.any =
    result.apple.device || result.android.device || result.windows.device || result.other.device;

  // excludes 'other' devices and ipods, targeting touchscreen phones
  result.phone = result.apple.phone || result.android.phone || result.windows.phone;
  result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;

  return result;
}

const defaultResult = {
  ...isMobile(),
  isMobile,
};

export default defaultResult;
