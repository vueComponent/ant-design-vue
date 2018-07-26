import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import addEventListener from '../../_util/Dom/addEventListener';
import { initDefaultProps } from '../../_util/props-util';
import warning from '../../_util/warning';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import parentScroll from './utils/parentScroll';
import inViewport from './utils/inViewport';

var lazyLoadProps = {
  debounce: PropTypes.bool,
  elementType: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  offset: PropTypes.number,
  offsetBottom: PropTypes.number,
  offsetHorizontal: PropTypes.number,
  offsetLeft: PropTypes.number,
  offsetRight: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetVertical: PropTypes.number,
  threshold: PropTypes.number,
  throttle: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onContentVisible: PropTypes.func
};

export default {
  name: 'LazyLoad',
  mixins: [BaseMixin],
  props: initDefaultProps(lazyLoadProps, {
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
        this.lazyLoadHandler = debounce(this.lazyLoadHandler, this.throttle);
      } else {
        this.lazyLoadHandler = throttle(this.lazyLoadHandler, this.throttle);
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

      _this.resizeHander = addEventListener(window, 'resize', _this.lazyLoadHandler);
      _this.scrollHander = addEventListener(eventNode, 'scroll', _this.lazyLoadHandler);
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
      return parentScroll(this.$el);
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

      if (inViewport(node, eventNode, offset)) {
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
      warning(false, 'lazyLoad组件只能包含一个子元素');
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