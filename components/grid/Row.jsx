import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire = null;
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = mediaQuery => {
    return {
      media: mediaQuery,
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
  enquire = require('enquire.js');
}

const BreakpointMap = PropTypes.shape({
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xxl: PropTypes.number,
}).loose;

const RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string,
};

const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

const responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

export default {
  name: 'ARow',
  mixins: [BaseMixin],
  props: {
    ...RowProps,
    gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]).def(0),
  },
  provide() {
    return {
      rowContext: this,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      screens: {},
    };
  },

  mounted() {
    this.$nextTick(() => {
      Object.keys(responsiveMap).map(screen =>
        enquire.register(responsiveMap[screen], {
          match: () => {
            if (typeof this.gutter !== 'object') {
              return;
            }
            this.setState(prevState => ({
              screens: {
                ...prevState.screens,
                [screen]: true,
              },
            }));
          },
          unmatch: () => {
            if (typeof this.gutter !== 'object') {
              return;
            }
            this.setState(prevState => ({
              screens: {
                ...prevState.screens,
                [screen]: false,
              },
            }));
          },
          // Keep a empty destory to avoid triggering unmatch when unregister
          destroy() {},
        }),
      );
    });
  },
  beforeDestroy() {
    Object.keys(responsiveMap).map(screen => enquire.unregister(responsiveMap[screen]));
  },
  methods: {
    getGutter() {
      const { gutter } = this;
      if (typeof gutter === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint = responsiveArray[i];
          if (this.screens[breakpoint] && gutter[breakpoint] !== undefined) {
            return gutter[breakpoint];
          }
        }
      }
      return gutter;
    },
  },

  render() {
    const { type, justify, align, prefixCls: customizePrefixCls, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('row', customizePrefixCls);

    const gutter = this.getGutter();
    const classes = {
      [prefixCls]: !type,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-${justify}`]: type && justify,
      [`${prefixCls}-${type}-${align}`]: type && align,
    };
    const rowStyle =
      gutter > 0
        ? {
            marginLeft: `${gutter / -2}px`,
            marginRight: `${gutter / -2}px`,
          }
        : {};
    return (
      <div class={classes} style={rowStyle}>
        {$slots.default}
      </div>
    );
  },
};
