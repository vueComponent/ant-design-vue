import { inject } from 'vue';
import PropTypes, { withUndefined } from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';
import classNames from '../../_util/classNames';

export default {
  name: 'HeadTable',
  inheritAttrs: false,
  props: {
    fixed: withUndefined(PropTypes.oneOfType([PropTypes.string, PropTypes.looseBool])),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScrollLeft: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
  },
  setup() {
    return {
      table: inject('table', {}),
    };
  },
  render() {
    const { columns, fixed, tableClassName, handleBodyScrollLeft, expander, table } = this;
    const { prefixCls, scroll, showHeader, saveRef } = table;
    let { useFixedHeader } = table;
    const headStyle = {};

    const scrollbarWidth = measureScrollbar({ direction: 'vertical' });

    if (scroll.y) {
      useFixedHeader = true;
      // https://github.com/ant-design/ant-design/issues/17051
      const scrollbarWidthOfHeader = measureScrollbar({ direction: 'horizontal', prefixCls });
      // Add negative margin bottom for scroll bar overflow bug
      if (scrollbarWidthOfHeader > 0 && !fixed) {
        headStyle.marginBottom = `-${scrollbarWidthOfHeader}px`;
        headStyle.paddingBottom = '0px';
        // https://github.com/ant-design/ant-design/pull/19986
        headStyle.minWidth = `${scrollbarWidth}px`;
        // https://github.com/ant-design/ant-design/issues/17051
        headStyle.overflowX = 'scroll';
        headStyle.overflowY = scrollbarWidth === 0 ? 'hidden' : 'scroll';
      }
    }

    if (!useFixedHeader || !showHeader) {
      return null;
    }
    return (
      <div
        key="headTable"
        ref={fixed ? () => {} : saveRef('headTable')}
        class={classNames(`${prefixCls}-header`, {
          [`${prefixCls}-hide-scrollbar`]: scrollbarWidth > 0,
        })}
        style={headStyle}
        onScroll={handleBodyScrollLeft}
      >
        <BaseTable
          tableClassName={tableClassName}
          hasHead
          hasBody={false}
          fixed={fixed}
          columns={columns}
          expander={expander}
        />
      </div>
    );
  },
};
