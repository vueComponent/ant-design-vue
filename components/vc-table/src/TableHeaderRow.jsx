import PropTypes from '../../_util/vue-types'
import { connect } from '../../_util/store'
import { mergeProps } from '../../_util/props-util'

const TableHeaderRow = {
  props: {
    index: PropTypes.number,
    fixed: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    row: PropTypes.array,
    components: PropTypes.object,
    height: PropTypes.any,
  },
  name: 'TableHeaderRow',
  render () {
    const { row, index, height, components, $listeners = {}} = this
    const onHeaderRow = $listeners.headerRow
    const HeaderRow = components.header.row
    const HeaderCell = components.header.cell
    const rowProps = onHeaderRow(row.map(cell => cell.column), index)
    const customStyle = rowProps ? rowProps.style : {}
    const style = { height, ...customStyle }

    return (
      <HeaderRow {...rowProps} style={style}>
        {row.map((cell, i) => {
          const { column, children, className, ...cellProps } = cell
          const cls = cell.class || className
          const customProps = column.onHeaderCell ? column.onHeaderCell(column) : {}
          if (column.align) {
            cellProps.style = { textAlign: column.align }
          }
          const headerCellProps = mergeProps({
            attrs: {
              ...cellProps,
            },
            class: cls,
          }, {
            ...customProps,
            key: column.key || column.dataIndex || i,
          })
          return (
            <HeaderCell
              {...headerCellProps}
            >
              {children}
            </HeaderCell>
          )
        })}
      </HeaderRow>
    )
  },
}

function getRowHeight (state, props) {
  const { fixedColumnsHeadRowsHeight } = state
  const { columns, rows, fixed } = props
  const headerHeight = fixedColumnsHeadRowsHeight[0]

  if (!fixed) {
    return null
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto'
    }
    return `${headerHeight / rows.length}px`
  }
  return null
}

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props),
  }
})(TableHeaderRow)
