import { defineComponent } from 'vue';
import classNames from '../../../_util/classNames';
import PropTypes from '../../../_util/vue-types';
import addEventListener from '../../../vc-util/Dom/addEventListener';
import warning from '../../../_util/warning';
import { initDefaultProps, getSlot } from '../../../_util/props-util';
import Steps from './Steps';
import Marks from './Marks';
import Handle from '../Handle';
import * as utils from '../utils';
import BaseMixin from '../../../_util/BaseMixin';
import supportsPassive from '../../../_util/supportsPassive';

function noop() {}

export default function createSlider(Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  const propTypes = {
    id: String,
    min: Number,
    max: Number,
    step: Number,
    marks: PropTypes.object,
    included: { type: Boolean, default: undefined },
    prefixCls: String,
    disabled: { type: Boolean, default: undefined },
    handle: Function,
    dots: { type: Boolean, default: undefined },
    vertical: { type: Boolean, default: undefined },
    reverse: { type: Boolean, default: undefined },
    minimumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    maximumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    railStyle: PropTypes.object,
    dotStyle: PropTypes.object,
    activeDotStyle: PropTypes.object,
    autofocus: { type: Boolean, default: undefined },
    draggableTrack: { type: Boolean, default: undefined },
  };
  return defineComponent({
    compatConfig: { MODE: 3 },
    name: 'CreateSlider',
    mixins: [BaseMixin, Component],
    inheritAttrs: false,
    props: initDefaultProps(propTypes, {
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      reverse: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {},
    }),
    emits: ['change', 'blur', 'focus'],
    data() {
      const { step, max, min } = this;
      const isPointDiffEven = isFinite(max - min) ? (max - min) % step === 0 : true; // eslint-disable-line
      warning(
        step && Math.floor(step) === step ? isPointDiffEven : true,
        `Slider[max] - Slider[min] (${max - min}) should be a multiple of Slider[step] (${step})`,
      );
      (this as any).handlesRefs = {};
      return {};
    },
    mounted() {
      this.$nextTick(() => {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        this.document = this.sliderRef && this.sliderRef.ownerDocument;
        // this.setHandleRefs()
        const { autofocus, disabled } = this;
        if (autofocus && !disabled) {
          this.focus();
        }
      });
    },
    beforeUnmount() {
      this.$nextTick(() => {
        // if (super.componentWillUnmount) super.componentWillUnmount()
        this.removeDocumentEvents();
      });
    },
    methods: {
      defaultHandle({ index, directives, className, style, ...restProps }) {
        delete restProps.dragging;
        if (restProps.value === null) {
          return null;
        }
        const handleProps = {
          ...restProps,
          class: className,
          style,
          key: index,
        };
        return <Handle {...handleProps} />;
      },
      onDown(e, position) {
        let p = position;
        const { draggableTrack, vertical: isVertical } = this.$props;
        const { bounds } = this.$data;

        const value = draggableTrack && this.positionGetValue ? this.positionGetValue(p) || [] : [];

        const inPoint = utils.isEventFromHandle(e, this.handlesRefs);
        this.dragTrack =
          draggableTrack &&
          bounds.length >= 2 &&
          !inPoint &&
          !value
            .map((n, i) => {
              const v = !i ? n >= bounds[i] : true;
              return i === value.length - 1 ? n <= bounds[i] : v;
            })
            .some(c => !c);

        if (this.dragTrack) {
          this.dragOffset = p;
          this.startBounds = [...bounds];
        } else {
          if (!inPoint) {
            this.dragOffset = 0;
          } else {
            const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
            this.dragOffset = p - handlePosition;
            p = handlePosition;
          }
          this.onStart(p);
        }
      },
      onMouseDown(e) {
        if (e.button !== 0) {
          return;
        }

        this.removeDocumentEvents();
        const isVertical = this.$props.vertical;
        const position = utils.getMousePosition(isVertical, e);
        this.onDown(e, position);
        this.addDocumentMouseEvents();
      },
      onTouchStart(e) {
        if (utils.isNotTouchEvent(e)) return;

        const isVertical = this.vertical;
        const position = utils.getTouchPosition(isVertical, e);
        this.onDown(e, position);
        this.addDocumentTouchEvents();
        utils.pauseEvent(e);
      },
      onFocus(e) {
        const { vertical } = this;
        if (utils.isEventFromHandle(e, this.handlesRefs) && !this.dragTrack) {
          const handlePosition = utils.getHandleCenterPosition(vertical, e.target);
          this.dragOffset = 0;
          this.onStart(handlePosition);
          utils.pauseEvent(e);
          this.$emit('focus', e);
        }
      },
      onBlur(e) {
        if (!this.dragTrack) {
          this.onEnd();
        }
        this.$emit('blur', e);
      },
      onMouseUp() {
        if (this.handlesRefs[this.prevMovedHandleIndex]) {
          this.handlesRefs[this.prevMovedHandleIndex].clickFocus();
        }
      },
      onMouseMove(e) {
        if (!this.sliderRef) {
          this.onEnd();
          return;
        }
        const position = utils.getMousePosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset, this.dragTrack, this.startBounds);
      },
      onTouchMove(e) {
        if (utils.isNotTouchEvent(e) || !this.sliderRef) {
          this.onEnd();
          return;
        }

        const position = utils.getTouchPosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset, this.dragTrack, this.startBounds);
      },
      onKeyDown(e) {
        if (this.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
          this.onKeyboard(e);
        }
      },
      onClickMarkLabel(e, value) {
        e.stopPropagation();
        this.onChange({ sValue: value });
        this.setState({ sValue: value }, () => this.onEnd(true));
      },
      getSliderStart() {
        const slider = this.sliderRef;
        const { vertical, reverse } = this;
        const rect = slider.getBoundingClientRect();
        if (vertical) {
          return reverse ? rect.bottom : rect.top;
        }
        return window.scrollX + (reverse ? rect.right : rect.left);
      },
      getSliderLength() {
        const slider = this.sliderRef;
        if (!slider) {
          return 0;
        }

        const coords = slider.getBoundingClientRect();
        return this.vertical ? coords.height : coords.width;
      },
      addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = addEventListener(this.document, 'touchend', this.onEnd);
      },
      addDocumentMouseEvents() {
        this.onMouseMoveListener = addEventListener(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = addEventListener(this.document, 'mouseup', this.onEnd);
      },
      removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();

        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
      },
      focus() {
        if (this.$props.disabled) {
          return;
        }
        this.handlesRefs[0]?.focus();
      },

      blur() {
        if (this.$props.disabled) {
          return;
        }
        Object.keys(this.handlesRefs).forEach(key => {
          this.handlesRefs[key]?.blur?.();
        });
      },
      calcValue(offset) {
        const { vertical, min, max } = this;
        const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
      },
      calcValueByPos(position) {
        const sign = this.reverse ? -1 : +1;
        const pixelOffset = sign * (position - this.getSliderStart());
        const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
      },
      calcOffset(value) {
        const { min, max } = this;
        const ratio = (value - min) / (max - min);
        return Math.max(0, ratio * 100);
      },
      saveSlider(slider) {
        this.sliderRef = slider;
      },
      saveHandle(index, handle) {
        this.handlesRefs[index] = handle;
      },
    },
    render() {
      const {
        prefixCls,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        reverse,
        min,
        max,
        maximumTrackStyle,
        railStyle,
        dotStyle,
        activeDotStyle,
        id,
      } = this;
      const { class: className, style } = this.$attrs;
      const { tracks, handles } = this.renderSlider();

      const sliderClassName = classNames(prefixCls, className, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
        [`${prefixCls}-horizontal`]: !vertical,
      });
      const markProps = {
        vertical,
        marks,
        included,
        lowerBound: this.getLowerBound(),
        upperBound: this.getUpperBound(),
        max,
        min,
        reverse,
        class: `${prefixCls}-mark`,
        onClickLabel: disabled ? noop : this.onClickMarkLabel,
      };
      const touchEvents = {
        [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: disabled
          ? noop
          : this.onTouchStart,
      };
      return (
        <div
          id={id}
          ref={this.saveSlider}
          tabindex="-1"
          class={sliderClassName}
          {...touchEvents}
          onMousedown={disabled ? noop : this.onMouseDown}
          onMouseup={disabled ? noop : this.onMouseUp}
          onKeydown={disabled ? noop : this.onKeyDown}
          onFocus={disabled ? noop : this.onFocus}
          onBlur={disabled ? noop : this.onBlur}
          style={style}
        >
          <div
            class={`${prefixCls}-rail`}
            style={{
              ...maximumTrackStyle,
              ...railStyle,
            }}
          />
          {tracks}
          <Steps
            prefixCls={prefixCls}
            vertical={vertical}
            reverse={reverse}
            marks={marks}
            dots={dots}
            step={step}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
          />
          {handles}
          <Marks {...markProps} v-slots={{ mark: this.$slots.mark }} />
          {getSlot(this)}
        </div>
      );
    },
  });
}
