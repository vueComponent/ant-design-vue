import PropTypes, { withUndefined } from '../../_util/vue-types';
import ExpandIcon from './ExpandIcon';
import BaseMixin from '../../_util/BaseMixin';
import { getSlot } from '../../_util/props-util';
import { computed, inject } from 'vue';

const ExpandableRow = {
  mixins: [BaseMixin],
  name: 'ExpandableRow',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fixed: withUndefined(PropTypes.oneOfType([PropTypes.string, PropTypes.looseBool])),
    record: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    indentSize: PropTypes.number,
    needIndentSpaced: PropTypes.looseBool.isRequired,
    expandRowByClick: PropTypes.looseBool,
    expandIconAsCell: PropTypes.looseBool,
    expandIconColumnIndex: PropTypes.number,
    childrenColumnName: PropTypes.string,
    expandedRowRender: PropTypes.func,
    expandIcon: PropTypes.func,
    // onExpandedChange: PropTypes.func.isRequired,
    // onRowClick: PropTypes.func,
    // children: PropTypes.func.isRequired,
  },
  setup(props) {
    const store = inject('table-store', () => ({}));
    return {
      expanded: computed(() => store.expandedRowKeys.includes(props.rowKey)),
    };
  },

  beforeUnmount() {
    this.handleDestroy();
  },
  methods: {
    hasExpandIcon(columnIndex) {
      const { expandRowByClick, expandIcon } = this.$props;

      if (this.tempExpandIconAsCell || columnIndex !== this.tempExpandIconColumnIndex) {
        return false;
      }

      return !!expandIcon || !expandRowByClick;
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
    const { childrenColumnName, expandedRowRender, indentSize, record, fixed, expanded } = this;

    this.tempExpandIconAsCell = fixed !== 'right' ? this.expandIconAsCell : false;
    this.tempExpandIconColumnIndex = fixed !== 'right' ? this.expandIconColumnIndex : -1;
    const childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);
    const expandableRowProps = {
      indentSize,
      expanded, // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
      hasExpandIcon: this.hasExpandIcon,
      renderExpandIcon: this.renderExpandIcon,
      renderExpandIconCell: this.renderExpandIconCell,
      onRowClick: this.handleRowClick,
    };

    return getSlot(this, 'default', expandableRowProps);
  },
};

export default ExpandableRow;
