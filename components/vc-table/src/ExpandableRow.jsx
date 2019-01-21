import PropTypes from '../../_util/vue-types';
import ExpandIcon from './ExpandIcon';
import BaseMixin from '../../_util/BaseMixin';
import { connect } from '../../_util/store';

const ExpandableRow = {
  mixins: [BaseMixin],
  name: 'ExpandableRow',
  props: {
    prefixCls: PropTypes.string.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    record: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    indentSize: PropTypes.number,
    needIndentSpaced: PropTypes.bool.isRequired,
    expandRowByClick: PropTypes.bool,
    expanded: PropTypes.bool.isRequired,
    expandIconAsCell: PropTypes.bool,
    expandIconColumnIndex: PropTypes.number,
    childrenColumnName: PropTypes.string,
    expandedRowRender: PropTypes.func,
    expandIcon: PropTypes.func,
    // onExpandedChange: PropTypes.func.isRequired,
    // onRowClick: PropTypes.func,
    // children: PropTypes.func.isRequired,
  },

  beforeDestroy() {
    this.handleDestroy();
  },
  methods: {
    hasExpandIcon(columnIndex) {
      const { expandRowByClick } = this;
      return (
        !this.tempExpandIconAsCell &&
        !expandRowByClick &&
        columnIndex === this.tempExpandIconColumnIndex
      );
    },

    handleExpandChange(record, event) {
      const { expanded, rowKey } = this;
      this.__emit('expandedChange', !expanded, record, event, rowKey);
    },

    handleDestroy() {
      const { rowKey, record } = this;
      this.__emit('expandedChange', false, record, null, rowKey, true);
    },

    handleRowClick(record, index, event) {
      const { expandRowByClick } = this;
      if (expandRowByClick) {
        this.handleExpandChange(record, event);
      }
      this.__emit('rowClick', record, index, event);
    },

    renderExpandIcon() {
      const { prefixCls, expanded, record, needIndentSpaced, expandIcon } = this;
      if (expandIcon) {
        return expandIcon({
          prefixCls,
          expanded,
          record,
          needIndentSpaced,
          expandable: this.expandable,
          onExpand: this.handleExpandChange,
        });
      }
      return (
        <ExpandIcon
          expandable={this.expandable}
          prefixCls={prefixCls}
          onExpand={this.handleExpandChange}
          needIndentSpaced={needIndentSpaced}
          expanded={expanded}
          record={record}
        />
      );
    },

    renderExpandIconCell(cells) {
      if (!this.tempExpandIconAsCell) {
        return;
      }
      const { prefixCls } = this;

      cells.push(
        <td class={`${prefixCls}-expand-icon-cell`} key="rc-table-expand-icon-cell">
          {this.renderExpandIcon()}
        </td>,
      );
    },
  },

  render() {
    const {
      childrenColumnName,
      expandedRowRender,
      indentSize,
      record,
      fixed,
      $scopedSlots,
      expanded,
    } = this;

    this.tempExpandIconAsCell = fixed !== 'right' ? this.expandIconAsCell : false;
    this.tempExpandIconColumnIndex = fixed !== 'right' ? this.expandIconColumnIndex : -1;
    const childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);
    const expandableRowProps = {
      props: {
        indentSize,
        expanded, // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
        hasExpandIcon: this.hasExpandIcon,
        renderExpandIcon: this.renderExpandIcon,
        renderExpandIconCell: this.renderExpandIconCell,
      },

      on: {
        rowClick: this.handleRowClick,
      },
    };

    return $scopedSlots.default && $scopedSlots.default(expandableRowProps);
  },
};

export default connect(({ expandedRowKeys }, { rowKey }) => ({
  expanded: !!~expandedRowKeys.indexOf(rowKey),
}))(ExpandableRow);
