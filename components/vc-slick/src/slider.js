import json2mq from 'json2mq';
import Vue from 'vue';
import ref from 'vue-ref';
import BaseMixin from '../../_util/BaseMixin';
import { cloneElement } from '../../_util/vnode';
import { getStyle, getListeners } from '../../_util/props-util';
import InnerSlider from './inner-slider';
import defaultProps from './default-props';
import { canUseDOM } from './utils/innerSliderUtils';
const enquire = canUseDOM() && require('enquire.js');

Vue.use(ref, { name: 'ant-ref' });

export default {
  props: {
    ...defaultProps,
  },
  mixins: [BaseMixin],
  data() {
    this._responsiveMediaHandlers = [];
    return {
      breakpoint: null,
    };
  },
  methods: {
    innerSliderRefHandler(ref) {
      this.innerSlider = ref;
    },
    media(query, handler) {
      // javascript handler for  css media query
      enquire.register(query, handler);
      this._responsiveMediaHandlers.push({ query, handler });
    },
    slickPrev() {
      this.innerSlider.slickPrev();
    },
    slickNext() {
      this.innerSlider.slickNext();
    },
    slickGoTo(slide, dontAnimate = false) {
      this.innerSlider.slickGoTo(slide, dontAnimate);
    },
    slickPause() {
      this.innerSlider.pause('paused');
    },
    slickPlay() {
      this.innerSlider.handleAutoPlay('play');
    },
  },
  // handles responsive breakpoints
  beforeMount() {
    // performance monitoring
    // if (process.env.NODE_ENV !== 'production') {
    // const { whyDidYouUpdate } = require('why-did-you-update')
    // whyDidYouUpdate(React)
    // }
    if (this.responsive) {
      const breakpoints = this.responsive.map(breakpt => breakpt.breakpoint);
      // sort them in increasing order of their numerical value
      breakpoints.sort((x, y) => x - y);

      breakpoints.forEach((breakpoint, index) => {
        // media query for each breakpoint
        let bQuery;
        if (index === 0) {
          bQuery = json2mq({ minWidth: 0, maxWidth: breakpoint });
        } else {
          bQuery = json2mq({
            minWidth: breakpoints[index - 1] + 1,
            maxWidth: breakpoint,
          });
        }
        // when not using server side rendering
        canUseDOM() &&
          this.media(bQuery, () => {
            this.setState({ breakpoint: breakpoint });
          });
      });

      // Register media query for full screen. Need to support resize from small to large
      // convert javascript object to media query string
      const query = json2mq({ minWidth: breakpoints.slice(-1)[0] });

      canUseDOM() &&
        this.media(query, () => {
          this.setState({ breakpoint: null });
        });
    }
  },
  beforeDestroy() {
    this._responsiveMediaHandlers.forEach(function(obj) {
      enquire.unregister(obj.query, obj.handler);
    });
  },

  render() {
    let settings;
    let newProps;
    if (this.breakpoint) {
      newProps = this.responsive.filter(resp => resp.breakpoint === this.breakpoint);
      settings =
        newProps[0].settings === 'unslick'
          ? 'unslick'
          : { ...this.$props, ...newProps[0].settings };
    } else {
      settings = { ...this.$props };
    }

    // force scrolling by one if centerMode is on
    if (settings.centerMode) {
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 in centerMode, you are using ${settings.slidesToScroll}`,
        );
      }
      settings.slidesToScroll = 1;
    }
    // force showing one slide and scrolling by one if the fade mode is on
    if (settings.fade) {
      if (settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToShow should be equal to 1 when fade is true, you're using ${settings.slidesToShow}`,
        );
      }
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 when fade is true, you're using ${settings.slidesToScroll}`,
        );
      }
      settings.slidesToShow = 1;
      settings.slidesToScroll = 1;
    }

    // makes sure that children is an array, even when there is only 1 child
    let children = this.$slots.default || [];

    // Children may contain false or null, so we should filter them
    // children may also contain string filled with spaces (in certain cases where we use jsx strings)
    children = children.filter(child => {
      if (typeof child === 'string') {
        return !!child.trim();
      }
      return !!child;
    });

    // rows and slidesPerRow logic is handled here
    if (settings.variableWidth && (settings.rows > 1 || settings.slidesPerRow > 1)) {
      console.warn(`variableWidth is not supported in case of rows > 1 or slidesPerRow > 1`);
      settings.variableWidth = false;
    }
    const newChildren = [];
    let currentWidth = null;
    for (let i = 0; i < children.length; i += settings.rows * settings.slidesPerRow) {
      const newSlide = [];
      for (let j = i; j < i + settings.rows * settings.slidesPerRow; j += settings.slidesPerRow) {
        const row = [];
        for (let k = j; k < j + settings.slidesPerRow; k += 1) {
          if (settings.variableWidth && getStyle(children[k])) {
            currentWidth = getStyle(children[k]).width;
          }
          if (k >= children.length) break;
          row.push(
            cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              attrs: {
                tabIndex: -1,
              },
              style: {
                width: `${100 / settings.slidesPerRow}%`,
                display: 'inline-block',
              },
            }),
          );
        }
        newSlide.push(<div key={10 * i + j}>{row}</div>);
      }
      if (settings.variableWidth) {
        newChildren.push(
          <div key={i} style={{ width: currentWidth }}>
            {newSlide}
          </div>,
        );
      } else {
        newChildren.push(<div key={i}>{newSlide}</div>);
      }
    }

    if (settings === 'unslick') {
      const className = 'regular slider ' + (this.className || '');
      return <div class={className}>{newChildren}</div>;
    } else if (newChildren.length <= settings.slidesToShow) {
      settings.unslick = true;
    }
    const sliderProps = {
      props: {
        ...settings,
        children: newChildren,
        __propsSymbol__: Symbol(),
      },
      on: getListeners(this),
      directives: [
        {
          name: 'ant-ref',
          value: this.innerSliderRefHandler,
        },
      ],
      scopedSlots: this.$scopedSlots,
    };
    return <InnerSlider {...sliderProps} />;
  },
};
