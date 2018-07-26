'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _utils = require('./utils');

var _addDomEventListener = require('add-dom-event-listener');

var _addDomEventListener2 = _interopRequireDefault(_addDomEventListener);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  props: {
    scrollAnimated: { type: Boolean, 'default': true }
  },

  data: function data() {
    this.offset = 0;
    return {
      next: false,
      prev: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.updatedCal();
      _this.debouncedResize = (0, _debounce2['default'])(function () {
        _this.setNextPrev();
        _this.scrollToActiveTab();
      }, 200);
      _this.resizeEvent = (0, _addDomEventListener2['default'])(window, 'resize', _this.debouncedResize);
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.updatedCal();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedResize && this.debouncedResize.cancel) {
      this.debouncedResize.cancel();
    }
  },

  watch: {
    tabBarPosition: function tabBarPosition(val) {
      var _this3 = this;

      this.tabBarPositionChange = true;
      this.$nextTick(function () {
        _this3.setOffset(0);
      });
    }
  },
  methods: {
    updatedCal: function updatedCal() {
      var _this4 = this;

      if (this.tabBarPositionChange) {
        this.tabBarPositionChange = false;
        return;
      }
      this.setNextPrev();
      this.$nextTick(function () {
        _this4.scrollToActiveTab();
      });
    },
    setNextPrev: function setNextPrev() {
      var navNode = this.$refs.nav;
      var navNodeWH = this.getScrollWH(navNode);
      var containerWH = this.getOffsetWH(this.$refs.container);
      var navWrapNodeWH = this.getOffsetWH(this.$refs.navWrap);
      var offset = this.offset;

      var minOffset = containerWH - navNodeWH;
      var next = this.next,
          prev = this.prev;

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
        var realOffset = navWrapNodeWH - navNodeWH;
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
        next: next,
        prev: prev
      };
    },
    getOffsetWH: function getOffsetWH(node) {
      var tabBarPosition = this.$props.tabBarPosition;
      var prop = 'offsetWidth';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'offsetHeight';
      }
      return node[prop];
    },
    getScrollWH: function getScrollWH(node) {
      var tabBarPosition = this.tabBarPosition;
      var prop = 'scrollWidth';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'scrollHeight';
      }
      return node[prop];
    },
    getOffsetLT: function getOffsetLT(node) {
      var tabBarPosition = this.$props.tabBarPosition;
      var prop = 'left';
      if (tabBarPosition === 'left' || tabBarPosition === 'right') {
        prop = 'top';
      }
      return node.getBoundingClientRect()[prop];
    },
    setOffset: function setOffset(offset) {
      var checkNextPrev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var target = Math.min(0, offset);
      if (this.offset !== target) {
        this.offset = target;
        var navOffset = {};
        var tabBarPosition = this.$props.tabBarPosition;
        var navStyle = this.$refs.nav.style;
        var transformSupported = (0, _utils.isTransformSupported)(navStyle);
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
          if (transformSupported) {
            navOffset = {
              value: 'translate3d(0,' + target + 'px,0)'
            };
          } else {
            navOffset = {
              name: 'top',
              value: target + 'px'
            };
          }
        } else {
          if (transformSupported) {
            navOffset = {
              value: 'translate3d(' + target + 'px,0,0)'
            };
          } else {
            navOffset = {
              name: 'left',
              value: target + 'px'
            };
          }
        }
        if (transformSupported) {
          (0, _utils.setTransform)(navStyle, navOffset.value);
        } else {
          navStyle[navOffset.name] = navOffset.value;
        }
        if (checkNextPrev) {
          this.setNextPrev();
        }
      }
    },
    setPrev: function setPrev(v) {
      if (this.prev !== v) {
        this.prev = v;
      }
    },
    setNext: function setNext(v) {
      if (this.next !== v) {
        this.next = v;
      }
    },
    isNextPrevShown: function isNextPrevShown(state) {
      if (state) {
        return state.next || state.prev;
      }
      return this.next || this.prev;
    },
    prevTransitionEnd: function prevTransitionEnd(e) {
      if (e.propertyName !== 'opacity') {
        return;
      }
      var container = this.container;

      this.scrollToActiveTab({
        target: container,
        currentTarget: container
      });
    },
    scrollToActiveTab: function scrollToActiveTab(e) {
      var activeTab = this.activeTab;

      var navWrap = this.$refs.navWrap;
      if (e && e.target !== e.currentTarget || !activeTab) {
        return;
      }

      // when not scrollable or enter scrollable first time, don't emit scrolling
      var needToSroll = this.isNextPrevShown() && this.lastNextPrevShown;
      this.lastNextPrevShown = this.isNextPrevShown();
      if (!needToSroll) {
        return;
      }

      var activeTabWH = this.getScrollWH(activeTab);
      var navWrapNodeWH = this.getOffsetWH(navWrap);
      var offset = this.offset;

      var wrapOffset = this.getOffsetLT(navWrap);
      var activeTabOffset = this.getOffsetLT(activeTab);
      if (wrapOffset > activeTabOffset) {
        offset += wrapOffset - activeTabOffset;
        this.setOffset(offset);
      } else if (wrapOffset + navWrapNodeWH < activeTabOffset + activeTabWH) {
        offset -= activeTabOffset + activeTabWH - (wrapOffset + navWrapNodeWH);
        this.setOffset(offset);
      }
    },
    prevClick: function prevClick(e) {
      this.__emit('prevClick', e);
      var navWrapNode = this.$refs.navWrap;
      var navWrapNodeWH = this.getOffsetWH(navWrapNode);
      var offset = this.offset;

      this.setOffset(offset + navWrapNodeWH);
    },
    nextClick: function nextClick(e) {
      this.__emit('nextClick', e);
      var navWrapNode = this.$refs.navWrap;
      var navWrapNodeWH = this.getOffsetWH(navWrapNode);
      var offset = this.offset;

      this.setOffset(offset - navWrapNodeWH);
    },
    getScrollBarNode: function getScrollBarNode(content) {
      var _ref, _ref2, _navClasses, _ref3;

      var h = this.$createElement;
      var next = this.next,
          prev = this.prev;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          scrollAnimated = _$props.scrollAnimated;

      var showNextPrev = prev || next;

      var prevButton = h(
        'span',
        {
          on: {
            'click': prev ? this.prevClick : noop,
            'transitionEnd': this.prevTransitionEnd
          },
          attrs: {
            unselectable: 'unselectable'
          },
          'class': (_ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls + '-tab-prev', 1), (0, _defineProperty3['default'])(_ref, prefixCls + '-tab-btn-disabled', !prev), (0, _defineProperty3['default'])(_ref, prefixCls + '-tab-arrow-show', showNextPrev), _ref)
        },
        [h('span', { 'class': prefixCls + '-tab-prev-icon' })]
      );

      var nextButton = h(
        'span',
        {
          on: {
            'click': next ? this.nextClick : noop
          },
          attrs: {
            unselectable: 'unselectable'
          },
          'class': (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, prefixCls + '-tab-next', 1), (0, _defineProperty3['default'])(_ref2, prefixCls + '-tab-btn-disabled', !next), (0, _defineProperty3['default'])(_ref2, prefixCls + '-tab-arrow-show', showNextPrev), _ref2)
        },
        [h('span', { 'class': prefixCls + '-tab-next-icon' })]
      );

      var navClassName = prefixCls + '-nav';
      var navClasses = (_navClasses = {}, (0, _defineProperty3['default'])(_navClasses, navClassName, true), (0, _defineProperty3['default'])(_navClasses, scrollAnimated ? navClassName + '-animated' : navClassName + '-no-animated', true), _navClasses);

      return h(
        'div',
        {
          'class': (_ref3 = {}, (0, _defineProperty3['default'])(_ref3, prefixCls + '-nav-container', 1), (0, _defineProperty3['default'])(_ref3, prefixCls + '-nav-container-scrolling', showNextPrev), _ref3),
          key: 'container',
          ref: 'container'
        },
        [prevButton, nextButton, h(
          'div',
          { 'class': prefixCls + '-nav-wrap', ref: 'navWrap' },
          [h(
            'div',
            { 'class': prefixCls + '-nav-scroll' },
            [h(
              'div',
              { 'class': navClasses, ref: 'nav' },
              [content]
            )]
          )]
        )]
      );
    }
  }
};
module.exports = exports['default'];