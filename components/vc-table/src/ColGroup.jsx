import PropTypes from '../../_util/vue-types'

export default {
  name: 'ColGroup',
  props: {
    fixed: PropTypes.string,
  },
  inject: {
    table: { default: {}},
  },
  render () {
    const { fixed, table } = this
    const { prefixCls, expandIconAsCell } = table

    let cols = []

    if (expandIconAsCell && fixed !== 'right') {
      cols.push(
        <col
          class={`${prefixCls}-expand-icon-col`}
          key='rc-table-expand-icon-col'
        />
      )
    }

    let leafColumns

    if (fixed === 'left') {
      leafColumns = table.columnManager.leftLeafColumns()
    } else if (fixed === 'right') {
      leafColumns = table.columnManager.rightLeafColumns()
    } else {
      leafColumns = table.columnManager.leafColumns()
    }
    cols = cols.concat(
      leafColumns.map(c => {
        return (
          <col
            key={c.key || c.dataIndex}
            style={{ width: c.width, minWidth: c.width }}
          />
        )
      })
    )
    return (
      <colgroup>
        {cols}
      </colgroup>
    )
  },

}

