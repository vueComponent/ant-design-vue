import PropTypes from '../../_util/vue-types';
import get from 'lodash/get';
import { isValidElement, mergeProps } from '../../_util/props-util';
import Tooltip from '../../tooltip';

function isInvalidRenderCellText(text) {
  return (
    text && !isValidElement(text) && Object.prototype.toString.call(text) === '[object Object]'
  );
}

export default {
  name: 'TableCell',
  props: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    column: PropTypes.object,
    expandIcon: PropTypes.any,
    component: PropTypes.any,
  },
  data() {
    return {
      tooltipContent: '',
      notShowTooltip: false,
      tooltipVisible: false,
    };
  },
  mounted() {
    if (this.column.showOverflowTooltip) {
      let cell = this.$el;
      let cellWidth = cell.getBoundingClientRect().width;

      // get real text width
      let textWrapper = document.createElement('span');
      textWrapper.innerText = this.tooltipContent;
      document.body.appendChild(textWrapper);
      let range = document.createRange();
      range.setStart(textWrapper, 0);
      range.setEnd(textWrapper, 1);
      const textWidth = range.getBoundingClientRect().width;
      document.body.removeChild(textWrapper);

      if (cellWidth > textWidth) {
        this.notShowTooltip = true;
      }
    }
  },
  methods: {
    handleClick(e) {
      const {
        record,
        column: { onCellClick },
      } = this;
      if (onCellClick) {
        onCellClick(record, e);
      }
    },
    handleVisibilityChange(visible) {
      this.tooltipVisible = this.notShowTooltip ? false : visible;
    },
    getRawText(record, dataIndex) {
      let text;
      if (typeof dataIndex === 'number') {
        text = get(record, dataIndex);
      } else if (!dataIndex || dataIndex.length === 0) {
        text = record;
      } else {
        text = get(record, dataIndex);
      }
      return text;
    },
  },

  render() {
    const {
      record,
      indentSize,
      prefixCls,
      indent,
      index,
      expandIcon,
      column,
      component: BodyCell,
    } = this;
    const { dataIndex, customRender, className = '' } = column;
    const cls = className || column.class;
    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.
    let text = this.getRawText(record, dataIndex);
    this.tooltipContent = text;

    let tdProps = {
      props: {},
      attrs: {},
      class: cls,
      on: {
        click: this.handleClick,
      },
    };
    let colSpan;
    let rowSpan;

    if (customRender) {
      text = customRender(text, record, index);
      if (isInvalidRenderCellText(text)) {
        tdProps.attrs = text.attrs || {};
        tdProps.props = text.props || {};
        colSpan = tdProps.attrs.colSpan;
        rowSpan = tdProps.attrs.rowSpan;
        text = text.children;
      }
    }

    if (column.customCell) {
      tdProps = mergeProps(tdProps, column.customCell(record, index));
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (isInvalidRenderCellText(text)) {
      text = null;
    }

    const indentText = expandIcon ? (
      <span
        style={{ paddingLeft: `${indentSize * indent}px` }}
        class={`${prefixCls}-indent indent-level-${indent}`}
      />
    ) : null;

    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    if (column.align) {
      tdProps.style = { ...tdProps.style, textAlign: column.align };
    }

    const cellContent = [
      indentText,
      expandIcon,
      text,
    ];

    return column.showOverflowTooltip ? (
      <BodyCell {...tdProps} class="has-tooltip" style={{maxWidth: 0}}>
        <Tooltip
          onVisibleChange={this.handleVisibilityChange}
          visible={this.tooltipVisible}
          title={this.tooltipContent}>
          <div>{cellContent}</div>
        </Tooltip>
      </BodyCell>
    ) : (
      <BodyCell {...tdProps}>
        {cellContent}
      </BodyCell>
    );
  },
};
