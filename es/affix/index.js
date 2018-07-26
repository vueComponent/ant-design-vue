import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import addEventListener from '../_util/Dom/addEventListener';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import omit from 'omit.js';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';

function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 };
}

function getOffset(element, target) {
  var elemRect = element.getBoundingClientRect();
  var targetRect = getTargetRect(target);

  var scrollTop = getScroll(target, true);
  var scrollLeft = getScroll(target, false);

  var docElem = window.document.body;
  var clientTop = docElem.clientTop || 0;
  var clientLeft = docElem.clientLeft || 0;

  return {
    top: elemRect.top - targetRect.top + scrollTop - clientTop,
    left: elemRect.left - targetRect.left + scrollLeft - clientLeft,
    width: elemRect.width,
    height: elemRect.height
  };
}

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
var AffixProps = {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: PropTypes.number,
  offset: PropTypes.number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: PropTypes.number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: PropTypes.func,
  prefixCls: PropTypes.string
};

export default {
  name: 'AAffix',
  props: AffixProps,
  mixins: [BaseMixin],
  data: function data() {
    this.events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
    this.eventHandlers = {};
    return {
      affixStyle: undefined,
      placeholderStyle: undefined
    };
  },
  beforeMount: function beforeMount() {
    this.updatePosition = throttleByAnimationFrame(this.updatePosition);
  },
  mounted: function mounted() {
    var _this = this;

    var target = this.target || getDefaultTarget;
    // Wait for parent component ref has its value
    this.timeout = setTimeout(function () {
      _this.setTargetEventListeners(target);
    });
  },

  watch: {
    target: function target(val) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.clearEventListeners();
        _this2.setTargetEventListeners(val);
        // Mock Event object.
        _this2.updatePosition({});
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.clearEventListeners();
    clearTimeout(this.timeout);
    this.updatePosition.cancel();
  },

  methods: {
    setAffixStyle: function setAffixStyle(e, affixStyle) {
      var _this3 = this;

      var _target = this.target,
          target = _target === undefined ? getDefaultTarget : _target;

      var originalAffixStyle = this.affixStyle;
      var isWindow = target() === window;
      if (e.type === 'scroll' && originalAffixStyle && affixStyle && isWindow) {
        return;
      }
      if (shallowequal(affixStyle, originalAffixStyle)) {
        return;
      }
      this.setState({ affixStyle: affixStyle }, function () {
        var affixed = !!_this3.affixStyle;
        if (affixStyle && !originalAffixStyle || !affixStyle && originalAffixStyle) {
          _this3.$emit('change', affixed);
        }
      });
    },
    setPlaceholderStyle: function setPlaceholderStyle(placeholderStyle) {
      var originalPlaceholderStyle = this.placeholderStyle;
      if (shallowequal(placeholderStyle, originalPlaceholderStyle)) {
        return;
      }
      this.setState({ placeholderStyle: placeholderStyle });
    },
    syncPlaceholderStyle: function syncPlaceholderStyle(e) {
      var affixStyle = this.affixStyle;

      if (!affixStyle) {
        return;
      }
      this.$refs.placeholderNode.style.cssText = '';
      this.setAffixStyle(e, _extends({}, affixStyle, {
        width: this.$refs.placeholderNode.offsetWidth + 'px'
      }));
      this.setPlaceholderStyle({
        width: this.$refs.placeholderNode.offsetWidth + 'px'
      });
    },
    updatePosition: function updatePosition(e) {
      var offsetTop = this.offsetTop;
      var offsetBottom = this.offsetBottom,
          offset = this.offset,
          _target2 = this.target,
          target = _target2 === undefined ? getDefaultTarget : _target2;

      var targetNode = target();

      // Backwards support
      offsetTop = offsetTop || offset;
      var scrollTop = getScroll(targetNode, true);
      var affixNode = this.$el;
      var elemOffset = getOffset(affixNode, targetNode);
      var elemSize = {
        width: this.$refs.fixedNode.offsetWidth,
        height: this.$refs.fixedNode.offsetHeight
      };

      var offsetMode = {
        top: false,
        bottom: false
        // Default to `offsetTop=0`.
      };if (typeof offsetTop !== 'number' && typeof offsetBottom !== 'number') {
        offsetMode.top = true;
        offsetTop = 0;
      } else {
        offsetMode.top = typeof offsetTop === 'number';
        offsetMode.bottom = typeof offsetBottom === 'number';
      }

      var targetRect = getTargetRect(targetNode);
      var targetInnerHeight = targetNode.innerHeight || targetNode.clientHeight;
      if (scrollTop > elemOffset.top - offsetTop && offsetMode.top) {
        // Fixed Top
        var width = elemOffset.width + 'px';
        var top = targetRect.top + offsetTop + 'px';
        this.setAffixStyle(e, {
          position: 'fixed',
          top: top,
          left: targetRect.left + elemOffset.left + 'px',
          width: width
        });
        this.setPlaceholderStyle({
          width: width,
          height: elemSize.height + 'px'
        });
      } else if (scrollTop < elemOffset.top + elemSize.height + offsetBottom - targetInnerHeight && offsetMode.bottom) {
        // Fixed Bottom
        var targetBottomOffet = targetNode === window ? 0 : window.innerHeight - targetRect.bottom;
        var _width = elemOffset.width + 'px';
        this.setAffixStyle(e, {
          position: 'fixed',
          bottom: targetBottomOffet + offsetBottom + 'px',
          left: targetRect.left + elemOffset.left + 'px',
          width: _width
        });
        this.setPlaceholderStyle({
          width: _width,
          height: elemOffset.height + 'px'
        });
      } else {
        var affixStyle = this.affixStyle;

        if (e.type === 'resize' && affixStyle && affixStyle.position === 'fixed' && affixNode.offsetWidth) {
          this.setAffixStyle(e, _extends({}, affixStyle, { width: affixNode.offsetWidth + 'px' }));
        } else {
          this.setAffixStyle(e, null);
        }
        this.setPlaceholderStyle(null);
      }
      if (e.type === 'resize') {
        this.syncPlaceholderStyle(e);
      }
    },
    setTargetEventListeners: function setTargetEventListeners(getTarget) {
      var _this4 = this;

      var target = getTarget();
      if (!target) {
        return;
      }
      this.clearEventListeners();

      this.events.forEach(function (eventName) {
        _this4.eventHandlers[eventName] = addEventListener(target, eventName, _this4.updatePosition);
      });
    },
    clearEventListeners: function clearEventListeners() {
      var _this5 = this;

      this.events.forEach(function (eventName) {
        var handler = _this5.eventHandlers[eventName];
        if (handler && handler.remove) {
          handler.remove();
        }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        affixStyle = this.affixStyle,
        placeholderStyle = this.placeholderStyle,
        $slots = this.$slots,
        $props = this.$props;

    var className = classNames(_defineProperty({}, prefixCls || 'ant-affix', affixStyle));

    var props = {
      attrs: omit($props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target'])
    };
    return h(
      'div',
      _mergeJSXProps([props, { style: placeholderStyle, ref: 'placeholderNode' }]),
      [h(
        'div',
        { 'class': className, ref: 'fixedNode', style: affixStyle },
        [$slots['default']]
      )]
    );
  }
};