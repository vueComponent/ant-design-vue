import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
const ROW = 4;
const COL = 3;
function noop() {}
function goYear(direction) {
  const next = this.sValue.clone();
  next.add(direction, 'years');
  this.setState({
    sValue: next,
  });
}

function chooseDecade(year, event) {
  const next = this.sValue.clone();
  next.year(year);
  next.month(this.sValue.month());
  this.__emit('select', next);
  event.preventDefault();
}

export default {
  mixins: [BaseMixin],
  props: {
    locale: PropTypes.object,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    renderFooter: PropTypes.func,
  },
  data() {
    this.nextCentury = goYear.bind(this, 100);
    this.previousCentury = goYear.bind(this, -100);
    return {
      sValue: this.value || this.defaultValue,
    };
  },

  render() {
    const value = this.sValue;
    const { locale, renderFooter } = this.$props;
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 100, 10) * 100;
    const preYear = startYear - 10;
    const endYear = startYear + 99;
    const decades = [];
    let index = 0;
    const prefixCls = `${this.rootPrefixCls}-decade-panel`;

    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      decades[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const startDecade = preYear + index * 10;
        const endDecade = preYear + index * 10 + 9;
        decades[rowIndex][colIndex] = {
          startDecade,
          endDecade,
        };
        index++;
      }
    }

    const footer = renderFooter && renderFooter('decade');
    const decadesEls = decades.map((row, decadeIndex) => {
      const tds = row.map(decadeData => {
        const dStartDecade = decadeData.startDecade;
        const dEndDecade = decadeData.endDecade;
        const isLast = dStartDecade < startYear;
        const isNext = dEndDecade > endYear;
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-selected-cell`]: dStartDecade <= currentYear && currentYear <= dEndDecade,
          [`${prefixCls}-last-century-cell`]: isLast,
          [`${prefixCls}-next-century-cell`]: isNext,
        };
        const content = `${dStartDecade}-${dEndDecade}`;
        let clickHandler = noop;
        if (isLast) {
          clickHandler = this.previousCentury;
        } else if (isNext) {
          clickHandler = this.nextCentury;
        } else {
          clickHandler = chooseDecade.bind(this, dStartDecade);
        }
        return (
          <td key={dStartDecade} onClick={clickHandler} role="gridcell" class={classNameMap}>
            <a class={`${prefixCls}-decade`}>{content}</a>
          </td>
        );
      });
      return (
        <tr key={decadeIndex} role="row">
          {tds}
        </tr>
      );
    });

    return (
      <div class={prefixCls}>
        <div class={`${prefixCls}-header`}>
          <a
            class={`${prefixCls}-prev-century-btn`}
            role="button"
            onClick={this.previousCentury}
            title={locale.previousCentury}
          />

          <div class={`${prefixCls}-century`}>
            {startYear}-{endYear}
          </div>
          <a
            class={`${prefixCls}-next-century-btn`}
            role="button"
            onClick={this.nextCentury}
            title={locale.nextCentury}
          />
        </div>
        <div class={`${prefixCls}-body`}>
          <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
            <tbody class={`${prefixCls}-tbody`}>{decadesEls}</tbody>
          </table>
        </div>
        {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
      </div>
    );
  },
};
