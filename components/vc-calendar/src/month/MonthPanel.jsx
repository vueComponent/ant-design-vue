import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { hasProp } from '../../../_util/props-util';
import MonthTable from './MonthTable';

function goYear(direction) {
  const next = this.sValue.clone();
  next.add(direction, 'year');
  this.setAndChangeValue(next);
}

function noop() {}

const MonthPanel = {
  mixins: [BaseMixin],
  props: {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    cellRender: PropTypes.any,
    contentRender: PropTypes.any,
    locale: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    // onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    // onSelect: PropTypes.func,
    renderFooter: PropTypes.func,
  },

  data() {
    const { value, defaultValue } = this;
    // bind methods
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {
      sValue: value || defaultValue,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
  },
  methods: {
    setAndChangeValue(value) {
      this.setValue(value);
      this.__emit('change', value);
    },

    setAndSelectValue(value) {
      this.setValue(value);
      this.__emit('select', value);
    },

    setValue(value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        });
      }
    },
  },

  render() {
    const {
      sValue,
      cellRender,
      contentRender,
      locale,
      rootPrefixCls,
      disabledDate,
      renderFooter,
      $listeners = {},
    } = this;
    const year = sValue.year();
    const prefixCls = `${rootPrefixCls}-month-panel`;

    const footer = renderFooter && renderFooter('month');
    return (
      <div class={prefixCls}>
        <div>
          <div class={`${prefixCls}-header`}>
            <a
              class={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={this.previousYear}
              title={locale.previousYear}
            />

            <a
              class={`${prefixCls}-year-select`}
              role="button"
              onClick={$listeners.yearPanelShow || noop}
              title={locale.yearSelect}
            >
              <span class={`${prefixCls}-year-select-content`}>{year}</span>
              <span class={`${prefixCls}-year-select-arrow`}>x</span>
            </a>

            <a
              class={`${prefixCls}-next-year-btn`}
              role="button"
              onClick={this.nextYear}
              title={locale.nextYear}
            />
          </div>
          <div class={`${prefixCls}-body`}>
            <MonthTable
              disabledDate={disabledDate}
              onSelect={this.setAndSelectValue}
              locale={locale}
              value={sValue}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
            />
          </div>
          {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        </div>
      </div>
    );
  },
};

export default MonthPanel;
