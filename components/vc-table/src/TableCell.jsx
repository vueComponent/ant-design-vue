import PropTypes from '../../_util/vue-types';
import get from 'lodash/get';
import classNames from 'classnames';
import { isValidElement, mergeProps } from '../../_util/props-util';

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
    colIndex: PropTypes.number,
  },
  inject: {
    table: { default: () => ({}) },
    store: { from: 'table-store', default: () => ({}) },
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
    const fixedInfoList = this.store.fixedInfoList || [];
    const fixedInfo = fixedInfoList[this.colIndex];
    const { fixLeft, fixRight, firstFixLeft, lastFixLeft, firstFixRight, lastFixRight } = fixedInfo;
    // ====================== Fixed =======================
    const fixedStyle = {};
    const isFixLeft = typeof fixLeft === 'number';
    const isFixRight = typeof fixRight === 'number';

    if (isFixLeft) {
      fixedStyle.position = 'sticky';
      fixedStyle.left = `${fixLeft}px`;
    }
    if (isFixRight) {
      fixedStyle.position = 'sticky';
      fixedStyle.right = `${fixRight}px`;
    }
    const { dataIndex, customRender, className = '' } = column;
    const { transformCellText, prefixCls: rootPrefixCls } = this.table;
    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.
    let text;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps = {
      props: {},
      attrs: {},
      on: {
        click: this.handleClick,
      },
    };
    let colSpan;
    let rowSpan;

    if (customRender) {
      text = customRender(text, record, index, column);
      if (isInvalidRenderCellText(text)) {
        tdProps.attrs = text.attrs || {};
        tdProps.props = text.props || {};
        tdProps.class = text.class;
        tdProps.style = text.style;
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

    if (transformCellText) {
      text = transformCellText({ text, column, record, index });
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
      tdProps.style = { textAlign: column.align, ...tdProps.style };
    }

    const cellClassName = classNames(className, column.class, {
      [`${prefixCls}-cell-ellipsis`]: !!column.ellipsis,
      // 如果有宽度，增加断行处理
      // https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241
      [`${prefixCls}-cell-break-word`]: !!column.width,
      [`${rootPrefixCls}-cell-fix-left`]: isFixLeft,
      [`${rootPrefixCls}-cell-fix-left-first`]: firstFixLeft,
      [`${rootPrefixCls}-cell-fix-left-last`]: lastFixLeft,
      [`${rootPrefixCls}-cell-fix-right`]: isFixRight,
      [`${rootPrefixCls}-cell-fix-right-first`]: firstFixRight,
      [`${rootPrefixCls}-cell-fix-right-last`]: lastFixRight,
    });

    if (column.ellipsis) {
      if (typeof text === 'string') {
        tdProps.attrs.title = text;
      } else if (text) {
        // const { props: textProps } = text;
        // if (textProps && textProps.children && typeof textProps.children === 'string') {
        //   tdProps.attrs.title = textProps.children;
        // }
      }
    }

    return (
      <BodyCell
        class={cellClassName}
        {...tdProps}
        {...{ style: { ...(tdProps.style || {}), ...fixedStyle } }}
      >
        {indentText}
        {expandIcon}
        {text}
      </BodyCell>
    );
  },
};
