import { setTransform, isTransformSupported } from './utils'
import addDOMEventListener from 'add-dom-event-listener'
import debounce from 'lodash/debounce'
function noop () {
}
export default {
  props: {
    scrollAnimated: { type: Boolean, default: true },
  },

  data () {
    this.offset = 0
    return {
      next: false,
      prev: false,
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.updatedCal()
      this.debouncedResize = debounce(() => {
        this.setNextPrev()
        this.scrollToActiveTab()
      }, 200)
      this.resizeEvent = addDOMEventListener(window, 'resize', this.debouncedResize)
    })
  },

  updated () {
    this.$nextTick(() => {
      this.updatedCal()
    })
  },

  beforeDestroy () {
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
    if (this.debouncedResize && this.debouncedResize.cancel) {
      this.debouncedResize.cancel()
    }
  },
  watch: {
    tabBarPosition (val) {
      this.tabBarPositionChange = true
      this.$nextTick(() => {
        this.setOffset(0)
      })
    },
  },
  methods: {
    updatedCal () {
      if (this.tabBarPositionChange) {
        this.tabBarPositionChange = false
        return
      }
      this.setNextPrev()
      this.$nextTick(() => {
        this.scrollToActiveTab()
      })
    },
    setNextPrev () {
      const navNode = this.$refs.nav
      const navNodeWH = this.getScrollWH(navNode)
      const containerWH = this.getOffsetWH(this.$refs.container)
      const navWrapNodeWH = this.getOffsetWH(this.$refs.navWrap)
      let { offset } = this
      const minOffset = containerWH - navNodeWH
      let { next, prev } = this
      if (minOffset >= 0) {
        next = false
        this.setOffset(0, false)
        offset = 0
      } else if (minOffset < offset) {
        next = true
      } else {
        next = false
        // Fix https://github.com/ant-design/ant-design/issues/8861
        // Test with container offset which is stable
        // and set the offset of the nav wrap node
        const realOffset = navWrapNodeWH - navNodeWH
        this.setOffset(realOffset, false)
        offset = realOffset
      }

      if (offset < 0) {
        prev = true
      } else {
        prev = false
      }

      this.setNext(next)
      this.setPrev(prev)
      return {
        next,
        prev,
      }
    },

    getOffsetWH (node) {
      const tabBarPosition = this.$props.tabBarPosition
      let prop = 'offsetWidth'
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'offsetHeight'
      }
      return node[prop]
    },

    getScrollWH (node) {
      const tabBarPosition = this.tabBarPosition
      let prop = 'scrollWidth'
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'scrollHeight'
      }
      return node[prop]
    },

    getOffsetLT (node) {
      const tabBarPosition = this.$props.tabBarPosition
      let prop = 'left'
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'top'
      }
      return node.getBoundingClientRect()[prop]
    },

    setOffset (offset, checkNextPrev = true) {
      const target = Math.min(0, offset)
      if (this.offset !== target) {
        this.offset = target
        let navOffset = {}
        const tabBarPosition = this.$props.tabBarPosition
        const navStyle = this.$refs.nav.style
        const transformSupported = isTransformSupported(navStyle)
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
          if (transformSupported) {
            navOffset = {
              value: `translate3d(0,${target}px,0)`,
            }
          } else {
            navOffset = {
              name: 'top',
              value: `${target}px`,
            }
          }
        } else {
          if (transformSupported) {
            navOffset = {
              value: `translate3d(${target}px,0,0)`,
            }
          } else {
            navOffset = {
              name: 'left',
              value: `${target}px`,
            }
          }
        }
        if (transformSupported) {
          setTransform(navStyle, navOffset.value)
        } else {
          navStyle[navOffset.name] = navOffset.value
        }
        if (checkNextPrev) {
          this.setNextPrev()
        }
      }
    },

    setPrev (v) {
      if (this.prev !== v) {
        this.prev = v
      }
    },

    setNext (v) {
      if (this.next !== v) {
        this.next = v
      }
    },

    isNextPrevShown (state) {
      if (state) {
        return state.next || state.prev
      }
      return this.next || this.prev
    },

    prevTransitionEnd (e) {
      if (e.propertyName !== 'opacity') {
        return
      }
      const { container } = this
      this.scrollToActiveTab({
        target: container,
        currentTarget: container,
      })
    },

    scrollToActiveTab (e) {
      const { activeTab } = this
      const navWrap = this.$refs.navWrap
      if (e && e.target !== e.currentTarget || !activeTab) {
        return
      }

      // when not scrollable or enter scrollable first time, don't emit scrolling
      const needToSroll = this.isNextPrevShown() && this.lastNextPrevShown
      this.lastNextPrevShown = this.isNextPrevShown()
      if (!needToSroll) {
        return
      }

      const activeTabWH = this.getScrollWH(activeTab)
      const navWrapNodeWH = this.getOffsetWH(navWrap)
      let { offset } = this
      const wrapOffset = this.getOffsetLT(navWrap)
      const activeTabOffset = this.getOffsetLT(activeTab)
      if (wrapOffset > activeTabOffset) {
        offset += (wrapOffset - activeTabOffset)
        this.setOffset(offset)
      } else if ((wrapOffset + navWrapNodeWH) < (activeTabOffset + activeTabWH)) {
        offset -= (activeTabOffset + activeTabWH) - (wrapOffset + navWrapNodeWH)
        this.setOffset(offset)
      }
    },

    prevClick (e) {
      this.__emit('prevClick', e)
      const navWrapNode = this.$refs.navWrap
      const navWrapNodeWH = this.getOffsetWH(navWrapNode)
      const { offset } = this
      this.setOffset(offset + navWrapNodeWH)
    },

    nextClick (e) {
      this.__emit('nextClick', e)
      const navWrapNode = this.$refs.navWrap
      const navWrapNodeWH = this.getOffsetWH(navWrapNode)
      const { offset } = this
      this.setOffset(offset - navWrapNodeWH)
    },

    getScrollBarNode (content) {
      const { next, prev } = this
      const { prefixCls, scrollAnimated } = this.$props
      const showNextPrev = prev || next

      const prevButton = (
        <span
          onClick={prev ? this.prevClick : noop}
          unselectable='unselectable'
          class={{
            [`${prefixCls}-tab-prev`]: 1,
            [`${prefixCls}-tab-btn-disabled`]: !prev,
            [`${prefixCls}-tab-arrow-show`]: showNextPrev,
          }}
          onTransitionEnd={this.prevTransitionEnd}
        >
          <span class={`${prefixCls}-tab-prev-icon`} />
        </span>
      )

      const nextButton = (
        <span
          onClick={next ? this.nextClick : noop}
          unselectable='unselectable'
          class={{
            [`${prefixCls}-tab-next`]: 1,
            [`${prefixCls}-tab-btn-disabled`]: !next,
            [`${prefixCls}-tab-arrow-show`]: showNextPrev,
          }}
        >
          <span class={`${prefixCls}-tab-next-icon`} />
        </span>
      )

      const navClassName = `${prefixCls}-nav`
      const navClasses = {
        [navClassName]: true,
        [
        scrollAnimated
          ? `${navClassName}-animated`
          : `${navClassName}-no-animated`
        ]: true,
      }

      return (
        <div
          class={{
            [`${prefixCls}-nav-container`]: 1,
            [`${prefixCls}-nav-container-scrolling`]: showNextPrev,
          }}
          key='container'
          ref='container'
        >
          {prevButton}
          {nextButton}
          <div class={`${prefixCls}-nav-wrap`} ref='navWrap'>
            <div class={`${prefixCls}-nav-scroll`}>
              <div class={navClasses} ref='nav'>
                {content}
              </div>
            </div>
          </div>
        </div>
      )
    },
  },
}
