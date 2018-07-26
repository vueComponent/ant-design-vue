'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _getScroll = require('../_util/getScroll');

var _getScroll2 = _interopRequireDefault(_getScroll);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _throttleByAnimationFrame = require('../_util/throttleByAnimationFrame');

var _throttleByAnimationFrame2 = _interopRequireDefault(_throttleByAnimationFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 };
}

function getOffset(element, target) {
  var elemRect = element.getBoundingClientRect();
  var targetRect = getTargetRect(target);

  var scrollTop = (0, _getScroll2['default'])(target, true);
  var scrollLeft = (0, _getScroll2['default'])(target, false);

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
  offsetTop: _vueTypes2['default'].number,
  offset: _vueTypes2['default'].number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: _vueTypes2['default'].number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: _vueTypes2['default'].func,
  prefixCls: _vueTypes2['default'].string
};

exports['default'] = {
  name: 'AAffix',
  props: AffixProps,
  mixins: [_BaseMixin2['default']],
  data: function data() {
    this.events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
    this.eventHandlers = {};
    return {
      affixStyle: undefined,
      placeholderStyle: undefined
    };
  },
  beforeMount: function beforeMount() {
    this.updatePosition = (0, _throttleByAnimationFrame2['default'])(this.updatePosition);
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
      if ((0, _shallowequal2['default'])(affixStyle, originalAffixStyle)) {
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
      if ((0, _shallowequal2['default'])(placeholderStyle, originalPlaceholderStyle)) {
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
      this.setAffixStyle(e, (0, _extends3['default'])({}, affixStyle, {
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
      var scrollTop = (0, _getScroll2['default'])(targetNode, true);
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
          this.setAffixStyle(e, (0, _extends3['default'])({}, affixStyle, { width: affixNode.offsetWidth + 'px' }));
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
        _this4.eventHandlers[eventName] = (0, _addEventListener2['default'])(target, eventName, _this4.updatePosition);
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

    var className = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, prefixCls || 'ant-affix', affixStyle));

    var props = {
      attrs: (0, _omit2['default'])($props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target'])
    };
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([props, { style: placeholderStyle, ref: 'placeholderNode' }]),
      [h(
        'div',
        { 'class': className, ref: 'fixedNode', style: affixStyle },
        [$slots['default']]
      )]
    );
  }
};
module.exports = exports['default'];