
import PropTypes from '../../_util/vue-types'
import { debounce, warningOnce } from './utils'
import shallowequal from 'shallowequal'
import addEventListener from '../../_util/Dom/addEventListener'
import { Provider, create } from '../../_util/store'
import merge from 'lodash/merge'
import ColumnManager from './ColumnManager'
import classes from 'component-classes'
import HeadTable from './HeadTable'
import BodyTable from './BodyTable'
import ExpandableTable from './ExpandableTable'
import { initDefaultProps, getOptionProps } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'

export default {
  name: 'Table',
  mixins: [BaseMixin],
  props: initDefaultProps({
    data: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    // onRow: PropTypes.func,
    // onHeaderRow: PropTypes.func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    id: PropTypes.string,
    footer: PropTypes.func,
    emptyText: PropTypes.any,
    scroll: PropTypes.object,
    rowRef: PropTypes.func,
    getBodyWrapper: PropTypes.func,
    components: PropTypes.shape({
      table: PropTypes.any,
      header: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any,
      }),
      body: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any,
      }),
    }),
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    expandedRowClassName: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandIconColumnIndex: PropTypes.number,
    expandedRowRender: PropTypes.func,
    childrenColumnName: PropTypes.string,
    indentSize: PropTypes.number,
  }, {
    data: [],
    useFixedHeader: false,
    rowKey: 'key',
    rowClassName: () => '',
    prefixCls: 'rc-table',
    bodyStyle: {},
    showHeader: true,
    scroll: {},
    rowRef: () => null,
    emptyText: () => 'No Data',
  }),

  // static childContextTypes = {
  //   table: PropTypes.any,
  //   components: PropTypes.any,
  // },

  created () {
    [
      'rowClick',
      'rowDoubleclick',
      'rowContextmenu',
      'rowMouseenter',
      'rowMouseleave',
    ].forEach(name => {
      warningOnce(
        this.$listeners[name] === undefined,
        `${name} is deprecated, please use onRow instead.`,
      )
    })

    warningOnce(
      this.getBodyWrapper === undefined,
      'getBodyWrapper is deprecated, please use custom components instead.',
    )

    // this.columnManager = new ColumnManager(this.columns, this.$slots.default)

    this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
    })

    this.setScrollPosition('left')

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150)
  },
  data () {
    this.preData = [...this.data]
    return {
      columnManager: new ColumnManager(this.columns, this.$slots.default),
      sComponents: merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th',
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td',
        },
      }, this.components),
    }
  },
  provide () {
    return {
      table: this,
    }
  },
  watch: {
    components (val) {
      this._components = merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th',
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td',
        },
      }, this.components)
    },
    columns (val) {
      if (val) {
        this.columnManager.reset(val)
      }
    },
    data (val) {
      if (val.length === 0 && this.hasScrollX()) {
        this.$nextTick(() => {
          this.resetScrollX()
        })
      }
    },
  },

  mounted () {
    this.$nextTick(() => {
      if (this.columnManager.isAnyColumnsFixed()) {
        this.handleWindowResize()
        this.resizeEvent = addEventListener(
          window, 'resize', this.debouncedWindowResize
        )
      }
    })
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.columns && nextProps.columns !== this.props.columns) {
      this.columnManager.reset(nextProps.columns)
    } else if (nextProps.children !== this.props.children) {
      this.columnManager.reset(null, nextProps.children)
    }
  },

  updated (prevProps) {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize()
      if (!this.resizeEvent) {
        this.resizeEvent = addEventListener(
          window, 'resize', this.debouncedWindowResize
        )
      }
    }
  },

  beforeDestroy () {
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel()
    }
  },
  methods: {
    getRowKey (record, index) {
      const rowKey = this.rowKey
      const key = (typeof rowKey === 'function')
        ? rowKey(record, index) : record[rowKey]
      warningOnce(
        key !== undefined,
        'Each record in table should have a unique `key` prop,' +
        'or set `rowKey` to an unique primary key.'
      )
      return key === undefined ? index : key
    },

    setScrollPosition (position) {
      this.scrollPosition = position
      if (this.tableNode) {
        const { prefixCls } = this
        if (position === 'both') {
          classes(this.tableNode)
            .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
            .add(`${prefixCls}-scroll-position-left`)
            .add(`${prefixCls}-scroll-position-right`)
        } else {
          classes(this.tableNode)
            .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
            .add(`${prefixCls}-scroll-position-${position}`)
        }
      }
    },

    setScrollPositionClassName () {
      const node = this.bodyTable
      const scrollToLeft = node.scrollLeft === 0
      const scrollToRight = node.scrollLeft + 1 >=
        node.children[0].getBoundingClientRect().width -
        node.getBoundingClientRect().width
      if (scrollToLeft && scrollToRight) {
        this.setScrollPosition('both')
      } else if (scrollToLeft) {
        this.setScrollPosition('left')
      } else if (scrollToRight) {
        this.setScrollPosition('right')
      } else if (this.scrollPosition !== 'middle') {
        this.setScrollPosition('middle')
      }
    },

    handleWindowResize () {
      this.syncFixedTableRowHeight()
      this.setScrollPositionClassName()
    },

    syncFixedTableRowHeight () {
      const tableRect = this.tableNode.getBoundingClientRect()
      // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
      // see: https://github.com/ant-design/ant-design/issues/4836
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return
      }
      const { prefixCls } = this.props
      const headRows = this.headTable
        ? this.headTable.querySelectorAll('thead')
        : this.bodyTable.querySelectorAll('thead')
      const bodyRows = this.bodyTable.querySelectorAll(`.${prefixCls}-row`) || []
      const fixedColumnsHeadRowsHeight = [].map.call(
        headRows, row => row.getBoundingClientRect().height || 'auto'
      )
      const fixedColumnsBodyRowsHeight = [].map.call(
        bodyRows, row => row.getBoundingClientRect().height || 'auto'
      )
      const state = this.store.getState()
      if (shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
          shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
        return
      }

      this.store.setState({
        fixedColumnsHeadRowsHeight,
        fixedColumnsBodyRowsHeight,
      })
    },

    resetScrollX () {
      if (this.headTable) {
        this.headTable.scrollLeft = 0
      }
      if (this.bodyTable) {
        this.bodyTable.scrollLeft = 0
      }
    },

    hasScrollX () {
      const { scroll = {}} = this
      return 'x' in scroll
    },

    handleBodyScrollLeft  (e) {
      // Fix https://github.com/ant-design/ant-design/issues/7635
      if (e.currentTarget !== e.target) {
        return
      }
      const target = e.target
      const { scroll = {}} = this
      const { headTable, bodyTable } = this
      if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
        if (target === bodyTable && headTable) {
          headTable.scrollLeft = target.scrollLeft
        } else if (target === headTable && bodyTable) {
          bodyTable.scrollLeft = target.scrollLeft
        }
        this.setScrollPositionClassName()
      }
      // Remember last scrollLeft for scroll direction detecting.
      this.lastScrollLeft = target.scrollLeft
    },

    handleBodyScrollTop  (e) {
      const target = e.target
      const { scroll = {}} = this
      const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this
      if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== headTable) {
        const scrollTop = target.scrollTop
        if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
          fixedColumnsBodyLeft.scrollTop = scrollTop
        }
        if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
          fixedColumnsBodyRight.scrollTop = scrollTop
        }
        if (bodyTable && target !== bodyTable) {
          bodyTable.scrollTop = scrollTop
        }
      }
      // Remember last scrollTop for scroll direction detecting.
      this.lastScrollTop = target.scrollTop
    },

    handleBodyScroll (e) {
      this.handleBodyScrollLeft(e)
      this.handleBodyScrollTop(e)
    },

    renderMainTable () {
      const { scroll, prefixCls } = this
      const isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed()
      const scrollable = isAnyColumnsFixed || scroll.x || scroll.y

      const table = [
        this.renderTable({
          columns: this.columnManager.groupedColumns(),
          isAnyColumnsFixed,
        }),
        this.renderEmptyText(),
        this.renderFooter(),
      ]

      return scrollable ? (
        <div class={`${prefixCls}-scroll`}>{table}</div>
      ) : table
    },

    renderLeftFixedTable () {
      const { prefixCls } = this

      return (
        <div class={`${prefixCls}-fixed-left`}>
          {this.renderTable({
            columns: this.columnManager.leftColumns(),
            fixed: 'left',
          })}
        </div>
      )
    },
    renderRightFixedTable () {
      const { prefixCls } = this

      return (
        <div class={`${prefixCls}-fixed-right`}>
          {this.renderTable({
            columns: this.columnManager.rightColumns(),
            fixed: 'right',
          })}
        </div>
      )
    },

    renderTable (options) {
      const { columns, fixed, isAnyColumnsFixed } = options
      const { prefixCls, scroll = {}} = this
      const tableClassName = (scroll.x || fixed) ? `${prefixCls}-fixed` : ''

      const headTable = (
        <HeadTable
          key='head'
          columns={columns}
          fixed={fixed}
          tableClassName={tableClassName}
          handleBodyScrollLeft={this.handleBodyScrollLeft}
          expander={this.expander}
        />
      )

      const bodyTable = (
        <BodyTable
          key='body'
          columns={columns}
          fixed={fixed}
          tableClassName={tableClassName}
          getRowKey={this.getRowKey}
          handleBodyScroll={this.handleBodyScroll}
          expander={this.expander}
          isAnyColumnsFixed={isAnyColumnsFixed}
        />
      )

      return [headTable, bodyTable]
    },

    renderTitle () {
      const { title, prefixCls } = this
      return title ? (
        <div class={`${prefixCls}-title`} key='title'>
          {title(this.props.data)}
        </div>
      ) : null
    },

    renderFooter () {
      const { footer, prefixCls } = this
      return footer ? (
        <div class={`${prefixCls}-footer`} key='footer'>
          {footer(this.props.data)}
        </div>
      ) : null
    },

    renderEmptyText () {
      const { emptyText, prefixCls, data } = this
      if (data.length) {
        return null
      }
      const emptyClassName = `${prefixCls}-placeholder`
      return (
        <div class={emptyClassName} key='emptyText'>
          {(typeof emptyText === 'function') ? emptyText() : emptyText}
        </div>
      )
    },
  },

  render () {
    const props = getOptionProps(this)
    const { $listeners, columnManager, getRowKey } = this
    const prefixCls = props.prefixCls

    let className = props.prefixCls
    if (props.useFixedHeader || (props.scroll && props.scroll.y)) {
      className += ` ${prefixCls}-fixed-header`
    }
    if (this.scrollPosition === 'both') {
      className += ` ${prefixCls}-scroll-position-left ${prefixCls}-scroll-position-right`
    } else {
      className += ` ${prefixCls}-scroll-position-${this.scrollPosition}`
    }
    const hasLeftFixed = columnManager.isAnyColumnsLeftFixed()
    const hasRightFixed = columnManager.isAnyColumnsRightFixed()

    const expandableTableProps = {
      props: {
        ...props,
        columnManager,
        getRowKey,
      },
      on: { ...$listeners },
      scopedSlots: {
        default: (expander) => {
          this.expander = expander
          return (
            <div
              ref='tableNode'
              class={className}
              // style={props.style}
              // id={props.id}
            >
              {this.renderTitle()}
              <div class={`${prefixCls}-content`}>
                {this.renderMainTable()}
                {hasLeftFixed && this.renderLeftFixedTable()}
                {hasRightFixed && this.renderRightFixedTable()}
              </div>
            </div>
          )
        },
      },
    }
    return (
      <Provider store={this.store}>
        <ExpandableTable
          {...expandableTableProps}
        />
      </Provider>
    )
  },
}
