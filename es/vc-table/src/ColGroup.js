import PropTypes from '../../_util/vue-types';

export default {
  name: 'ColGroup',
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array
  },
  inject: {
    table: { 'default': {} }
  },
  render: function render() {
    var h = arguments[0];
    var fixed = this.fixed,
        table = this.table;
    var prefixCls = table.prefixCls,
        expandIconAsCell = table.expandIconAsCell,
        columnManager = table.columnManager;


    var cols = [];

    if (expandIconAsCell && fixed !== 'right') {
      cols.push(h('col', {
        'class': prefixCls + '-expand-icon-col',
        key: 'rc-table-expand-icon-col'
      }));
    }

    var leafColumns = void 0;

    if (fixed === 'left') {
      leafColumns = columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      leafColumns = columnManager.rightLeafColumns();
    } else {
      leafColumns = columnManager.leafColumns();
    }
    cols = cols.concat(leafColumns.map(function (c) {
      var width = typeof c.width === 'number' ? c.width + 'px' : c.width;
      return h('col', {
        key: c.key || c.dataIndex,
        style: { width: width, minWidth: width }
      });
    }));
    return h('colgroup', [cols]);
  }
};