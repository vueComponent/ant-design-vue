'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _addEventListener = require('../../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _propsUtil = require('../../_util/props-util');

var _warning = require('../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _parentScroll = require('./utils/parentScroll');

var _parentScroll2 = _interopRequireDefault(_parentScroll);

var _inViewport = require('./utils/inViewport');

var _inViewport2 = _interopRequireDefault(_inViewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var lazyLoadProps = {
  debounce: _vueTypes2['default'].bool,
  elementType: _vueTypes2['default'].string,
  height: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  offset: _vueTypes2['default'].number,
  offsetBottom: _vueTypes2['default'].number,
  offsetHorizontal: _vueTypes2['default'].number,
  offsetLeft: _vueTypes2['default'].number,
  offsetRight: _vueTypes2['default'].number,
  offsetTop: _vueTypes2['default'].number,
  offsetVertical: _vueTypes2['default'].number,
  threshold: _vueTypes2['default'].number,
  throttle: _vueTypes2['default'].number,
  width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  onContentVisible: _vueTypes2['default'].func
};

exports['default'] = {
  name: 'LazyLoad',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(lazyLoadProps, {
    elementType: 'div',
    debounce: true,
    offset: 0,
    offsetBottom: 0,
    offsetHorizontal: 0,
    offsetLeft: 0,
    offsetRight: 0,
    offsetTop: 0,
    offsetVertical: 0,
    throttle: 250
  }),
  data: function data() {
    if (this.throttle > 0) {
      if (this.debounce) {
        this.lazyLoadHandler = (0, _debounce2['default'])(this.lazyLoadHandler, this.throttle);
      } else {
        this.lazyLoadHandler = (0, _throttle2['default'])(this.lazyLoadHandler, this.throttle);
      }
    }
    return {
      visible: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this._mounted = true;
      var eventNode = _this.getEventNode();

      _this.lazyLoadHandler();

      if (_this.lazyLoadHandler.flush) {
        _this.lazyLoadHandler.flush();
      }

      _this.resizeHander = (0, _addEventListener2['default'])(window, 'resize', _this.lazyLoadHandler);
      _this.scrollHander = (0, _addEventListener2['default'])(eventNode, 'scroll', _this.lazyLoadHandler);
    });
  },

  watch: {
    visible: function visible(val) {
      if (!val) {
        this.lazyLoadHandler();
      }
    }
  },
  // shouldComponentUpdate (_nextProps, nextState) {
  //   return nextState.visible
  // }
  beforeDestroy: function beforeDestroy() {
    this._mounted = false;
    if (this.lazyLoadHandler.cancel) {
      this.lazyLoadHandler.cancel();
    }

    this.detachListeners();
  },

  methods: {
    getEventNode: function getEventNode() {
      return (0, _parentScroll2['default'])(this.$el);
    },
    getOffset: function getOffset() {
      var _$props = this.$props,
          offset = _$props.offset,
          offsetVertical = _$props.offsetVertical,
          offsetHorizontal = _$props.offsetHorizontal,
          offsetTop = _$props.offsetTop,
          offsetBottom = _$props.offsetBottom,
          offsetLeft = _$props.offsetLeft,
          offsetRight = _$props.offsetRight,
          threshold = _$props.threshold;


      var _offsetAll = threshold || offset;
      var _offsetVertical = offsetVertical || _offsetAll;
      var _offsetHorizontal = offsetHorizontal || _offsetAll;

      return {
        top: offsetTop || _offsetVertical,
        bottom: offsetBottom || _offsetVertical,
        left: offsetLeft || _offsetHorizontal,
        right: offsetRight || _offsetHorizontal
      };
    },
    lazyLoadHandler: function lazyLoadHandler() {
      if (!this._mounted) {
        return;
      }
      var offset = this.getOffset();
      var node = this.$el;
      var eventNode = this.getEventNode();

      if ((0, _inViewport2['default'])(node, eventNode, offset)) {
        var onContentVisible = this.$props.onContentVisible;


        this.setState({ visible: true }, function () {
          if (onContentVisible) {
            onContentVisible();
          }
        });
        this.detachListeners();
      }
    },
    detachListeners: function detachListeners() {
      this.resizeHander && this.resizeHander.remove();
      this.scrollHander && this.scrollHander.remove();
    }
  },
  render: function render(createElement) {
    var children = this.$slots['default'];
    if (children.length !== 1) {
      (0, _warning2['default'])(false, 'lazyLoad组件只能包含一个子元素');
      return null;
    }
    var _$props2 = this.$props,
        height = _$props2.height,
        width = _$props2.width,
        elementType = _$props2.elementType;
    var visible = this.visible;


    var elStyles = {
      height: typeof height === 'number' ? height + 'px' : height,
      width: typeof width === 'number' ? width + 'px' : width
    };
    var elClasses = {
      'LazyLoad': true,
      'is-visible': visible
    };

    return createElement(elementType, {
      'class': elClasses,
      style: elStyles
    }, [visible ? children[0] : null]);
  }
};
module.exports = exports['default'];