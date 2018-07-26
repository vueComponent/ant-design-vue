'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ROW = 4;
var COL = 3;
function noop() {}
function goYear(direction) {
  var next = this.sValue.clone();
  next.add(direction, 'years');
  this.setState({
    sValue: next
  });
}

function chooseDecade(year, event) {
  var next = this.sValue.clone();
  next.year(year);
  next.month(this.sValue.month());
  this.__emit('select', next);
  event.preventDefault();
}

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: {
    locale: _vueTypes2['default'].object,
    value: _vueTypes2['default'].object,
    defaultValue: _vueTypes2['default'].object,
    rootPrefixCls: _vueTypes2['default'].string
  },
  data: function data() {
    this.nextCentury = goYear.bind(this, 100);
    this.previousCentury = goYear.bind(this, -100);
    return {
      sValue: this.value || this.defaultValue
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var value = this.sValue;
    var locale = this.locale;
    var currentYear = value.year();
    var startYear = parseInt(currentYear / 100, 10) * 100;
    var preYear = startYear - 10;
    var endYear = startYear + 99;
    var decades = [];
    var index = 0;
    var prefixCls = this.rootPrefixCls + '-decade-panel';

    for (var rowIndex = 0; rowIndex < ROW; rowIndex++) {
      decades[rowIndex] = [];
      for (var colIndex = 0; colIndex < COL; colIndex++) {
        var startDecade = preYear + index * 10;
        var endDecade = preYear + index * 10 + 9;
        decades[rowIndex][colIndex] = {
          startDecade: startDecade,
          endDecade: endDecade
        };
        index++;
      }
    }

    var decadesEls = decades.map(function (row, decadeIndex) {
      var tds = row.map(function (decadeData) {
        var _classNameMap;

        var dStartDecade = decadeData.startDecade;
        var dEndDecade = decadeData.endDecade;
        var isLast = dStartDecade < startYear;
        var isNext = dEndDecade > endYear;
        var classNameMap = (_classNameMap = {}, (0, _defineProperty3['default'])(_classNameMap, prefixCls + '-cell', 1), (0, _defineProperty3['default'])(_classNameMap, prefixCls + '-selected-cell', dStartDecade <= currentYear && currentYear <= dEndDecade), (0, _defineProperty3['default'])(_classNameMap, prefixCls + '-last-century-cell', isLast), (0, _defineProperty3['default'])(_classNameMap, prefixCls + '-next-century-cell', isNext), _classNameMap);
        var content = dStartDecade + '-' + dEndDecade;
        var clickHandler = noop;
        if (isLast) {
          clickHandler = _this.previousCentury;
        } else if (isNext) {
          clickHandler = _this.nextCentury;
        } else {
          clickHandler = chooseDecade.bind(_this, dStartDecade);
        }
        return h(
          'td',
          {
            key: dStartDecade,
            on: {
              'click': clickHandler
            },
            attrs: {
              role: 'gridcell'
            },
            'class': classNameMap
          },
          [h(
            'a',
            {
              'class': prefixCls + '-decade'
            },
            [content]
          )]
        );
      });
      return h(
        'tr',
        { key: decadeIndex, attrs: { role: 'row' }
        },
        [tds]
      );
    });

    return h(
      'div',
      { 'class': prefixCls },
      [h(
        'div',
        { 'class': prefixCls + '-header' },
        [h('a', {
          'class': prefixCls + '-prev-century-btn',
          attrs: { role: 'button',

            title: locale.previousCentury
          },
          on: {
            'click': this.previousCentury
          }
        }), h(
          'div',
          { 'class': prefixCls + '-century' },
          [startYear, '-', endYear]
        ), h('a', {
          'class': prefixCls + '-next-century-btn',
          attrs: { role: 'button',

            title: locale.nextCentury
          },
          on: {
            'click': this.nextCentury
          }
        })]
      ), h(
        'div',
        { 'class': prefixCls + '-body' },
        [h(
          'table',
          { 'class': prefixCls + '-table', attrs: { cellSpacing: '0', role: 'grid' }
          },
          [h(
            'tbody',
            { 'class': prefixCls + '-tbody' },
            [decadesEls]
          )]
        )]
      )]
    );
  }
};
module.exports = exports['default'];