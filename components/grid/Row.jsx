
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import { cloneElement } from '../_util/vnode'
import { isEmptyElement, getStyle, getOptionProps } from '../_util/props-util'
// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire = null
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = (mediaQuery) => {
    return {
      media: mediaQuery,
      matches: false,
      addListener () {
      },
      removeListener () {
      },
    }
  }
  window.matchMedia = window.matchMedia || matchMediaPolyfill
  enquire = require('enquire.js')
}

const BreakpointMap = PropTypes.shape({
  xs: PropTypes.string,
  sm: PropTypes.string,
  md: PropTypes.string,
  lg: PropTypes.string,
  xl: PropTypes.string,
  xxl: PropTypes.strin,
}).loose

const RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string,
}

const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

const responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
}

export default {
  name: 'Row',
  mixins: [BaseMixin],
  props: {
    ...RowProps,
    gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]).def(0),
  },
  data () {
    return {
      screens: {},
    }
  },

  mounted () {
    this.$nextTick(() => {
      Object.keys(responsiveMap)
        .map((screen) => enquire.register(responsiveMap[screen], {
          match: () => {
            if (typeof this.gutter !== 'object') {
              return
            }
            this.setState((prevState) => ({
              screens: {
                ...prevState.screens,
                [screen]: true,
              },
            }))
          },
          unmatch: () => {
            if (typeof this.gutter !== 'object') {
              return
            }
            this.setState((prevState) => ({
              screens: {
                ...prevState.screens,
                [screen]: false,
              },
            }))
          },
          // Keep a empty destory to avoid triggering unmatch when unregister
          destroy () {},
        },
        ))
    })
  },
  beforeDestroy () {
    Object.keys(responsiveMap)
      .map((screen) => enquire.unregister(responsiveMap[screen]))
  },
  methods: {
    getGutter () {
      const { gutter } = this
      if (typeof gutter === 'object') {
        for (let i = 0; i <= responsiveArray.length; i++) {
          const breakpoint = responsiveArray[i]
          if (this.state.screens[breakpoint] && gutter[breakpoint] !== undefined) {
            return gutter[breakpoint]
          }
        }
      }
      return gutter
    },
  },

  render () {
    const {
      type, justify, align,
      prefixCls = 'ant-row', $slots,
    } = this
    const gutter = this.getGutter()
    const classes = {
      [prefixCls]: !type,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-${justify}`]: type && justify,
      [`${prefixCls}-${type}-${align}`]: type && align,
    }
    const rowStyle = gutter > 0 ? {
      marginLeft: `${gutter / -2}px`,
      marginRight: `${gutter / -2}px`,
    } : {}
    const cols = ($slots.default || []).map((col) => {
      if (isEmptyElement(col)) {
        return null
      }
      if (getOptionProps(col) && gutter > 0) {
        return cloneElement(col, {
          style: {
            paddingLeft: `${gutter / 2}px`,
            paddingRight: `${gutter / 2}px`,
            ...getStyle(col, true),
          },
        })
      }
      return col
    })
    return <div class={classes} style={rowStyle}>{cols}</div>
  },
}

