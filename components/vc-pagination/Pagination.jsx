
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import { hasProp } from '../_util/props-util'
import Pager from './Pager'
import Options from './Options'
import LOCALE from './locale/zh_CN'
import KEYCODE from './KeyCode'

function noop () {
}

// 是否是正整数
function isInteger (value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value
}

function defaultItemRender (page, type, element) {
  return element
}

export default {
  name: 'Pagination',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('rc-pagination'),
    selectPrefixCls: PropTypes.string.def('rc-select'),
    current: PropTypes.number,
    defaultCurrent: PropTypes.number.def(1),
    total: PropTypes.number.def(0),
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number.def(10),
    hideOnSinglePage: PropTypes.bool.def(false),
    showSizeChanger: PropTypes.bool.def(false),
    showLessItems: PropTypes.bool.def(false),
    // showSizeChange: PropTypes.func.def(noop),
    selectComponentClass: PropTypes.any,
    showPrevNextJumpers: PropTypes.bool.def(true),
    showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    showTitle: PropTypes.bool.def(true),
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    buildOptionText: PropTypes.func,
    showTotal: PropTypes.func,
    simple: PropTypes.bool,
    locale: PropTypes.object.def(LOCALE),
    itemRender: PropTypes.func.def(defaultItemRender),
  },
  model: {
    prop: 'current',
    event: 'change.current',
  },
  data () {
    const hasOnChange = this.onChange !== noop
    const hasCurrent = hasProp(this, 'current')
    if (hasCurrent && !hasOnChange) {
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'); // eslint-disable-line
    }
    let current = this.defaultCurrent
    if (hasCurrent) {
      current = this.current
    }

    let pageSize = this.defaultPageSize
    if (hasProp(this, 'pageSize')) {
      pageSize = this.pageSize
    }

    return {
      stateCurrent: current,
      stateCurrentInputValue: current,
      statePageSize: pageSize,
    }
  },
  watch: {
    current (val) {
      this.setState({
        stateCurrent: val,
        stateCurrentInputValue: val,
      })
    },
    pageSize (val) {
      const newState = {}
      let current = this.stateCurrent
      const newCurrent = this.calculatePage(val)
      current = current > newCurrent ? newCurrent : current
      if (!hasProp(this, 'current')) {
        newState.stateCurrent = current
        newState.stateCurrentInputValue = current
      }
      newState.statePageSize = val
      this.setState(newState)
    },
    stateCurrent (val, oldValue) {
      // When current page change, fix focused style of prev item
      // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
      this.$nextTick(() => {
        if (this.$refs.paginationNode) {
          const lastCurrentNode = this.$refs.paginationNode.querySelector(
            `.${this.prefixCls}-item-${oldValue}`
          )
          if (lastCurrentNode && document.activeElement === lastCurrentNode) {
            lastCurrentNode.blur()
          }
        }
      })
    },
  },
  methods: {
    isValid (page) {
      return isInteger(page) && page >= 1 && page !== this.stateCurrent
    },
    calculatePage (p) {
      let pageSize = p
      if (typeof pageSize === 'undefined') {
        pageSize = this.statePageSize
      }
      return Math.floor((this.total - 1) / pageSize) + 1
    },
    handleGoTO (event) {
      if (event.keyCode === KEYCODE.ENTER || event.type === 'click') {
        this.handleChange(this.stateCurrentInputValue)
      }
    },
    prev () {
      if (this.hasPrev()) {
        this.handleChange(this.stateCurrent - 1)
      }
    },
    next () {
      if (this.hasNext()) {
        this.handleChange(this.stateCurrent + 1)
      }
    },
    hasPrev () {
      return this.stateCurrent > 1
    },
    hasNext () {
      return this.stateCurrent < this.calculatePage()
    },
    handleKeyDown (event) {
      if (event.keyCode === KEYCODE.ARROW_UP || event.keyCode === KEYCODE.ARROW_DOWN) {
        event.preventDefault()
      }
    },
    handleKeyUp (event) {
      const inputValue = event.target.value
      const stateCurrentInputValue = this.stateCurrentInputValue
      let value

      if (inputValue === '') {
        value = inputValue
      } else if (isNaN(Number(inputValue))) {
        value = stateCurrentInputValue
      } else {
        value = Number(inputValue)
      }

      if (value !== stateCurrentInputValue) {
        this.setState({
          stateCurrentInputValue: value,
        })
      }

      if (event.keyCode === KEYCODE.ENTER) {
        this.handleChange(value)
      } else if (event.keyCode === KEYCODE.ARROW_UP) {
        this.handleChange(value - 1)
      } else if (event.keyCode === KEYCODE.ARROW_DOWN) {
        this.handleChange(value + 1)
      }
    },
    changePageSize (size) {
      let current = this.stateCurrent
      const preCurrent = current
      const newCurrent = this.calculatePage(size)
      current = current > newCurrent ? newCurrent : current
      // fix the issue:
      // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.
      if (newCurrent === 0) {
        current = this.stateCurrent
      }
      if (typeof size === 'number') {
        if (!hasProp(this, 'pageSize')) {
          this.setState({
            statePageSize: size,
          })
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: current,
            stateCurrentInputValue: current,
          })
        }
      }
      this.$emit('update:pageSize', size)
      this.$emit('showSizeChange', current, size)
      if (current !== preCurrent) {
        this.$emit('change.current', current, size)
      }
    },
    handleChange (p) {
      let page = p
      if (this.isValid(page)) {
        const allTotal = this.calculatePage()
        if (page > allTotal) {
          page = allTotal
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: page,
            stateCurrentInputValue: page,
          })
        }
        // this.$emit('input', page)
        this.$emit('change', page, this.statePageSize)
        this.$emit('change.current', page, this.statePageSize)
        return page
      }
      return this.stateCurrent
    },
    runIfEnter (event, callback, ...restParams) {
      if (event.key === 'Enter' || event.charCode === 13) {
        callback(...restParams)
      }
    },
    runIfEnterPrev (event) {
      this.runIfEnter(event, this.prev)
    },
    runIfEnterNext (event) {
      this.runIfEnter(event, this.next)
    },
    runIfEnterJumpPrev (event) {
      this.runIfEnter(event, this.jumpPrev)
    },
    runIfEnterJumpNext (event) {
      this.runIfEnter(event, this.jumpNext)
    },
    getJumpPrevPage () {
      return Math.max(1, this.stateCurrent - (this.showLessItems ? 3 : 5))
    },
    getJumpNextPage () {
      return Math.min(this.calculatePage(), this.stateCurrent + (this.showLessItems ? 3 : 5))
    },
    jumpPrev () {
      this.handleChange(this.getJumpPrevPage())
    },
    jumpNext () {
      this.handleChange(this.getJumpNextPage())
    },
  },
  render () {
    // When hideOnSinglePage is true and there is only 1 page, hide the pager
    if (this.hideOnSinglePage === true && this.total <= this.statePageSize) {
      return null
    }

    const locale = this.locale

    const prefixCls = this.prefixCls
    const allPages = this.calculatePage()
    const pagerList = []
    let jumpPrev = null
    let jumpNext = null
    let firstPager = null
    let lastPager = null
    let gotoButton = null
    const goButton = (this.showQuickJumper && this.showQuickJumper.goButton)
    const pageBufferSize = this.showLessItems ? 1 : 2
    const { stateCurrent, statePageSize } = this
    const prevPage = stateCurrent - 1 > 0 ? stateCurrent - 1 : 0
    const nextPage = stateCurrent + 1 < allPages ? stateCurrent + 1 : allPages

    if (this.simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type='button'
              onClick={this.handleGoTO}
              onKeyup={this.handleGoTO}
            >
              {locale.jump_to_confirm}
            </button>
          )
        } else {
          gotoButton = (
            <span
              onClick={this.handleGoTO}
              onKeyup={this.handleGoTO}
            >{goButton}</span>
          )
        }
        gotoButton = (
          <li
            title={this.showTitle ? `${locale.jump_to}${this.stateCurrent}/${allPages}` : null}
            class={`${prefixCls}-simple-pager`}
          >
            {gotoButton}
          </li>
        )
      }
      const hasPrev = this.hasPrev()
      const hasNext = this.hasNext()
      return (
        <ul class={`${prefixCls} ${prefixCls}-simple`}>
          <li
            title={this.showTitle ? locale.prev_page : null}
            onClick={this.prev}
            tabIndex={hasPrev ? 0 : null}
            onKeypress={this.runIfEnterPrev}
            class={`${hasPrev ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
            aria-disabled={!this.hasPrev()}
          >
            {this.itemRender(prevPage, 'prev', <a class={`${prefixCls}-item-link`} />)}
          </li>
          <li
            title={this.showTitle ? `${stateCurrent}/${allPages}` : null}
            class={`${prefixCls}-simple-pager`}
          >
            <input
              type='text'
              value={this.stateCurrentInputValue}
              onKeydown={this.handleKeyDown}
              onKeyup={this.handleKeyUp}
              onInput={this.handleKeyUp}
              size='3'
            />
            <span class={`${prefixCls}-slash`}>／</span>
            {allPages}
          </li>
          <li
            title={this.showTitle ? locale.next_page : null}
            onClick={this.next}
            tabIndex={this.hasNext ? 0 : null}
            onKeypress={this.runIfEnterNext}
            class={`${hasNext ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
            aria-disabled={!this.hasNext()}
          >
            {this.itemRender(nextPage, 'next', <a class={`${prefixCls}-item-link`} />)}
          </li>
          {gotoButton}
        </ul>
      )
    }
    if (allPages <= 5 + pageBufferSize * 2) {
      for (let i = 1; i <= allPages; i++) {
        const active = stateCurrent === i
        pagerList.push(
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={this.showTitle}
            itemRender={this.itemRender}
          />
        )
      }
    } else {
      const prevItemTitle = this.showLessItems ? locale.prev_3 : locale.prev_5
      const nextItemTitle = this.showLessItems ? locale.next_3 : locale.next_5
      if (this.showPrevNextJumpers) {
        jumpPrev = (
          <li
            title={this.showTitle ? prevItemTitle : null}
            key='prev'
            onClick={this.jumpPrev}
            tabIndex='0'
            onKeypress={this.runIfEnterJumpPrev}
            class={`${prefixCls}-jump-prev`}
          >
            {this.itemRender(
              this.getJumpPrevPage(), 'jump-prev', <a class={`${prefixCls}-item-link`} />
            )}
          </li>
        )
        jumpNext = (
          <li
            title={this.showTitle ? nextItemTitle : null}
            key='next'
            tabIndex='0'
            onClick={this.jumpNext}
            onKeypress={this.runIfEnterJumpNext}
            class={`${prefixCls}-jump-next`}
          >
            {this.itemRender(
              this.getJumpNextPage(), 'jump-next', <a class={`${prefixCls}-item-link`} />
            )}
          </li>
        )
      }

      lastPager = (
        <Pager
          locale={locale}
          last
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={allPages}
          page={allPages}
          active={false}
          showTitle={this.showTitle}
          itemRender={this.itemRender}
        />
      )
      firstPager = (
        <Pager
          locale={locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={1}
          page={1}
          active={false}
          showTitle={this.showTitle}
          itemRender={this.itemRender}
        />
      )

      let left = Math.max(1, stateCurrent - pageBufferSize)
      let right = Math.min(stateCurrent + pageBufferSize, allPages)

      if (stateCurrent - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2
      }

      if (allPages - stateCurrent <= pageBufferSize) {
        left = allPages - pageBufferSize * 2
      }

      for (let i = left; i <= right; i++) {
        const active = stateCurrent === i
        pagerList.push(
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={this.showTitle}
            itemRender={this.itemRender}
          />
        )
      }

      if (stateCurrent - 1 >= pageBufferSize * 2 && stateCurrent !== 1 + 2) {
        pagerList[0] = (
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={left}
            page={left}
            class={`${prefixCls}-item-after-jump-prev`}
            active={false}
            showTitle={this.showTitle}
            itemRender={this.itemRender}
          />
        )
        pagerList.unshift(jumpPrev)
      }
      if (allPages - stateCurrent >= pageBufferSize * 2 && stateCurrent !== allPages - 2) {
        pagerList[pagerList.length - 1] = (
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={right}
            page={right}
            class={`${prefixCls}-item-before-jump-next`}
            active={false}
            showTitle={this.showTitle}
            itemRender={this.itemRender}
          />
        )
        pagerList.push(jumpNext)
      }

      if (left !== 1) {
        pagerList.unshift(firstPager)
      }
      if (right !== allPages) {
        pagerList.push(lastPager)
      }
    }

    let totalText = null

    if (this.showTotal) {
      totalText = (
        <li class={`${prefixCls}-total-text`}>
          {this.showTotal(
            this.total,
            [
              (stateCurrent - 1) * statePageSize + 1,
              stateCurrent * statePageSize > this.total ? this.total : stateCurrent * statePageSize,
            ]
          )}
        </li>
      )
    }
    const prevDisabled = !this.hasPrev()
    const nextDisabled = !this.hasNext()
    const buildOptionText = this.buildOptionText || this.$scopedSlots.buildOptionText
    return (
      <ul
        class={`${prefixCls}`}
        unselectable='unselectable'
        ref='paginationNode'
      >
        {totalText}
        <li
          title={this.showTitle ? locale.prev_page : null}
          onClick={this.prev}
          tabIndex={prevDisabled ? null : 0}
          onKeypress={this.runIfEnterPrev}
          class={`${!prevDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
          aria-disabled={prevDisabled}
        >
          {this.itemRender(prevPage, 'prev', <a class={`${prefixCls}-item-link`} />)}
        </li>
        {pagerList}
        <li
          title={this.showTitle ? locale.next_page : null}
          onClick={this.next}
          tabIndex={nextDisabled ? null : 0}
          onKeypress={this.runIfEnterNext}
          class={`${!nextDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
          aria-disabled={nextDisabled}
        >
          {this.itemRender(nextPage, 'next', <a class={`${prefixCls}-item-link`} />)}
        </li>
        <Options
          locale={locale}
          rootPrefixCls={prefixCls}
          selectComponentClass={this.selectComponentClass}
          selectPrefixCls={this.selectPrefixCls}
          changeSize={this.showSizeChanger ? this.changePageSize : null}
          current={stateCurrent}
          pageSize={statePageSize}
          pageSizeOptions={this.pageSizeOptions}
          buildOptionText={buildOptionText || null}
          quickGo={this.showQuickJumper ? this.handleChange : null}
          goButton={goButton}
        />
      </ul>
    )
  },
}

