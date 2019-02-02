import PropTypes from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default {
  name: 'HeadTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScrollLeft: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
  },
  inject: {
    table: { default: () => ({}) },
  },
  mounted() {
    this.updateTableRef();
  },
  updated() {
    this.updateTableRef();
  },
  methods: {
    updateTableRef() {
      this.$nextTick(() => {
        this.$refs.headTable && this.table.saveChildrenRef('headTable', this.$refs.headTable);
      });
    },
  },
  render() {
    const { columns, fixed, tableClassName, handleBodyScrollLeft, expander, table } = this;
    const { prefixCls, scroll, showHeader } = table;
    let { useFixedHeader } = table;
    const headStyle = {};

    if (scroll.y) {
      useFixedHeader = true;
      // Add negative margin bottom for scroll bar overflow bug
      const scrollbarWidth = measureScrollbar('horizontal');
      if (scrollbarWidth > 0 && !fixed) {
        headStyle.marginBottom = `-${scrollbarWidth}px`;
        headStyle.paddingBottom = '0px';
      }
    }

    if (!useFixedHeader || !showHeader) {
      return null;
    }
    return (
      <div
        key="headTable"
        ref={fixed ? null : 'headTable'}
        class={`${prefixCls}-header`}
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
