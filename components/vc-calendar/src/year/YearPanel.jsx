import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getListeners } from '../../../_util/props-util';
const ROW = 4;
const COL = 3;
function noop() {}
function goYear(direction) {
  const value = this.sValue.clone();
  value.add(direction, 'year');
  this.setState({
    sValue: value,
  });
}

function chooseYear(year) {
  const value = this.sValue.clone();
  value.year(year);
  value.month(this.sValue.month());
  this.sValue = value;
  this.__emit('select', value);
}

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    locale: PropTypes.object,
    renderFooter: PropTypes.func,
  },
  data() {
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
    return {
      sValue: this.value || this.defaultValue,
    };
  },
  methods: {
    years() {
      const value = this.sValue;
      const currentYear = value.year();
      const startYear = parseInt(currentYear / 10, 10) * 10;
      const previousYear = startYear - 1;
      const years = [];
      let index = 0;
      for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
        years[rowIndex] = [];
        for (let colIndex = 0; colIndex < COL; colIndex++) {
          const year = previousYear + index;
          const content = String(year);
          years[rowIndex][colIndex] = {
            content,
            year,
            title: content,
          };
          index++;
        }
      }
      return years;
    },
  },

  render() {
    const { sValue: value, locale, renderFooter } = this;
    const decadePanelShow = getListeners(this).decadePanelShow || noop;
    const years = this.years();
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const endYear = startYear + 9;
    const prefixCls = `${this.rootPrefixCls}-year-panel`;

    const yeasEls = years.map((row, index) => {
      const tds = row.map(yearData => {
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-selected-cell`]: yearData.year === currentYear,
          [`${prefixCls}-last-decade-cell`]: yearData.year < startYear,
          [`${prefixCls}-next-decade-cell`]: yearData.year > endYear,
        };
        let clickHandler = noop;
        if (yearData.year < startYear) {
          clickHandler = this.previousDecade;
        } else if (yearData.year > endYear) {
          clickHandler = this.nextDecade;
        } else {
          clickHandler = chooseYear.bind(this, yearData.year);
        }
        return (
          <td
            role="gridcell"
            title={yearData.title}
            key={yearData.content}
            onClick={clickHandler}
            class={classNameMap}
          >
            <a class={`${prefixCls}-year`}>{yearData.content}</a>
          </td>
        );
      });
      return (
        <tr key={index} role="row">
          {tds}
        </tr>
      );
    });
    const footer = renderFooter && renderFooter('year');
    return (
      <div class={prefixCls}>
        <div>
          <div class={`${prefixCls}-header`}>
            <a
              class={`${prefixCls}-prev-decade-btn`}
              role="button"
              onClick={this.previousDecade}
              title={locale.previousDecade}
            />
            <a
              class={`${prefixCls}-decade-select`}
              role="button"
              onClick={decadePanelShow}
              title={locale.decadeSelect}
            >
              <span class={`${prefixCls}-decade-select-content`}>
                {startYear}-{endYear}
              </span>
              <span class={`${prefixCls}-decade-select-arrow`}>x</span>
            </a>

            <a
              class={`${prefixCls}-next-decade-btn`}
              role="button"
              onClick={this.nextDecade}
              title={locale.nextDecade}
            />
          </div>
          <div class={`${prefixCls}-body`}>
            <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
              <tbody class={`${prefixCls}-tbody`}>{yeasEls}</tbody>
            </table>
          </div>
          {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        </div>
      </div>
    );
  },
};
