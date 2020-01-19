import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Vue from 'vue';
import ref from 'vue-ref';
import { getStyle, getListeners } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import defaultProps from './default-props';
import initialState from './initial-state';
import {
  getOnDemandLazySlides,
  extractObject,
  initializedState,
  getHeight,
  canGoNext,
  slideHandler,
  changeSlide,
  keyHandler,
  swipeStart,
  swipeMove,
  swipeEnd,
  getPreClones,
  getPostClones,
  getTrackLeft,
  getTrackCSS,
} from './utils/innerSliderUtils';
import Track from './track';
import Dots from './dots';
import { PrevArrow, NextArrow } from './arrows';
import ResizeObserver from 'resize-observer-polyfill';

Vue.use(ref, { name: 'ant-ref' });

function noop() {}

export default {
  props: {
    ...defaultProps,
  },
  mixins: [BaseMixin],
  data() {
    this.preProps = { ...this.$props };
    this.list = null;
    this.track = null;
    this.callbackTimers = [];
    this.clickable = true;
    this.debouncedResize = null;
    return {
      ...initialState,
      currentSlide: this.initialSlide,
      slideCount: this.children.length,
    };
  },
  methods: {
    listRefHandler(ref) {
      this.list = ref;
    },
    trackRefHandler(ref) {
      this.track = ref;
    },
    adaptHeight() {
      if (this.adaptiveHeight && this.list) {
        const elem = this.list.querySelector(`[data-index="${this.currentSlide}"]`);
        this.list.style.height = getHeight(elem) + 'px';
      }
    },
    onWindowResized(setTrackStyle) {
      if (this.debouncedResize) this.debouncedResize.cancel();
      this.debouncedResize = debounce(() => this.resizeWindow(setTrackStyle), 50);
      this.debouncedResize();
    },
    resizeWindow(setTrackStyle = true) {
      if (!this.track) return;
      const spec = {
        listRef: this.list,
        trackRef: this.track,
        children: this.children,
        ...this.$props,
        ...this.$data,
      };
      this.updateState(spec, setTrackStyle, () => {
        if (this.autoplay) {
          this.handleAutoPlay('update');
        } else {
          this.pause('paused');
        }
      });
      // animating state should be cleared while resizing, otherwise autoplay stops working
      this.setState({
        animating: false,
      });
      clearTimeout(this.animationEndCallback);
      delete this.animationEndCallback;
    },
    updateState(spec, setTrackStyle, callback) {
      const updatedState = initializedState(spec);
      spec = { ...spec, ...updatedState, slideIndex: updatedState.currentSlide };
      const targetLeft = getTrackLeft(spec);
      spec = { ...spec, left: targetLeft };
      const trackStyle = getTrackCSS(spec);
      if (setTrackStyle || this.children.length !== spec.children.length) {
        updatedState['trackStyle'] = trackStyle;
      }
      this.setState(updatedState, callback);
    },
    ssrInit() {
      const children = this.children;
      if (this.variableWidth) {
        let trackWidth = 0;
        let trackLeft = 0;
        const childrenWidths = [];
        const preClones = getPreClones({
          ...this.$props,
          ...this.$data,
          slideCount: children.length,
        });
        const postClones = getPostClones({
          ...this.$props,
          ...this.$data,
          slideCount: children.length,
        });
        children.forEach(child => {
          const childWidth = getStyle(child).width.split('px')[0];
          childrenWidths.push(childWidth);
          trackWidth += childWidth;
        });
        for (let i = 0; i < preClones; i++) {
          trackLeft += childrenWidths[childrenWidths.length - 1 - i];
          trackWidth += childrenWidths[childrenWidths.length - 1 - i];
        }
        for (let i = 0; i < postClones; i++) {
          trackWidth += childrenWidths[i];
        }
        for (let i = 0; i < this.currentSlide; i++) {
          trackLeft += childrenWidths[i];
        }
        const trackStyle = {
          width: trackWidth + 'px',
          left: -trackLeft + 'px',
        };
        if (this.centerMode) {
          const currentWidth = `${childrenWidths[this.currentSlide]}px`;
          trackStyle.left = `calc(${trackStyle.left} + (100% - ${currentWidth}) / 2 ) `;
        }
        this.setState({
          trackStyle,
        });
        return;
      }
      const childrenCount = children.length;
      const spec = { ...this.$props, ...this.$data, slideCount: childrenCount };
      const slideCount = getPreClones(spec) + getPostClones(spec) + childrenCount;
      const trackWidth = (100 / this.slidesToShow) * slideCount;
      const slideWidth = 100 / slideCount;
      let trackLeft = (-slideWidth * (getPreClones(spec) + this.currentSlide) * trackWidth) / 100;
      if (this.centerMode) {
        trackLeft += (100 - (slideWidth * trackWidth) / 100) / 2;
      }
      const trackStyle = {
        width: trackWidth + '%',
        left: trackLeft + '%',
      };
      this.setState({
        slideWidth: slideWidth + '%',
        trackStyle: trackStyle,
      });
    },
    checkImagesLoad() {
      const images = document.querySelectorAll('.slick-slide img');
      const imagesCount = images.length;
      let loadedCount = 0;
      Array.prototype.forEach.call(images, image => {
        const handler = () => ++loadedCount && loadedCount >= imagesCount && this.onWindowResized();
        if (!image.onclick) {
          image.onclick = () => image.parentNode.focus();
        } else {
          const prevClickHandler = image.onclick;
          image.onclick = () => {
            prevClickHandler();
            image.parentNode.focus();
          };
        }
        if (!image.onload) {
          if (this.$props.lazyLoad) {
            image.onload = () => {
              this.adaptHeight();
              this.callbackTimers.push(setTimeout(this.onWindowResized, this.speed));
            };
          } else {
            image.onload = handler;
            image.onerror = () => {
              handler();
              this.$emit('lazyLoadError');
            };
          }
        }
      });
    },
    progressiveLazyLoad() {
      const slidesToLoad = [];
      const spec = { ...this.$props, ...this.$data };
      for (let index = this.currentSlide; index < this.slideCount + getPostClones(spec); index++) {
        if (this.lazyLoadedList.indexOf(index) < 0) {
          slidesToLoad.push(index);
          break;
        }
      }
      for (let index = this.currentSlide - 1; index >= -getPreClones(spec); index--) {
        if (this.lazyLoadedList.indexOf(index) < 0) {
          slidesToLoad.push(index);
          break;
        }
      }
      if (slidesToLoad.length > 0) {
        this.setState(state => ({
          lazyLoadedList: state.lazyLoadedList.concat(slidesToLoad),
        }));
        this.$emit('lazyLoad', slidesToLoad);
      } else {
        if (this.lazyLoadTimer) {
          clearInterval(this.lazyLoadTimer);
          delete this.lazyLoadTimer;
        }
      }
    },
    slideHandler(index, dontAnimate = false) {
      const { asNavFor, currentSlide, beforeChange, speed, afterChange } = this.$props;
      const { state, nextState } = slideHandler({
        index,
        ...this.$props,
        ...this.$data,
        trackRef: this.track,
        useCSS: this.useCSS && !dontAnimate,
      });
      if (!state) return;
      beforeChange && beforeChange(currentSlide, state.currentSlide);
      const slidesToLoad = state.lazyLoadedList.filter(
        value => this.lazyLoadedList.indexOf(value) < 0,
      );
      if (getListeners(this).lazyLoad && slidesToLoad.length > 0) {
        this.$emit('lazyLoad', slidesToLoad);
      }
      this.setState(state, () => {
        asNavFor &&
          asNavFor.innerSlider.currentSlide !== currentSlide &&
          asNavFor.innerSlider.slideHandler(index);
        if (!nextState) return;
        this.animationEndCallback = setTimeout(() => {
          const { animating, ...firstBatch } = nextState;
          this.setState(firstBatch, () => {
            this.callbackTimers.push(setTimeout(() => this.setState({ animating }), 10));
            afterChange && afterChange(state.currentSlide);
            delete this.animationEndCallback;
          });
        }, speed);
      });
    },
    changeSlide(options, dontAnimate = false) {
      const spec = { ...this.$props, ...this.$data };
      const targetSlide = changeSlide(spec, options);
      if (targetSlide !== 0 && !targetSlide) return;
      if (dontAnimate === true) {
        this.slideHandler(targetSlide, dontAnimate);
      } else {
        this.slideHandler(targetSlide);
      }
    },
    clickHandler(e) {
      if (this.clickable === false) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.clickable = true;
    },
    keyHandler(e) {
      const dir = keyHandler(e, this.accessibility, this.rtl);
      dir !== '' && this.changeSlide({ message: dir });
    },
    selectHandler(options) {
      this.changeSlide(options);
    },
    disableBodyScroll() {
      const preventDefault = e => {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      };
      window.ontouchmove = preventDefault;
    },
    enableBodyScroll() {
      window.ontouchmove = null;
    },
    swipeStart(e) {
      if (this.verticalSwiping) {
        this.disableBodyScroll();
      }
      const state = swipeStart(e, this.swipe, this.draggable);
      state !== '' && this.setState(state);
    },
    swipeMove(e) {
      const state = swipeMove(e, {
        ...this.$props,
        ...this.$data,
        trackRef: this.track,
        listRef: this.list,
        slideIndex: this.currentSlide,
      });
      if (!state) return;
      if (state['swiping']) {
        this.clickable = false;
      }
      this.setState(state);
    },
    swipeEnd(e) {
      const state = swipeEnd(e, {
        ...this.$props,
        ...this.$data,
        trackRef: this.track,
        listRef: this.list,
        slideIndex: this.currentSlide,
      });
      if (!state) return;
      const triggerSlideHandler = state['triggerSlideHandler'];
      delete state['triggerSlideHandler'];
      this.setState(state);
      if (triggerSlideHandler === undefined) return;
      this.slideHandler(triggerSlideHandler);
      if (this.$props.verticalSwiping) {
        this.enableBodyScroll();
      }
    },
    slickPrev() {
      // this and fellow methods are wrapped in setTimeout
      // to make sure initialize setState has happened before
      // any of such methods are called
      this.callbackTimers.push(setTimeout(() => this.changeSlide({ message: 'previous' }), 0));
    },
    slickNext() {
      this.callbackTimers.push(setTimeout(() => this.changeSlide({ message: 'next' }), 0));
    },
    slickGoTo(slide, dontAnimate = false) {
      slide = Number(slide);
      if (isNaN(slide)) return '';
      this.callbackTimers.push(
        setTimeout(
          () =>
            this.changeSlide(
              {
                message: 'index',
                index: slide,
                currentSlide: this.currentSlide,
              },
              dontAnimate,
            ),
          0,
        ),
      );
    },
    play() {
      let nextIndex;
      if (this.rtl) {
        nextIndex = this.currentSlide - this.slidesToScroll;
      } else {
        if (canGoNext({ ...this.$props, ...this.$data })) {
          nextIndex = this.currentSlide + this.slidesToScroll;
        } else {
          return false;
        }
      }

      this.slideHandler(nextIndex);
    },
    handleAutoPlay(playType) {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
      }
      const autoplaying = this.autoplaying;
      if (playType === 'update') {
        if (autoplaying === 'hovered' || autoplaying === 'focused' || autoplaying === 'paused') {
          return;
        }
      } else if (playType === 'leave') {
        if (autoplaying === 'paused' || autoplaying === 'focused') {
          return;
        }
      } else if (playType === 'blur') {
        if (autoplaying === 'paused' || autoplaying === 'hovered') {
          return;
        }
      }
      this.autoplayTimer = setInterval(this.play, this.autoplaySpeed + 50);
      this.setState({ autoplaying: 'playing' });
    },
    pause(pauseType) {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
      const autoplaying = this.autoplaying;
      if (pauseType === 'paused') {
        this.setState({ autoplaying: 'paused' });
      } else if (pauseType === 'focused') {
        if (autoplaying === 'hovered' || autoplaying === 'playing') {
          this.setState({ autoplaying: 'focused' });
        }
      } else {
        // pauseType  is 'hovered'
        if (autoplaying === 'playing') {
          this.setState({ autoplaying: 'hovered' });
        }
      }
    },
    onDotsOver() {
      this.autoplay && this.pause('hovered');
    },
    onDotsLeave() {
      this.autoplay && this.autoplaying === 'hovered' && this.handleAutoPlay('leave');
    },
    onTrackOver() {
      this.autoplay && this.pause('hovered');
    },
    onTrackLeave() {
      this.autoplay && this.autoplaying === 'hovered' && this.handleAutoPlay('leave');
    },
    onSlideFocus() {
      this.autoplay && this.pause('focused');
    },
    onSlideBlur() {
      this.autoplay && this.autoplaying === 'focused' && this.handleAutoPlay('blur');
    },
    customPaging({ i }) {
      return <button>{i + 1}</button>;
    },
    appendDots({ dots }) {
      return <ul style={{ display: 'block' }}>{dots}</ul>;
    },
  },
  beforeMount() {
    this.ssrInit();
    this.$emit('init');
    if (this.lazyLoad) {
      const slidesToLoad = getOnDemandLazySlides({
        ...this.$props,
        ...this.$data,
      });
      if (slidesToLoad.length > 0) {
        this.setState(prevState => ({
          lazyLoadedList: prevState.lazyLoadedList.concat(slidesToLoad),
        }));
        this.$emit('lazyLoad', slidesToLoad);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const spec = {
        listRef: this.list,
        trackRef: this.track,
        children: this.children,
        ...this.$props,
      };
      this.updateState(spec, true, () => {
        this.adaptHeight();
        this.autoplay && this.handleAutoPlay('update');
      });
      if (this.lazyLoad === 'progressive') {
        this.lazyLoadTimer = setInterval(this.progressiveLazyLoad, 1000);
      }
      this.ro = new ResizeObserver(() => {
        if (this.animating) {
          this.onWindowResized(false); // don't set trackStyle hence don't break animation
          this.callbackTimers.push(setTimeout(() => this.onWindowResized(), this.speed));
        } else {
          this.onWindowResized();
        }
      });
      this.ro.observe(this.list);
      Array.prototype.forEach.call(document.querySelectorAll('.slick-slide'), slide => {
        slide.onfocus = this.$props.pauseOnFocus ? this.onSlideFocus : null;
        slide.onblur = this.$props.pauseOnFocus ? this.onSlideBlur : null;
      });
      // To support server-side rendering
      if (!window) {
        return;
      }
      if (window.addEventListener) {
        window.addEventListener('resize', this.onWindowResized);
      } else {
        window.attachEvent('onresize', this.onWindowResized);
      }
    });
  },
  beforeDestroy() {
    if (this.animationEndCallback) {
      clearTimeout(this.animationEndCallback);
    }
    if (this.lazyLoadTimer) {
      clearInterval(this.lazyLoadTimer);
    }
    if (this.callbackTimers.length) {
      this.callbackTimers.forEach(timer => clearTimeout(timer));
      this.callbackTimers = [];
    }
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onWindowResized);
    } else {
      window.detachEvent('onresize', this.onWindowResized);
    }
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  },
  updated() {
    this.checkImagesLoad();
    this.$emit('reInit');
    if (this.lazyLoad) {
      const slidesToLoad = getOnDemandLazySlides({
        ...this.$props,
        ...this.$data,
      });
      if (slidesToLoad.length > 0) {
        this.setState(prevState => ({
          lazyLoadedList: prevState.lazyLoadedList.concat(slidesToLoad),
        }));
        this.$emit('lazyLoad');
      }
    }
    // if (this.props.onLazyLoad) {
    //   this.props.onLazyLoad([leftMostSlide])
    // }
    this.adaptHeight();
  },
  watch: {
    __propsSymbol__() {
      const nextProps = this.$props;
      const spec = {
        listRef: this.list,
        trackRef: this.track,
        ...nextProps,
        ...this.$data,
      };
      let setTrackStyle = false;
      for (const key of Object.keys(this.preProps)) {
        if (!nextProps.hasOwnProperty(key)) {
          setTrackStyle = true;
          break;
        }
        if (
          typeof nextProps[key] === 'object' ||
          typeof nextProps[key] === 'function' ||
          typeof nextProps[key] === 'symbol'
        ) {
          continue;
        }
        if (nextProps[key] !== this.preProps[key]) {
          setTrackStyle = true;
          break;
        }
      }
      this.updateState(spec, setTrackStyle, () => {
        if (this.currentSlide >= nextProps.children.length) {
          this.changeSlide({
            message: 'index',
            index: nextProps.children.length - nextProps.slidesToShow,
            currentSlide: this.currentSlide,
          });
        }
        if (nextProps.autoplay) {
          this.handleAutoPlay('update');
        } else {
          this.pause('paused');
        }
      });
      this.preProps = { ...nextProps };
    },
  },
  render() {
    const className = classnames('slick-slider', {
      'slick-vertical': this.vertical,
      'slick-initialized': true,
    });
    const spec = { ...this.$props, ...this.$data };
    let trackProps = extractObject(spec, [
      'fade',
      'cssEase',
      'speed',
      'infinite',
      'centerMode',
      'focusOnSelect',
      'currentSlide',
      'lazyLoad',
      'lazyLoadedList',
      'rtl',
      'slideWidth',
      'slideHeight',
      'listHeight',
      'vertical',
      'slidesToShow',
      'slidesToScroll',
      'slideCount',
      'trackStyle',
      'variableWidth',
      'unslick',
      'centerPadding',
    ]);
    const { pauseOnHover } = this.$props;
    trackProps = {
      props: {
        ...trackProps,
        focusOnSelect: this.focusOnSelect ? this.selectHandler : null,
      },
      directives: [
        {
          name: 'ant-ref',
          value: this.trackRefHandler,
        },
      ],
      on: {
        mouseenter: pauseOnHover ? this.onTrackOver : noop,
        mouseleave: pauseOnHover ? this.onTrackLeave : noop,
        mouseover: pauseOnHover ? this.onTrackOver : noop,
      },
    };

    let dots;
    if (this.dots === true && this.slideCount >= this.slidesToShow) {
      let dotProps = extractObject(spec, [
        'dotsClass',
        'slideCount',
        'slidesToShow',
        'currentSlide',
        'slidesToScroll',
        'clickHandler',
        'children',
        'infinite',
        'appendDots',
      ]);
      dotProps.customPaging = this.customPaging;
      dotProps.appendDots = this.appendDots;
      const { customPaging, appendDots } = this.$scopedSlots;
      if (customPaging) {
        dotProps.customPaging = customPaging;
      }
      if (appendDots) {
        dotProps.appendDots = appendDots;
      }
      const { pauseOnDotsHover } = this.$props;
      dotProps = {
        props: {
          ...dotProps,
          clickHandler: this.changeSlide,
        },
        on: {
          mouseenter: pauseOnDotsHover ? this.onDotsLeave : noop,
          mouseover: pauseOnDotsHover ? this.onDotsOver : noop,
          mouseleave: pauseOnDotsHover ? this.onDotsLeave : noop,
        },
      };
      dots = <Dots {...dotProps} />;
    }

    let prevArrow, nextArrow;
    const arrowProps = extractObject(spec, [
      'infinite',
      'centerMode',
      'currentSlide',
      'slideCount',
      'slidesToShow',
    ]);
    arrowProps.clickHandler = this.changeSlide;
    const { prevArrow: prevArrowCustom, nextArrow: nextArrowCustom } = this.$scopedSlots;
    if (prevArrowCustom) {
      arrowProps.prevArrow = prevArrowCustom;
    }
    if (nextArrowCustom) {
      arrowProps.nextArrow = nextArrowCustom;
    }
    if (this.arrows) {
      prevArrow = <PrevArrow {...{ props: arrowProps }} />;
      nextArrow = <NextArrow {...{ props: arrowProps }} />;
    }
    let verticalHeightStyle = null;

    if (this.vertical) {
      verticalHeightStyle = {
        height: typeof this.listHeight === 'number' ? `${this.listHeight}px` : this.listHeight,
      };
    }

    let centerPaddingStyle = null;

    if (this.vertical === false) {
      if (this.centerMode === true) {
        centerPaddingStyle = {
          padding: '0px ' + this.centerPadding,
        };
      }
    } else {
      if (this.centerMode === true) {
        centerPaddingStyle = {
          padding: this.centerPadding + ' 0px',
        };
      }
    }

    const listStyle = { ...verticalHeightStyle, ...centerPaddingStyle };
    const touchMove = this.touchMove;
    let listProps = {
      directives: [
        {
          name: 'ant-ref',
          value: this.listRefHandler,
        },
      ],
      class: 'slick-list',
      style: listStyle,
      on: {
        click: this.clickHandler,
        mousedown: touchMove ? this.swipeStart : noop,
        mousemove: this.dragging && touchMove ? this.swipeMove : noop,
        mouseup: touchMove ? this.swipeEnd : noop,
        mouseleave: this.dragging && touchMove ? this.swipeEnd : noop,
        touchstart: touchMove ? this.swipeStart : noop,
        touchmove: this.dragging && touchMove ? this.swipeMove : noop,
        touchend: touchMove ? this.swipeEnd : noop,
        touchcancel: this.dragging && touchMove ? this.swipeEnd : noop,
        keydown: this.accessibility ? this.keyHandler : noop,
      },
    };

    let innerSliderProps = {
      class: className,
      props: {
        dir: 'ltr',
      },
    };

    if (this.unslick) {
      listProps = {
        class: 'slick-list',
        directives: [
          {
            name: 'ant-ref',
            value: this.listRefHandler,
          },
        ],
      };
      innerSliderProps = { class: className };
    }
    return (
      <div {...innerSliderProps}>
        {!this.unslick ? prevArrow : ''}
        <div {...listProps}>
          <Track {...trackProps}>{this.children}</Track>
        </div>
        {!this.unslick ? nextArrow : ''}
        {!this.unslick ? dots : ''}
      </div>
    );
  },
};
