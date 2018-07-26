'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _locale = require('../modal/locale');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export interface Locale {
//   locale: string;
//   Pagination?: Object;
//   DatePicker?: Object;
//   TimePicker?: Object;
//   Calendar?: Object;
//   Table?: Object;
//   Modal?: ModalLocale;
//   Popconfirm?: Object;
//   Transfer?: Object;
//   Select?: Object;
//   Upload?: Object;
// }

function setMomentLocale(locale) {
  if (locale && locale.locale) {
    (0, _interopDefault2['default'])(moment).locale(locale.locale);
  } else {
    (0, _interopDefault2['default'])(moment).locale('en');
  }
}

exports['default'] = {
  name: 'ALocaleProvider',
  props: {
    locale: _vueTypes2['default'].object.def({})
  },
  data: function data() {
    return {
      antLocale: (0, _extends3['default'])({}, this.locale, {
        exist: true
      })
    };
  },
  provide: function provide() {
    return {
      localeData: this.$data
    };
  },

  watch: {
    locale: function locale(val) {
      this.antLocale = (0, _extends3['default'])({}, this.locale, {
        exist: true
      });
      setMomentLocale(val);
    }
  },
  beforeMount: function beforeMount() {
    var locale = this.locale;

    setMomentLocale(locale);
    (0, _locale.changeConfirmLocale)(locale && locale.Modal);
  },
  updated: function updated() {
    var locale = this.locale;

    (0, _locale.changeConfirmLocale)(locale && locale.Modal);
  },
  beforeDestroy: function beforeDestroy() {
    (0, _locale.changeConfirmLocale)();
  },
  render: function render() {
    return this.$slots['default'][0];
  }
};
module.exports = exports['default'];