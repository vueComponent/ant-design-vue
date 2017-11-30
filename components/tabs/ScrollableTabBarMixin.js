import { setTransform, isTransformSupported } from './utils'
import addDOMEventListener from 'add-dom-event-listener'
import debounce from 'lodash.debounce'
function noop () {
}
export default {
  props: {
    scrollAnimated: { type: Boolean, default: true },
    onPrevClick: { type: Function, default: noop },
    onNextClick: { type: Function, default: noop },
  },

  data () {
    return {
      next: false,
      prev: false,
      offset: 0,
    }
  },

  mounted () {
    this.updatedCal()
    const debouncedResize = debounce(() => {
      this.setNextPrev()
      this.scrollToActiveTab()
    }, 200)
    this.resizeEvent = addDOMEventListener(window, 'resize', debouncedResize)
  },

  updated (prevProps) {
    const props = this.$props
    if (prevProps && prevProps.tabBarPosition !== props.tabBarPosition) {
      this.setOffset(0)
      return
    }
    const nextPrev = this.setNextPrev()
    // wait next, prev show hide
    if (this.isNextPrevShown(this) !== this.isNextPrevShown(nextPrev)) {
      Object.assign(this, this.scrollToActiveTab)
    } else if (!prevProps || props.activeKey !== prevProps.activeKey) {
      // can not use props.activeKey
      this.scrollToActiveTab()
    }
  },

  beforeDestroy () {
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
  },
  methods: {
    updatedCal () {

    },
    setNextPrev () {
      const navNode = this.nav
      const navNodeWH = this.getOffsetWH(navNode)
      const navWrapNode = this.navWrap
      const navWrapNodeWH = this.getOffsetWH(navWrapNode)
      let { offset } = this
      const minOffset = navWrapNodeWH - navNodeWH
      let { next, prev } = this
      if (minOffset >= 0) {
        next = false
        this.setOffset(0, false)
        offset = 0
      } else if (minOffset < offset) {
        next = (true)
      } else {
        next = (false)
        this.setOffset(minOffset, false)
        offset = minOffset
      }

      if (offset < 0) {
        prev = (true)
      } else {
        prev = (false)
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
        const navStyle = this.nav.style
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
      const { activeTab, navWrap } = this
      if (e && e.target !== e.currentTarget || !activeTab) {
        return
      }

      // when not scrollable or enter scrollable first time, don't emit scrolling
      const needToSroll = this.isNextPrevShown() && this.lastNextPrevShown
      this.lastNextPrevShown = this.isNextPrevShown()
      if (!needToSroll) {
        return
      }

      const activeTabWH = this.getOffsetWH(activeTab)
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
      this.$props.onPrevClick(e)
      const navWrapNode = this.navWrap
      const navWrapNodeWH = this.getOffsetWH(navWrapNode)
      const { offset } = this
      this.setOffset(offset + navWrapNodeWH)
    },

    nextClick (e) {
      this.$props.onNextClick(e)
      const navWrapNode = this.navWrap
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
