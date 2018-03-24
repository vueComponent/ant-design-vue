import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'mini-store'
import TableCell from './TableCell'
import { warningOnce } from './utils'

class TableRow extends React.Component {
  static propTypes = {
    onRow: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    index: PropTypes.number,
    rowKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    hasExpandIcon: PropTypes.func.isRequired,
    hovered: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    fixed: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    renderExpandIcon: PropTypes.func,
    renderExpandIconCell: PropTypes.func,
    components: PropTypes.any,
    expandedRow: PropTypes.bool,
    isAnyColumnsFixed: PropTypes.bool,
    ancestorKeys: PropTypes.array.isRequired,
  }

  static defaultProps = {
    onRow () {},
    expandIconColumnIndex: 0,
    expandRowByClick: false,
    onHover () {},
    hasExpandIcon () {},
    renderExpandIcon () {},
    renderExpandIconCell () {},
  }

  constructor (props) {
    super(props)

    this.shouldRender = props.visible
  }

  componentDidMount () {
    if (this.shouldRender) {
      this.saveRowRef()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.visible || (!this.props.visible && nextProps.visible)) {
      this.shouldRender = true
    }
  }

  shouldComponentUpdate (nextProps) {
    return !!(this.props.visible || nextProps.visible)
  }

  componentDidUpdate () {
    if (this.shouldRender && !this.rowRef) {
      this.saveRowRef()
    }
  }

  onRowClick = (event) => {
    const { record, index, onRowClick } = this.props
    if (onRowClick) {
      onRowClick(record, index, event)
    }
  }

  onRowDoubleClick = (event) => {
    const { record, index, onRowDoubleClick } = this.props
    if (onRowDoubleClick) {
      onRowDoubleClick(record, index, event)
    }
  }

  onContextMenu = (event) => {
    const { record, index, onRowContextMenu } = this.props
    if (onRowContextMenu) {
      onRowContextMenu(record, index, event)
    }
  }

  onMouseEnter = (event) => {
    const { record, index, onRowMouseEnter, onHover, rowKey } = this.props
    onHover(true, rowKey)
    if (onRowMouseEnter) {
      onRowMouseEnter(record, index, event)
    }
  }

  onMouseLeave = (event) => {
    const { record, index, onRowMouseLeave, onHover, rowKey } = this.props
    onHover(false, rowKey)
    if (onRowMouseLeave) {
      onRowMouseLeave(record, index, event)
    }
  }

  setExpanedRowHeight () {
    const { store, rowKey } = this.props
    let { expandedRowsHeight } = store.getState()
    const height = this.rowRef.getBoundingClientRect().height
    expandedRowsHeight = {
      ...expandedRowsHeight,
      [rowKey]: height,
    }
    store.setState({ expandedRowsHeight })
  }

  setRowHeight () {
    const { store, index } = this.props
    const fixedColumnsBodyRowsHeight = store.getState().fixedColumnsBodyRowsHeight.slice()
    const height = this.rowRef.getBoundingClientRect().height
    fixedColumnsBodyRowsHeight[index] = height
    store.setState({ fixedColumnsBodyRowsHeight })
  }

  getStyle () {
    const { height, visible } = this.props

    if (height && height !== this.style.height) {
      this.style = { ...this.style, height }
    }

    if (!visible && !this.style.display) {
      this.style = { ...this.style, display: 'none' }
    }

    return this.style
  }

  saveRowRef () {
    this.rowRef = ReactDOM.findDOMNode(this)

    const { isAnyColumnsFixed, fixed, expandedRow, ancestorKeys } = this.props

    if (!isAnyColumnsFixed) {
      return
    }

    if (!fixed && expandedRow) {
      this.setExpanedRowHeight()
    }

    if (!fixed && ancestorKeys.length >= 0) {
      this.setRowHeight()
    }
  }

  render () {
    if (!this.shouldRender) {
      return null
    }

    const {
      prefixCls,
      columns,
      record,
      index,
      onRow,
      indent,
      indentSize,
      hovered,
      height,
      visible,
      components,
      hasExpandIcon,
      renderExpandIcon,
      renderExpandIconCell,
    } = this.props

    const BodyRow = components.body.row
    const BodyCell = components.body.cell

    let { className } = this.props

    if (hovered) {
      className += ` ${prefixCls}-hover`
    }

    const cells = []

    renderExpandIconCell(cells)

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]

      warningOnce(
        column.onCellClick === undefined,
        'column[onCellClick] is deprecated, please use column[onCell] instead.',
      )

      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={column}
          key={column.key || column.dataIndex}
          expandIcon={hasExpandIcon(i) && renderExpandIcon()}
          component={BodyCell}
        />
      )
    }

    const rowClassName =
      `${prefixCls} ${className} ${prefixCls}-level-${indent}`.trim()

    const rowProps = onRow(record, index)
    const customStyle = rowProps ? rowProps.style : {}
    let style = { height }

    if (!visible) {
      style.display = 'none'
    }

    style = { ...style, ...customStyle }

    return (
      <BodyRow
        onClick={this.onRowClick}
        onDoubleClick={this.onRowDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        className={rowClassName}
        {...rowProps}
        style={style}
      >
        {cells}
      </BodyRow>
    )
  }
}

function getRowHeight (state, props) {
  const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = state
  const { fixed, index, rowKey } = props

  if (!fixed) {
    return null
  }

  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey]
  }

  if (fixedColumnsBodyRowsHeight[index]) {
    return fixedColumnsBodyRowsHeight[index]
  }

  return null
}

export default connect((state, props) => {
  const { currentHoverKey, expandedRowKeys } = state
  const { rowKey, ancestorKeys } = props
  const visible = ancestorKeys.length === 0 || ancestorKeys.every(k => ~expandedRowKeys.indexOf(k))

  return ({
    visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
  })
})(TableRow)
