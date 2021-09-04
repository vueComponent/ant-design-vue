import { inject } from 'vue';
import PropTypes from '../../_util/vue-types';
import BaseTable from './BaseTable';

export default {
  name: 'BodyTable',
  inheritAttrs: false,
  props: {
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScroll: PropTypes.func.isRequired,
    handleWheel: PropTypes.func.isRequired,
    getRowKey: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
    isAnyColumnsFixed: PropTypes.looseBool,
  },
  setup() {
    return {
      table: inject('table', {}),
    };
  },
  render() {
    const { prefixCls, scroll } = this.table;
    const {
      columns,
      tableClassName,
      getRowKey,
      handleBodyScroll,
      handleWheel,
      expander,
      isAnyColumnsFixed,
    } = this;
    let { useFixedHeader, saveRef } = this.table;
    const bodyStyle = { ...this.table.bodyStyle };

    if (scroll.y) {
      // maxHeight will make fixed-Table scrolling not working
      // so we only set maxHeight to body-Table here
      let maxHeight = bodyStyle.maxHeight || scroll.y;
      maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

      bodyStyle.maxHeight = maxHeight;
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;
    }

    if (scroll.x) {
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
      // Fix weired webkit render bug
      // https://github.com/ant-design/ant-design/issues/7783
      bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';

      if (!scroll.y) {
        bodyStyle.overflowY = 'hidden';
      }
    }

    const baseTable = (
      <BaseTable
        tableClassName={tableClassName}
        hasHead={!useFixedHeader}
        hasBody
        columns={columns}
        expander={expander}
        getRowKey={getRowKey}
        isAnyColumnsFixed={isAnyColumnsFixed}
      />
    );

    // Should provides `tabindex` if use scroll to enable keyboard scroll
    const useTabIndex = scroll && (scroll.x || scroll.y);

    return (
      <div
        tabindex={useTabIndex ? -1 : undefined}
        key="bodyTable"
        class={`${prefixCls}-body`}
        style={bodyStyle}
        ref={saveRef('bodyTable')}
        onWheel={handleWheel}
        onScroll={handleBodyScroll}
      >
        {baseTable}
      </div>
    );
  },
};
