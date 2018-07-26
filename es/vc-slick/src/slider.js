import _extends from 'babel-runtime/helpers/extends';
import json2mq from 'json2mq';
import Vue from 'vue';
import antRefDirective from '../../_util/antRefDirective';
import BaseMixin from '../../_util/BaseMixin';
import { cloneElement } from '../../_util/vnode';
import { getStyle } from '../../_util/props-util';
import InnerSlider from './inner-slider';
import defaultProps from './default-props';
import { canUseDOM } from './utils/innerSliderUtils';
var enquire = canUseDOM() && require('enquire.js');

Vue.use(antRefDirective);
export default {
  props: _extends({}, defaultProps),
  mixins: [BaseMixin],
  data: function data() {
    this._responsiveMediaHandlers = [];
    return {
      breakpoint: null
    };
  },

  methods: {
    innerSliderRefHandler: function innerSliderRefHandler(ref) {
      this.innerSlider = ref && ref.componentInstance;
    },
    media: function media(query, handler) {
      // javascript handler for  css media query
      enquire.register(query, handler);
      this._responsiveMediaHandlers.push({ query: query, handler: handler });
    },
    slickPrev: function slickPrev() {
      this.innerSlider.slickPrev();
    },
    slickNext: function slickNext() {
      this.innerSlider.slickNext();
    },
    slickGoTo: function slickGoTo(slide) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.innerSlider.slickGoTo(slide, dontAnimate);
    },
    slickPause: function slickPause() {
      this.innerSlider.pause('paused');
    },
    slickPlay: function slickPlay() {
      this.innerSlider.handleAutoPlay('play');
    }
  },
  // handles responsive breakpoints
  beforeMount: function beforeMount() {
    var _this = this;

    // performance monitoring
    // if (process.env.NODE_ENV !== 'production') {
    // const { whyDidYouUpdate } = require('why-did-you-update')
    // whyDidYouUpdate(React)
    // }
    if (this.responsive) {
      var breakpoints = this.responsive.map(function (breakpt) {
        return breakpt.breakpoint;
      });
      // sort them in increasing order of their numerical value
      breakpoints.sort(function (x, y) {
        return x - y;
      });

      breakpoints.forEach(function (breakpoint, index) {
        // media query for each breakpoint
        var bQuery = void 0;
        if (index === 0) {
          bQuery = json2mq({ minWidth: 0, maxWidth: breakpoint });
        } else {
          bQuery = json2mq({
            minWidth: breakpoints[index - 1] + 1,
            maxWidth: breakpoint
          });
        }
        // when not using server side rendering
        canUseDOM() && _this.media(bQuery, function () {
          _this.setState({ breakpoint: breakpoint });
        });
      });

      // Register media query for full screen. Need to support resize from small to large
      // convert javascript object to media query string
      var query = json2mq({ minWidth: breakpoints.slice(-1)[0] });

      canUseDOM() && this.media(query, function () {
        _this.setState({ breakpoint: null });
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this._responsiveMediaHandlers.forEach(function (obj) {
      enquire.unregister(obj.query, obj.handler);
    });
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var settings = void 0;
    var newProps = void 0;
    if (this.breakpoint) {
      newProps = this.responsive.filter(function (resp) {
        return resp.breakpoint === _this2.breakpoint;
      });
      settings = newProps[0].settings === 'unslick' ? 'unslick' : _extends({}, this.$props, newProps[0].settings);
    } else {
      settings = _extends({}, this.$props);
    }

    // force scrolling by one if centerMode is on
    if (settings.centerMode) {
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToScroll should be equal to 1 in centerMode, you are using ' + settings.slidesToScroll);
      }
      settings.slidesToScroll = 1;
    }
    // force showing one slide and scrolling by one if the fade mode is on
    if (settings.fade) {
      if (settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToShow should be equal to 1 when fade is true, you\'re using ' + settings.slidesToShow);
      }
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToScroll should be equal to 1 when fade is true, you\'re using ' + settings.slidesToScroll);
      }
      settings.slidesToShow = 1;
      settings.slidesToScroll = 1;
    }

    // makes sure that children is an array, even when there is only 1 child
    var children = this.$slots['default'] || [];

    // Children may contain false or null, so we should filter them
    // children may also contain string filled with spaces (in certain cases where we use jsx strings)
    children = children.filter(function (child) {
      if (typeof child === 'string') {
        return !!child.trim();
      }
      return !!child;
    });

    // rows and slidesPerRow logic is handled here
    if (settings.variableWidth && (settings.rows > 1 || settings.slidesPerRow > 1)) {
      console.warn('variableWidth is not supported in case of rows > 1 or slidesPerRow > 1');
      settings.variableWidth = false;
    }
    var newChildren = [];
    var currentWidth = null;
    for (var i = 0; i < children.length; i += settings.rows * settings.slidesPerRow) {
      var newSlide = [];
      for (var j = i; j < i + settings.rows * settings.slidesPerRow; j += settings.slidesPerRow) {
        var row = [];
        for (var k = j; k < j + settings.slidesPerRow; k += 1) {
          if (settings.variableWidth && getStyle(children[k])) {
            currentWidth = getStyle(children[k]).width;
          }
          if (k >= children.length) break;
          row.push(cloneElement(children[k], {
            key: 100 * i + 10 * j + k,
            attrs: {
              tabIndex: -1
            },
            style: {
              width: 100 / settings.slidesPerRow + '%',
              display: 'inline-block'
            }
          }));
        }
        newSlide.push(h(
          'div',
          { key: 10 * i + j },
          [row]
        ));
      }
      if (settings.variableWidth) {
        newChildren.push(h(
          'div',
          { key: i, style: { width: currentWidth } },
          [newSlide]
        ));
      } else {
        newChildren.push(h(
          'div',
          { key: i },
          [newSlide]
        ));
      }
    }

    if (settings === 'unslick') {
      var className = 'regular slider ' + (this.className || '');
      return h(
        'div',
        { 'class': className },
        [newChildren]
      );
    } else if (newChildren.length <= settings.slidesToShow) {
      settings.unslick = true;
    }
    var sliderProps = {
      props: _extends({}, settings, {
        children: newChildren,
        __propsSymbol__: Symbol()
      }),
      on: _extends({}, this.$listeners),
      directives: [{
        name: 'ant-ref',
        value: this.innerSliderRefHandler
      }],
      scopedSlots: this.$scopedSlots
    };
    return h(InnerSlider, sliderProps);
  }
};