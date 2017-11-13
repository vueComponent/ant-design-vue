<script>
import Button from '../button/index'
import Pager from './Pager'
import locale from './locale/zh_CN'
import KEYCODE from './KeyCode'

export default {
  name: 'Pagination',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pagination',
    },
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    showSizeChanger: {
      type: Boolean,
      default: false,
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '40'],
    },
    showQuickJumper: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
    simple: Boolean,
    showTitle: {
      type: Boolean,
      default: true,
    },
    showTotal: Function,
  },
  model: {
    prop: 'current',
  },
  data () {
    const { current } = this
    return {
      stateCurrent: current,
    }
  },
  methods: {
    isInteger (value) {
      return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value
    },
    isValid (page) {
      return this.isInteger(page) && page >= 1 && page !== this.stateCurrent
    },
    calculatePage (p) {
      let pageSize = p
      if (typeof pageSize === 'undefined') {
        pageSize = this.pageSize
      }
      return Math.floor((this.total - 1) / pageSize) + 1
    },
    handleGoTO (event) {
      if (event.keyCode === KEYCODE.ENTER || event.type === 'click') {
        this.handleChange(this.stateCurrent)
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
      const stateCurrent = this.stateCurrent
      let value

      if (inputValue === '') {
        value = inputValue
      } else if (isNaN(Number(inputValue))) {
        value = stateCurrent
      } else {
        value = Number(inputValue)
      }
      event.target.value = value

      if (event.keyCode === KEYCODE.ENTER) {
        this.handleChange(value)
      } else if (event.keyCode === KEYCODE.ARROW_UP) {
        this.handleChange(value - 1)
      } else if (event.keyCode === KEYCODE.ARROW_DOWN) {
        this.handleChange(value + 1)
      }
    },
    handleChange (p) {
      let page = p
      if (this.isValid(page)) {
        const allTotal = this.calculatePage()
        if (page > allTotal) {
          page = allTotal
        }
        this.stateCurrent = page
        this.$emit('input', page)
        this.$emit('change', page, this.pageSize)
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
  watch: {
    current (val) {
      this.stateCurrent = val
    },
  },
  components: {
    vcButton: Button,
    Pager,
  },
  render () {
    const prefixCls = this.prefixCls
    const allPages = this.calculatePage()
    const pagerList = []
    let jumpPrev = null
    let jumpNext = null
    let firstPager = null
    let lastPager = null
    let gotoButton = null

    const goButton = this.showQuickJumper
    const pageBufferSize = this.showLessItems ? 1 : 2
    const { stateCurrent, pageSize } = this

    if (this.simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <li
              title={this.showTitle ? `${locale.jump_to}${stateCurrent}/${allPages}` : null}
              class={`${prefixCls}-simple-pager`}
            >
              <vc-button
                onClick={this.handleGoTO}
                onKeyup={this.handleGoTO}
              >
                {locale.jump_to_confirm}
              </vc-button>
            </li>
          )
        } else {
          gotoButton = goButton
        }
      }
      return (
        <ul class={`${prefixCls} ${prefixCls}-simple`}>
          <li
            title={this.showTitle ? locale.prev_page : null}
            onClick={this.prev}
            tabIndex='0'
            onKeypress={this.runIfEnterPrev}
            class={`${this.hasPrev() ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
            aria-disabled={!this.hasPrev()}
          >
            <a class={`${prefixCls}-item-link`} />
          </li>
          <li
            title={this.showTitle ? `${stateCurrent}/${allPages}` : null}
            class={`${prefixCls}-simple-pager`}
          >
            <input
              type='text'
              value={this.stateCurrent}
              onKeydown={this.handleKeyDown}
              onKeyup={this.handleKeyUp}
              onChange={this.handleKeyUp}
              size='3'
            />
            <span class={`${prefixCls}-slash`}>／</span>
            {allPages}
          </li>
          <li
            title={this.showTitle ? locale.next_page : null}
            onClick={this.next}
            tabIndex='0'
            onKeypress={this.runIfEnterNext}
            class={`${this.hasNext() ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
            aria-disabled={!this.hasNext()}
          >
            <a class={`${prefixCls}-item-link`} />
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
            rootPrefixCls={this.prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={this.showTitle}
          />
        )
      }
    } else {
      const prevItemTitle = this.showLessItems ? locale.prev_3 : locale.prev_5
      const nextItemTitle = this.showLessItems ? locale.next_3 : locale.next_5
      jumpPrev = (
        <li
          title={this.showTitle ? prevItemTitle : null}
          key='prev'
          onClick={this.jumpPrev}
          tabIndex='0'
          onKeypress={this.runIfEnterJumpPrev}
          class={`${prefixCls}-jump-prev`}
        >
          <a class={`${prefixCls}-item-link`} />
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
          <a class={`${prefixCls}-item-link`} />
        </li>
      )
      lastPager = (
        <Pager
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={allPages}
          page={allPages}
          active={false}
          showTitle={this.showTitle}
        />
      )
      firstPager = (
        <Pager
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={1}
          page={1}
          active={false}
          showTitle={this.showTitle}
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
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={this.showTitle}
          />
        )
      }

      if (stateCurrent - 1 >= pageBufferSize * 2 && stateCurrent !== 1 + 2) {
        pagerList[0] = (
          <Pager
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={left}
            page={left}
            className={`${prefixCls}-item-after-jump-prev`}
            active={false}
            showTitle={this.showTitle}
          />
        )
        pagerList.unshift(jumpPrev)
      }
      if (allPages - stateCurrent >= pageBufferSize * 2 && stateCurrent !== allPages - 2) {
        pagerList[pagerList.length - 1] = (
          <Pager
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={right}
            page={right}
            className={`${prefixCls}-item-before-jump-next`}
            active={false}
            showTitle={this.showTitle}
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
              (stateCurrent - 1) * pageSize + 1,
              stateCurrent * pageSize > this.total ? this.total : stateCurrent * pageSize,
            ]
          )}
        </li>
      )
    }
    const prevDisabled = !this.hasPrev()
    const nextDisabled = !this.hasNext()
    return (
      <ul
        class={`${prefixCls} ${this.className}`}
        unselectable='unselectable'
      >
        {totalText}
        <li
          title={this.showTitle ? locale.prev_page : null}
          onClick={this.prev}
          tabIndex='0'
          onKeypress={this.runIfEnterPrev}
          class={`${!prevDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
          aria-disabled={prevDisabled}
        >
          <a class={`${prefixCls}-item-link`} />
        </li>
        {pagerList}
        <li
          title={this.showTitle ? locale.next_page : null}
          onClick={this.next}
          tabIndex='0'
          onKeypress={this.runIfEnterNext}
          class={`${!nextDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
          aria-disabled={nextDisabled}
        >
          <a class={`${prefixCls}-item-link`} />
        </li>
      </ul>
    )
  },
}
</script>
