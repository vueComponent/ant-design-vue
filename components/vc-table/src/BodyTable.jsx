import PropTypes from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default {
  name: 'BodyTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScroll: PropTypes.func.isRequired,
    handleWheel: PropTypes.func.isRequired,
    getRowKey: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
    isAnyColumnsFixed: PropTypes.bool,
  },
  inject: {
    table: { default: () => ({}) },
  },
  render() {
    const { prefixCls, scroll } = this.table;
    const {
      columns,
      fixed,
      tableClassName,
      getRowKey,
      handleBodyScroll,
      handleWheel,
      expander,
      isAnyColumnsFixed,
    } = this;
    let { useFixedHeader, saveRef } = this.table;
    const bodyStyle = { ...this.table.bodyStyle };
    const innerBodyStyle = {};

    if (scroll.x || fixed) {
      bodyStyle.overflowX = bodyStyle.overflowX || 'scroll';
      // Fix weired webkit render bug
      // https://github.com/ant-design/ant-design/issues/7783
      bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';
    }

    if (scroll.y) {
      // maxHeight will make fixed-Table scrolling not working
      // so we only set maxHeight to body-Table here
      let maxHeight = bodyStyle.maxHeight || scroll.y;
      maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
      if (fixed) {
        innerBodyStyle.maxHeight = maxHeight;
        innerBodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      } else {
        bodyStyle.maxHeight = maxHeight;
      }
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;

      // Add negative margin bottom for scroll bar overflow bug
      const scrollbarWidth = measureScrollbar({ direction: 'vertical' });
      if (scrollbarWidth > 0 && fixed) {
        bodyStyle.marginBottom = `-${scrollbarWidth}px`;
        bodyStyle.paddingBottom = '0px';
      }
    }

    const baseTable = (
      <BaseTable
        tableClassName={tableClassName}
        hasHead={!useFixedHeader}
        hasBody
        fixed={fixed}
        columns={columns}
        expander={expander}
        getRowKey={getRowKey}
        isAnyColumnsFixed={isAnyColumnsFixed}
      />
    );

    if (fixed && columns.length) {
      let refName;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      delete bodyStyle.overflowX;
      delete bodyStyle.overflowY;
      return (
        <div key="bodyTable" class={`${prefixCls}-body-outer`} style={{ ...bodyStyle }}>
          <div
            class={`${prefixCls}-body-inner`}
            style={innerBodyStyle}
            {...{
              directives: [
                {
                  name: 'ant-ref',
                  value: saveRef(refName),
                },
              ],
            }}
            onWheel={handleWheel}
            onScroll={handleBodyScroll}
          >
            {baseTable}
          </div>
        </div>
      );
    }
    // Should provides `tabIndex` if use scroll to enable keyboard scroll
    const useTabIndex = scroll && (scroll.x || scroll.y);

    return (
      <div
        tabIndex={useTabIndex ? -1 : undefined}
        key="bodyTable"
        class={`${prefixCls}-body`}
        style={bodyStyle}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: saveRef('bodyTable'),
            },
          ],
        }}
        onWheel={handleWheel}
        onScroll={handleBodyScroll}
      >
        {baseTable}
      </div>
    );
  },
};
