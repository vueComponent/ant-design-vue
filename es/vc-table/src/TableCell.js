import PropTypes from '../../_util/vue-types';
import get from 'lodash/get';
import { isValidElement, mergeProps } from '../../_util/props-util';

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
    component: PropTypes.any
  },
  methods: {
    isInvalidRenderCellText: function isInvalidRenderCellText(text) {
      // debugger
      return text && !isValidElement(text) && Object.prototype.toString.call(text) === '[object Object]';
    },
    handleClick: function handleClick(e) {
      var record = this.record,
          onCellClick = this.column.onCellClick;

      if (onCellClick) {
        onCellClick(record, e);
      }
    }
  },

  render: function render(h) {
    var record = this.record,
        indentSize = this.indentSize,
        prefixCls = this.prefixCls,
        indent = this.indent,
        index = this.index,
        expandIcon = this.expandIcon,
        column = this.column,
        BodyCell = this.component;
    var dataIndex = column.dataIndex,
        customRender = column.customRender,
        _column$className = column.className,
        className = _column$className === undefined ? '' : _column$className;

    var cls = className || column['class'];
    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.
    var text = void 0;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    var tdProps = {
      props: {},
      attrs: {},
      'class': cls,
      on: {
        click: this.handleClick
      }
    };
    var colSpan = void 0;
    var rowSpan = void 0;

    if (customRender) {
      text = customRender(text, record, index);
      if (this.isInvalidRenderCellText(text)) {
        tdProps.attrs = text.attrs || {};
        tdProps.props = text.props || {};
        colSpan = tdProps.attrs.colSpan;
        rowSpan = tdProps.attrs.rowSpan;
        text = text.children;
      }
    }

    if (column.customCell) {
      tdProps = mergeProps(tdProps, column.customCell(record));
      //      tdProps.attrs = { ...tdProps.attrs, ...column.customCell(record) }
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (this.isInvalidRenderCellText(text)) {
      text = null;
    }

    var indentText = expandIcon ? h('span', {
      style: { paddingLeft: indentSize * indent + 'px' },
      'class': prefixCls + '-indent indent-level-' + indent
    }) : null;

    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    if (column.align) {
      tdProps.style = { textAlign: column.align };
    }

    return h(
      BodyCell,
      tdProps,
      [indentText, expandIcon, text]
    );
  }
};