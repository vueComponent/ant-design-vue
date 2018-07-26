'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _getScroll = require('../_util/getScroll');

var _getScroll2 = _interopRequireDefault(_getScroll);

var _getRequestAnimationFrame = require('../_util/getRequestAnimationFrame');

var _getRequestAnimationFrame2 = _interopRequireDefault(_getRequestAnimationFrame);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var reqAnimFrame = (0, _getRequestAnimationFrame2['default'])();

var easeInOutCubic = function easeInOutCubic(t, b, c, d) {
  var cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  } else {
    return cc / 2 * ((t -= 2) * t * t + 2) + b;
  }
};

function getDefaultTarget() {
  return window;
}

var BackTopProps = {
  visibilityHeight: _vueTypes2['default'].number,
  // onClick?: React.MouseEventHandler<any>;
  target: _vueTypes2['default'].func,
  prefixCls: _vueTypes2['default'].string
};

exports['default'] = {
  name: 'ABackTop',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends3['default'])({}, BackTopProps, {
    visibilityHeight: _vueTypes2['default'].number.def(400)
  }),
  data: function data() {
    this.scrollEvent = null;
    return {
      visible: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var getTarget = _this.target || getDefaultTarget;
      _this.scrollEvent = (0, _addEventListener2['default'])(getTarget(), 'scroll', _this.handleScroll);
      _this.handleScroll();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },

  methods: {
    getCurrentScrollTop: function getCurrentScrollTop() {
      var getTarget = this.target || getDefaultTarget;
      var targetNode = getTarget();
      if (targetNode === window) {
        return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
      }
      return targetNode.scrollTop;
    },
    scrollToTop: function scrollToTop(e) {
      var _this2 = this;

      var scrollTop = this.getCurrentScrollTop();
      var startTime = Date.now();
      var frameFunc = function frameFunc() {
        var timestamp = Date.now();
        var time = timestamp - startTime;
        _this2.setScrollTop(easeInOutCubic(time, scrollTop, 0, 450));
        if (time < 450) {
          reqAnimFrame(frameFunc);
        }
      };
      reqAnimFrame(frameFunc);
      this.$emit('click', e);
    },
    setScrollTop: function setScrollTop(value) {
      var getTarget = this.target || getDefaultTarget;
      var targetNode = getTarget();
      if (targetNode === window) {
        document.body.scrollTop = value;
        document.documentElement.scrollTop = value;
      } else {
        targetNode.scrollTop = value;
      }
    },
    handleScroll: function handleScroll() {
      var visibilityHeight = this.visibilityHeight,
          _target = this.target,
          target = _target === undefined ? getDefaultTarget : _target;

      var scrollTop = (0, _getScroll2['default'])(target(), true);
      this.setState({
        visible: scrollTop > visibilityHeight
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _prefixCls = this.prefixCls,
        prefixCls = _prefixCls === undefined ? 'ant-back-top' : _prefixCls,
        $slots = this.$slots,
        $listeners = this.$listeners;


    var defaultElement = h(
      'div',
      { 'class': prefixCls + '-content' },
      [h('div', { 'class': prefixCls + '-icon' })]
    );
    var divProps = {
      on: (0, _extends3['default'])({}, $listeners, {
        click: this.scrollToTop
      }),
      'class': prefixCls
    };

    var backTopBtn = this.visible ? h(
      'div',
      divProps,
      [$slots['default'] || defaultElement]
    ) : null;
    var transitionProps = (0, _getTransitionProps2['default'])('fade');
    return h(
      'transition',
      transitionProps,
      [backTopBtn]
    );
  }
};
module.exports = exports['default'];