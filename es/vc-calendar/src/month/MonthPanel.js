
import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { hasProp } from '../../../_util/props-util';
import MonthTable from './MonthTable';

function goYear(direction) {
  var next = this.sValue.clone();
  next.add(direction, 'year');
  this.setAndChangeValue(next);
}

function noop() {}

var MonthPanel = {
  mixins: [BaseMixin],
  props: {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    cellRender: PropTypes.any,
    contentRender: PropTypes.any,
    locale: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    // onChange: PropTypes.func,
    disabledDate: PropTypes.func
    // onSelect: PropTypes.func,
  },

  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue;
    // bind methods

    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {
      sValue: value || defaultValue
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    }
  },
  methods: {
    setAndChangeValue: function setAndChangeValue(value) {
      this.setValue(value);
      this.__emit('change', value);
    },
    setAndSelectValue: function setAndSelectValue(value) {
      this.setValue(value);
      this.__emit('select', value);
    },
    setValue: function setValue(value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var sValue = this.sValue,
        cellRender = this.cellRender,
        contentRender = this.contentRender,
        locale = this.locale,
        rootPrefixCls = this.rootPrefixCls,
        disabledDate = this.disabledDate,
        _$listeners = this.$listeners,
        $listeners = _$listeners === undefined ? {} : _$listeners;

    var year = sValue.year();
    var prefixCls = rootPrefixCls + '-month-panel';
    return h(
      'div',
      { 'class': prefixCls },
      [h('div', [h(
        'div',
        { 'class': prefixCls + '-header' },
        [h('a', {
          'class': prefixCls + '-prev-year-btn',
          attrs: { role: 'button',

            title: locale.previousYear
          },
          on: {
            'click': this.previousYear
          }
        }), h(
          'a',
          {
            'class': prefixCls + '-year-select',
            attrs: { role: 'button',

              title: locale.yearSelect
            },
            on: {
              'click': $listeners.yearPanelShow || noop
            }
          },
          [h(
            'span',
            { 'class': prefixCls + '-year-select-content' },
            [year]
          ), h(
            'span',
            { 'class': prefixCls + '-year-select-arrow' },
            ['x']
          )]
        ), h('a', {
          'class': prefixCls + '-next-year-btn',
          attrs: { role: 'button',

            title: locale.nextYear
          },
          on: {
            'click': this.nextYear
          }
        })]
      ), h(
        'div',
        { 'class': prefixCls + '-body' },
        [h(MonthTable, {
          attrs: {
            disabledDate: disabledDate,

            locale: locale,
            value: sValue,
            cellRender: cellRender,
            contentRender: contentRender,
            prefixCls: prefixCls
          },
          on: {
            'select': this.setAndSelectValue
          }
        })]
      )])]
    );
  }
};

export default MonthPanel;