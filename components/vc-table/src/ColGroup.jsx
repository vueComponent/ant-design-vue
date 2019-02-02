import PropTypes from '../../_util/vue-types';

export default {
  name: 'ColGroup',
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array,
  },
  inject: {
    table: { default: () => ({}) },
  },
  render() {
    const { fixed, table } = this;
    const { prefixCls, expandIconAsCell, columnManager } = table;

    let cols = [];

    if (expandIconAsCell && fixed !== 'right') {
      cols.push(<col class={`${prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col" />);
    }

    let leafColumns;

    if (fixed === 'left') {
      leafColumns = columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      leafColumns = columnManager.rightLeafColumns();
    } else {
      leafColumns = columnManager.leafColumns();
    }
    cols = cols.concat(
      leafColumns.map(c => {
        const width = typeof c.width === 'number' ? `${c.width}px` : c.width;
        return <col key={c.key || c.dataIndex} style={width ? { width, minWidth: width } : {}} />;
      }),
    );
    return <colgroup>{cols}</colgroup>;
  },
};
