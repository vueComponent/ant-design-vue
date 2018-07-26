import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
var ROW = 4;
var COL = 3;
function noop() {}
function goYear(direction) {
  var value = this.sValue.clone();
  value.add(direction, 'year');
  this.setState({
    sValue: value
  });
}

function chooseYear(year) {
  var value = this.sValue.clone();
  value.year(year);
  value.month(this.sValue.month());
  this.__emit('select', value);
}

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    locale: PropTypes.object
  },
  data: function data() {
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
    return {
      sValue: this.value || this.defaultValue
    };
  },

  methods: {
    years: function years() {
      var value = this.sValue;
      var currentYear = value.year();
      var startYear = parseInt(currentYear / 10, 10) * 10;
      var previousYear = startYear - 1;
      var years = [];
      var index = 0;
      for (var rowIndex = 0; rowIndex < ROW; rowIndex++) {
        years[rowIndex] = [];
        for (var colIndex = 0; colIndex < COL; colIndex++) {
          var year = previousYear + index;
          var content = String(year);
          years[rowIndex][colIndex] = {
            content: content,
            year: year,
            title: content
          };
          index++;
        }
      }
      return years;
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];
    var value = this.sValue,
        locale = this.locale,
        _$listeners = this.$listeners,
        $listeners = _$listeners === undefined ? {} : _$listeners;

    var decadePanelShow = $listeners.decadePanelShow || noop;
    var years = this.years();
    var currentYear = value.year();
    var startYear = parseInt(currentYear / 10, 10) * 10;
    var endYear = startYear + 9;
    var prefixCls = this.rootPrefixCls + '-year-panel';

    var yeasEls = years.map(function (row, index) {
      var tds = row.map(function (yearData) {
        var _classNameMap;

        var classNameMap = (_classNameMap = {}, _defineProperty(_classNameMap, prefixCls + '-cell', 1), _defineProperty(_classNameMap, prefixCls + '-selected-cell', yearData.year === currentYear), _defineProperty(_classNameMap, prefixCls + '-last-decade-cell', yearData.year < startYear), _defineProperty(_classNameMap, prefixCls + '-next-decade-cell', yearData.year > endYear), _classNameMap);
        var clickHandler = noop;
        if (yearData.year < startYear) {
          clickHandler = _this.previousDecade;
        } else if (yearData.year > endYear) {
          clickHandler = _this.nextDecade;
        } else {
          clickHandler = chooseYear.bind(_this, yearData.year);
        }
        return h(
          'td',
          {
            attrs: {
              role: 'gridcell',
              title: yearData.title
            },
            key: yearData.content,
            on: {
              'click': clickHandler
            },

            'class': classNameMap
          },
          [h(
            'a',
            {
              'class': prefixCls + '-year'
            },
            [yearData.content]
          )]
        );
      });
      return h(
        'tr',
        { key: index, attrs: { role: 'row' }
        },
        [tds]
      );
    });

    return h(
      'div',
      { 'class': prefixCls },
      [h('div', [h(
        'div',
        { 'class': prefixCls + '-header' },
        [h('a', {
          'class': prefixCls + '-prev-decade-btn',
          attrs: { role: 'button',

            title: locale.previousDecade
          },
          on: {
            'click': this.previousDecade
          }
        }), h(
          'a',
          {
            'class': prefixCls + '-decade-select',
            attrs: { role: 'button',

              title: locale.decadeSelect
            },
            on: {
              'click': decadePanelShow
            }
          },
          [h(
            'span',
            { 'class': prefixCls + '-decade-select-content' },
            [startYear, '-', endYear]
          ), h(
            'span',
            { 'class': prefixCls + '-decade-select-arrow' },
            ['x']
          )]
        ), h('a', {
          'class': prefixCls + '-next-decade-btn',
          attrs: { role: 'button',

            title: locale.nextDecade
          },
          on: {
            'click': this.nextDecade
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
            [yeasEls]
          )]
        )]
      )])]
    );
  }
};