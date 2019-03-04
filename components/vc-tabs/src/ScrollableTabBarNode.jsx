import addDOMEventListener from 'add-dom-event-listener';
import debounce from 'lodash/debounce';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getComponentFromProp } from '../../_util/props-util';
import { setTransform, isTransformSupported } from './utils';

function noop() {}
export default {
  name: 'ScrollableTabBarNode',
  mixins: [BaseMixin],
  props: {
    activeKey: PropTypes.any,
    getRef: PropTypes.func.def(() => {}),
    saveRef: PropTypes.func.def(() => {}),
    tabBarPosition: PropTypes.oneOf(['left', 'right', 'top', 'bottom']).def('left'),
    prefixCls: PropTypes.string.def(''),
    scrollAnimated: PropTypes.bool.def(true),
    navWrapper: PropTypes.func.def(arg => arg),
    prevIcon: PropTypes.any,
    nextIcon: PropTypes.any,
  },

  data() {
    this.offset = 0;
    this.prevProps = { ...this.$props };
    return {
      next: false,
      prev: false,
    };
  },
  watch: {
    tabBarPosition() {
      this.tabBarPositionChange = true;
      this.$nextTick(() => {
        this.setOffset(0);
      });
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.updatedCal();
      this.debouncedResize = debounce(() => {
        this.setNextPrev();
        this.scrollToActiveTab();
      }, 200);
      this.resizeEvent = addDOMEventListener(window, 'resize', this.debouncedResize);
    });
  },

  updated() {
    this.$nextTick(() => {
      this.updatedCal(this.prevProps);
      this.prevProps = { ...this.$props };
    });
  },

  beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedResize && this.debouncedResize.cancel) {
      this.debouncedResize.cancel();
    }
  },
  methods: {
    updatedCal(prevProps) {
      const props = this.$props;
      if (prevProps && prevProps.tabBarPosition !== props.tabBarPosition) {
        this.setOffset(0);
        return;
      }
      // wait next, prev show hide
      /* eslint react/no-did-update-set-state:0 */
      if (this.isNextPrevShown(this.$data) !== this.isNextPrevShown(this.setNextPrev())) {
        this.$forceUpdate();
        this.$nextTick(() => {
          this.scrollToActiveTab();
        });
      } else if (!prevProps || props.activeKey !== prevProps.activeKey) {
        // can not use props.activeKey
        this.scrollToActiveTab();
      }
    },
    setNextPrev() {
      const navNode = this.$props.getRef('nav');
      const navTabsContainer = this.$props.getRef('navTabsContainer');
      const navNodeWH = this.getScrollWH(navTabsContainer || navNode);
      // Add 1px to fix `offsetWidth` with decimal in Chrome not correct handle
      // https://github.com/ant-design/ant-design/issues/13423
      const containerWH = this.getOffsetWH(this.$props.getRef('container')) + 1;
      const navWrapNodeWH = this.getOffsetWH(this.$props.getRef('navWrap'));
      let { offset } = this;
      const minOffset = containerWH - navNodeWH;
      let { next, prev } = this;
      if (minOffset >= 0) {
        next = false;
        this.setOffset(0, false);
        offset = 0;
      } else if (minOffset < offset) {
        next = true;
      } else {
        next = false;
        // Fix https://github.com/ant-design/ant-design/issues/8861
        // Test with container offset which is stable
        // and set the offset of the nav wrap node
        const realOffset = navWrapNodeWH - navNodeWH;
        this.setOffset(realOffset, false);
        offset = realOffset;
      }

      if (offset < 0) {
        prev = true;
      } else {
        prev = false;
      }

      this.setNext(next);
      this.setPrev(prev);
      return {
        next,
        prev,
      };
    },

    getOffsetWH(node) {
      const tabBarPosition = this.$props.tabBarPosition;
      let prop = 'offsetWidth';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'offsetHeight';
      }
      return node[prop];
    },

    getScrollWH(node) {
      const tabBarPosition = this.tabBarPosition;
      let prop = 'scrollWidth';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'scrollHeight';
      }
      return node[prop];
    },

    getOffsetLT(node) {
      const tabBarPosition = this.$props.tabBarPosition;
      let prop = 'left';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'top';
      }
      return node.getBoundingClientRect()[prop];
    },

    setOffset(offset, checkNextPrev = true) {
      const target = Math.min(0, offset);
      if (this.offset !== target) {
        this.offset = target;
        let navOffset = {};
        const tabBarPosition = this.$props.tabBarPosition;
        const navStyle = this.$props.getRef('nav').style;
        const transformSupported = isTransformSupported(navStyle);
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
          if (transformSupported) {
            navOffset = {
              value: `translate3d(0,${target}px,0)`,
            };
          } else {
            navOffset = {
              name: 'top',
              value: `${target}px`,
            };
          }
        } else if (transformSupported) {
          navOffset = {
            value: `translate3d(${target}px,0,0)`,
          };
        } else {
          navOffset = {
            name: 'left',
            value: `${target}px`,
          };
        }
        if (transformSupported) {
          setTransform(navStyle, navOffset.value);
        } else {
          navStyle[navOffset.name] = navOffset.value;
        }
        if (checkNextPrev) {
          this.setNextPrev();
        }
      }
    },

    setPrev(v) {
      if (this.prev !== v) {
        this.prev = v;
      }
    },

    setNext(v) {
      if (!v) {
        // debugger
      }
      if (this.next !== v) {
        this.next = v;
      }
    },

    isNextPrevShown(state) {
      if (state) {
        return state.next || state.prev;
      }
      return this.next || this.prev;
    },

    prevTransitionEnd(e) {
      if (e.propertyName !== 'opacity') {
        return;
      }
      const container = this.$props.getRef('container');
      this.scrollToActiveTab({
        target: container,
        currentTarget: container,
      });
    },

    scrollToActiveTab(e) {
      const activeTab = this.$props.getRef('activeTab');
      const navWrap = this.$props.getRef('navWrap');
      if ((e && e.target !== e.currentTarget) || !activeTab) {
        return;
      }

      // when not scrollable or enter scrollable first time, don't emit scrolling
      const needToSroll = this.isNextPrevShown() && this.lastNextPrevShown;
      this.lastNextPrevShown = this.isNextPrevShown();
      if (!needToSroll) {
        return;
      }

      const activeTabWH = this.getScrollWH(activeTab);
      const navWrapNodeWH = this.getOffsetWH(navWrap);
      let { offset } = this;
      const wrapOffset = this.getOffsetLT(navWrap);
      const activeTabOffset = this.getOffsetLT(activeTab);
      if (wrapOffset > activeTabOffset) {
        offset += wrapOffset - activeTabOffset;
        this.setOffset(offset);
      } else if (wrapOffset + navWrapNodeWH < activeTabOffset + activeTabWH) {
        offset -= activeTabOffset + activeTabWH - (wrapOffset + navWrapNodeWH);
        this.setOffset(offset);
      }
    },

    prevClick(e) {
      this.__emit('prevClick', e);
      const navWrapNode = this.$props.getRef('navWrap');
      const navWrapNodeWH = this.getOffsetWH(navWrapNode);
      const { offset } = this;
      this.setOffset(offset + navWrapNodeWH);
    },

    nextClick() {
      // this.__emit('nextClick', e)
      const navWrapNode = this.$props.getRef('navWrap');
      const navWrapNodeWH = this.getOffsetWH(navWrapNode);
      const { offset } = this;
      this.setOffset(offset - navWrapNodeWH);
    },
  },
  render() {
    const { next, prev } = this;
    const { prefixCls, scrollAnimated, navWrapper } = this.$props;
    const prevIcon = getComponentFromProp(this, 'prevIcon');
    const nextIcon = getComponentFromProp(this, 'nextIcon');
    const showNextPrev = prev || next;

    const prevButton = (
      <span
        onClick={prev ? this.prevClick : noop}
        unselectable="unselectable"
        class={{
          [`${prefixCls}-tab-prev`]: 1,
          [`${prefixCls}-tab-btn-disabled`]: !prev,
          [`${prefixCls}-tab-arrow-show`]: showNextPrev,
        }}
        onTransitionend={this.prevTransitionEnd}
      >
        {prevIcon || <span class={`${prefixCls}-tab-prev-icon`} />}
      </span>
    );

    const nextButton = (
      <span
        onClick={next ? this.nextClick : noop}
        unselectable="unselectable"
        class={{
          [`${prefixCls}-tab-next`]: 1,
          [`${prefixCls}-tab-btn-disabled`]: !next,
          [`${prefixCls}-tab-arrow-show`]: showNextPrev,
        }}
      >
        {nextIcon || <span class={`${prefixCls}-tab-next-icon`} />}
      </span>
    );

    const navClassName = `${prefixCls}-nav`;
    const navClasses = {
      [navClassName]: true,
      [scrollAnimated ? `${navClassName}-animated` : `${navClassName}-no-animated`]: true,
    };

    return (
      <div
        class={{
          [`${prefixCls}-nav-container`]: 1,
          [`${prefixCls}-nav-container-scrolling`]: showNextPrev,
        }}
        key="container"
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.saveRef('container'),
            },
          ],
        }}
      >
        {prevButton}
        {nextButton}
        <div
          class={`${prefixCls}-nav-wrap`}
          {...{
            directives: [
              {
                name: 'ant-ref',
                value: this.saveRef('navWrap'),
              },
            ],
          }}
        >
          <div class={`${prefixCls}-nav-scroll`}>
            <div
              class={navClasses}
              {...{
                directives: [
                  {
                    name: 'ant-ref',
                    value: this.saveRef('nav'),
                  },
                ],
              }}
            >
              {navWrapper(this.$slots.default)}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
