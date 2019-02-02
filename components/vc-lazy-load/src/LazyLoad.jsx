import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import addEventListener from '../../_util/Dom/addEventListener';
import { initDefaultProps } from '../../_util/props-util';
import warning from '../../_util/warning';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import parentScroll from './utils/parentScroll';
import inViewport from './utils/inViewport';

const lazyLoadProps = {
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
  _propsSymbol: PropTypes.any,
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
    throttle: 250,
  }),
  data() {
    if (this.throttle > 0) {
      if (this.debounce) {
        this.lazyLoadHandler = debounce(this.lazyLoadHandler, this.throttle);
      } else {
        this.lazyLoadHandler = throttle(this.lazyLoadHandler, this.throttle);
      }
    }
    return {
      visible: false,
    };
  },
  watch: {
    _propsSymbol() {
      if (!this.visible) {
        this.lazyLoadHandler();
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this._mounted = true;
      const eventNode = this.getEventNode();

      this.lazyLoadHandler();

      if (this.lazyLoadHandler.flush) {
        this.lazyLoadHandler.flush();
      }
      this.resizeHander = addEventListener(window, 'resize', this.lazyLoadHandler);
      this.scrollHander = addEventListener(eventNode, 'scroll', this.lazyLoadHandler);
    });
  },
  beforeDestroy() {
    this._mounted = false;
    if (this.lazyLoadHandler.cancel) {
      this.lazyLoadHandler.cancel();
    }

    this.detachListeners();
  },
  methods: {
    getEventNode() {
      return parentScroll(this.$el);
    },
    getOffset() {
      const {
        offset,
        offsetVertical,
        offsetHorizontal,
        offsetTop,
        offsetBottom,
        offsetLeft,
        offsetRight,
        threshold,
      } = this.$props;

      const _offsetAll = threshold || offset;
      const _offsetVertical = offsetVertical || _offsetAll;
      const _offsetHorizontal = offsetHorizontal || _offsetAll;

      return {
        top: offsetTop || _offsetVertical,
        bottom: offsetBottom || _offsetVertical,
        left: offsetLeft || _offsetHorizontal,
        right: offsetRight || _offsetHorizontal,
      };
    },
    lazyLoadHandler() {
      if (!this._mounted) {
        return;
      }
      const offset = this.getOffset();
      const node = this.$el;
      const eventNode = this.getEventNode();

      if (inViewport(node, eventNode, offset)) {
        this.setState({ visible: true }, () => {
          this.__emit('contentVisible');
        });
        this.detachListeners();
      }
    },
    detachListeners() {
      this.resizeHander && this.resizeHander.remove();
      this.scrollHander && this.scrollHander.remove();
    },
  },
  render(createElement) {
    const children = this.$slots.default;
    if (children.length !== 1) {
      warning(false, 'lazyLoad组件只能包含一个子元素');
      return null;
    }
    const { height, width, elementType } = this.$props;
    const { visible } = this;

    const elStyles = {
      height: typeof height === 'number' ? height + 'px' : height,
      width: typeof width === 'number' ? width + 'px' : width,
    };
    const elClasses = {
      LazyLoad: true,
      'is-visible': visible,
    };

    return createElement(
      elementType,
      {
        class: elClasses,
        style: elStyles,
      },
      [visible ? children[0] : null],
    );
  },
};
