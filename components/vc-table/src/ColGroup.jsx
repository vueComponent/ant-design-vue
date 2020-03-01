import PropTypes from '../../_util/vue-types';
import { INTERNAL_COL_DEFINE } from './utils';

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
      leafColumns.map(({ key, dataIndex, width, [INTERNAL_COL_DEFINE]: additionalProps }) => {
        const mergedKey = key !== undefined ? key : dataIndex;
        const w = typeof width === 'number' ? `${width}px` : width;
        return <col key={mergedKey} style={{ width: w, minWidth: w }} {...additionalProps} />;
      }),
    );
    return <colgroup>{cols}</colgroup>;
  },
};
