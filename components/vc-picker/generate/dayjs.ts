import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { GenerateConfig } from '.';
import { noteOnce } from '../../vc-util/warning';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(quarterOfYear);

dayjs.extend((_o, c) => {
  // todo support Wo (ISO week)
  const proto = c.prototype;
  const oldFormat = proto.format;
  proto.format = function f(formatStr: string) {
    const str = (formatStr || '').replace('Wo', 'wo');
    return oldFormat.bind(this)(str);
  };
});

type IlocaleMapObject = Record<string, string>;
const localeMap: IlocaleMapObject = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: 'bn-bd',
  by_BY: 'be',
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: 'en-gb',
  en_US: 'en',
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: 'fr', // todo: dayjs has no fr_BE locale, use fr at present
  fr_CA: 'fr-ca',
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: 'hy-am',
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: 'ku',
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: 'nl-be',
  // nl_NL:
  // pl_PL:
  pt_BR: 'pt-br',
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  // th_TH:
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw',
};

const parseLocale = (locale: string) => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split('_')[0];
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(false, 'Not match any format. Please help to fire a issue about this.');
};

const advancedFormatRegex = /\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|k{1,2}|S/g;

function findTargetStr(val: string, index: number, segmentation: string) {
  const items = [...new Set(val.split(segmentation))];
  let idx = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    idx += item.length;
    if (idx > index) {
      return item;
    }
    idx += segmentation.length;
  }
}

const toDateWithValueFormat = (val: string | Dayjs, valueFormat: string) => {
  if (!val) return null;
  if (dayjs.isDayjs(val)) {
    return val;
  }
  const matchs = valueFormat.matchAll(advancedFormatRegex);
  let baseDate = dayjs(val, valueFormat);
  if (matchs === null) {
    return baseDate;
  }
  for (const match of matchs) {
    const origin = match[0];
    const index = match['index'];

    if (origin === 'Q') {
      const segmentation = val.slice(index - 1, index);
      const quarterStr = findTargetStr(val, index, segmentation).match(/\d+/)[0];
      baseDate = baseDate.quarter(parseInt(quarterStr));
    }

    if (origin.toLowerCase() === 'wo') {
      const segmentation = val.slice(index - 1, index);
      const weekStr = findTargetStr(val, index, segmentation).match(/\d+/)[0];
      baseDate = baseDate.week(parseInt(weekStr));
    }

    if (origin.toLowerCase() === 'ww') {
      baseDate = baseDate.week(parseInt(val.slice(index, index + origin.length)));
    }

    if (origin.toLowerCase() === 'w') {
      baseDate = baseDate.week(parseInt(val.slice(index, index + origin.length + 1)));
    }
  }

  return baseDate;
};

const generateConfig: GenerateConfig<Dayjs> = {
  // get
  getNow: () => dayjs(),
  getFixedDate: string => dayjs(string, ['YYYY-M-DD', 'YYYY-MM-DD']),
  getEndDate: date => date.endOf('month'),
  getWeekDay: date => {
    const clone = date.locale('en');
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: date => date.year(),
  getMonth: date => date.month(),
  getDate: date => date.date(),
  getHour: date => date.hour(),
  getMinute: date => date.minute(),
  getSecond: date => date.second(),

  // set
  addYear: (date, diff) => date.add(diff, 'year'),
  addMonth: (date, diff) => date.add(diff, 'month'),
  addDate: (date, diff) => date.add(diff, 'day'),
  setYear: (date, year) => date.year(year),
  setMonth: (date, month) => date.month(month),
  setDate: (date, num) => date.date(num),
  setHour: (date, hour) => date.hour(hour),
  setMinute: (date, minute) => date.minute(minute),
  setSecond: (date, second) => date.second(second),

  // Compare
  isAfter: (date1, date2) => date1.isAfter(date2),
  isValidate: date => date.isValid(),

  locale: {
    getWeekFirstDay: locale => dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => date.locale(parseLocale(locale)).weekday(0),
    getWeek: (locale, date) => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: locale => dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: locale => dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale, date, format) => date.locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes('wo') || format.includes('Wo')) {
          // parse Wo
          const year = formatText.split('-')[0];
          const weekStr = formatText.split('-')[1];
          const firstWeek = dayjs(year, 'YYYY').startOf('year').locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, 'week');
            if (nextWeek.format('Wo') === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = dayjs(formatText, format, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }

      if (!text) {
        parseNoMatchNotice();
      }
      return null;
    },
  },

  toDate: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map((val: any) => toDateWithValueFormat(val, valueFormat)) as Dayjs[];
    } else {
      return toDateWithValueFormat(value, valueFormat) as Dayjs;
    }
  },
  toString: (value, valueFormat) => {
    if (Array.isArray(value)) {
      return value.map((val: any) => (dayjs.isDayjs(val) ? val.format(valueFormat) : val));
    } else {
      return dayjs.isDayjs(value) ? value.format(valueFormat) : value;
    }
  },
};

export default generateConfig;
