import PropTypes from '../../_util/vue-types'
import get from 'lodash/get'
import { isValidElement, mergeProps } from '../../_util/props-util'

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
  methods: {
    isInvalidRenderCellText (text) {
      // debugger
      return text && !isValidElement(text) &&
        Object.prototype.toString.call(text) === '[object Object]'
    },

    handleClick (e) {
      const { record, column: { onCellClick }} = this
      if (onCellClick) {
        onCellClick(record, e)
      }
    },
  },

  render (h) {
    const {
      record,
      indentSize,
      prefixCls,
      indent,
      index,
      expandIcon,
      column,
      component: BodyCell,
    } = this
    const { dataIndex, customRender, className = '' } = column
    const cls = className || column.class
    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.
    let text
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex)
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record
    } else {
      text = get(record, dataIndex)
    }
    let tdProps = {
      props: {},
      attrs: {},
      class: cls,
      on: {
        click: this.handleClick,
      },
    }
    let colSpan
    let rowSpan

    if (customRender) {
      text = customRender(text, record, index)
      if (this.isInvalidRenderCellText(text)) {
        tdProps.attrs = text.attrs || {}
        tdProps.props = text.props || {}
        colSpan = tdProps.attrs.colSpan
        rowSpan = tdProps.attrs.rowSpan
        text = text.children
      }
    }

    if (column.onCell) {
      tdProps = mergeProps(tdProps, column.onCell(record))
      //      tdProps.attrs = { ...tdProps.attrs, ...column.onCell(record) }
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (this.isInvalidRenderCellText(text)) {
      text = null
    }

    const indentText = expandIcon ? (
      <span
        style={{ paddingLeft: `${indentSize * indent}px` }}
        class={`${prefixCls}-indent indent-level-${indent}`}
      />
    ) : null

    if (rowSpan === 0 || colSpan === 0) {
      return null
    }
    if (column.align) {
      tdProps.style = { textAlign: column.align }
    }

    return (
      <BodyCell
        {...tdProps}
      >
        {indentText}
        {expandIcon}
        {text}
      </BodyCell>
    )
  },
}
