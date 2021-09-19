import type { CSSProperties } from 'vue';
import { computed, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import addEventListener from '../../vc-util/Dom/addEventListener';

export default defineComponent({
  name: 'Handle',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.looseBool,
    offset: PropTypes.number,
    disabled: PropTypes.looseBool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reverse: PropTypes.looseBool,
    ariaLabel: String,
    ariaLabelledBy: String,
    ariaValueTextFormatter: Function,
  },
  setup(props, { attrs, emit, expose }) {
    const clickFocused = ref(false);
    const handle = ref();
    const handleMouseUp = () => {
      if (document.activeElement === handle.value) {
        clickFocused.value = true;
      }
    };
    const handleBlur = (e: FocusEvent) => {
      clickFocused.value = false;
      emit('blur', e);
    };
    const handleKeyDown = () => {
      clickFocused.value = false;
    };
    const focus = () => {
      handle.value?.focus();
    };
    const blur = () => {
      handle.value?.blur();
    };
    const clickFocus = () => {
      clickFocused.value = true;
      focus();
    };

    // when click can not focus in vue, use mousedown trigger focus
    const handleMousedown = (e: MouseEvent) => {
      e.preventDefault();
      focus();
      emit('mousedown', e);
    };
    expose({
      focus,
      blur,
      clickFocus,
      ref: handle,
    });
    let onMouseUpListener = null;
    onMounted(() => {
      onMouseUpListener = addEventListener(document, 'mouseup', handleMouseUp);
    });
    onBeforeUnmount(() => {
      onMouseUpListener?.remove();
    });

    const positionStyle = computed(() => {
      const { vertical, offset, reverse } = props;
      return vertical
        ? {
            [reverse ? 'top' : 'bottom']: `${offset}%`,
            [reverse ? 'bottom' : 'top']: 'auto',
            transform: reverse ? null : `translateY(+50%)`,
          }
        : {
            [reverse ? 'right' : 'left']: `${offset}%`,
            [reverse ? 'left' : 'right']: 'auto',
            transform: `translateX(${reverse ? '+' : '-'}50%)`,
          };
    });
    return () => {
      const {
        prefixCls,
        disabled,
        min,
        max,
        value,
        tabindex,
        ariaLabel,
        ariaLabelledBy,
        ariaValueTextFormatter,
      } = props;
      const className = classNames(attrs.class, {
        [`${prefixCls}-handle-click-focused`]: clickFocused.value,
      });

      const ariaProps = {
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled,
      };
      const elStyle = {
        ...(attrs.style as CSSProperties),
        ...positionStyle.value,
      };
      let mergedTabIndex = tabindex || 0;
      if (disabled || tabindex === null) {
        mergedTabIndex = null;
      }

      let ariaValueText;
      if (ariaValueTextFormatter) {
        ariaValueText = ariaValueTextFormatter(value);
      }

      const handleProps = {
        ...attrs,
        role: 'slider',
        tabindex: mergedTabIndex,
        ...ariaProps,
        class: className,
        onBlur: handleBlur,
        onKeydown: handleKeyDown,
        onMousedown: handleMousedown,
        ref: handle,
        style: elStyle,
      };
      return (
        <div
          {...handleProps}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={ariaValueText}
        />
      );
    };
  },
  // data() {
  //   return {
  //     clickFocused: false,
  //   };
  // },
  // mounted() {
  //   // mouseup won't trigger if mouse moved out of handle
  //   // so we listen on document here.
  //   this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp);
  // },
  // beforeUnmount() {
  //   if (this.onMouseUpListener) {
  //     this.onMouseUpListener.remove();
  //   }
  // },
  // methods: {
  //   setHandleRef(node) {
  //     this.handle = node;
  //   },
  //   setClickFocus(focused) {
  //     this.setState({ clickFocused: focused });
  //   },
  //   handleMouseUp() {
  //     if (document.activeElement === this.handle) {
  //       this.setClickFocus(true);
  //     }
  //   },
  //   handleBlur(e) {
  //     this.setClickFocus(false);
  //     this.__emit('blur', e);
  //   },
  //   handleKeyDown() {
  //     this.setClickFocus(false);
  //   },
  //   clickFocus() {
  //     this.setClickFocus(true);
  //     this.focus();
  //   },
  //   focus() {
  //     this.handle.focus();
  //   },
  //   blur() {
  //     this.handle.blur();
  //   },
  //   // when click can not focus in vue, use mousedown trigger focus
  //   handleMousedown(e) {
  //     e.preventDefault();
  //     this.focus();
  //     this.__emit('mousedown', e);
  //   },
  // },
  // render() {
  //   const {
  //     prefixCls,
  //     vertical,
  //     reverse,
  //     offset,
  //     disabled,
  //     min,
  //     max,
  //     value,
  //     tabindex,
  //     ariaLabel,
  //     ariaLabelledBy,
  //     ariaValueTextFormatter,
  //   } = getOptionProps(this);
  //   const className = classNames(this.$attrs.class, {
  //     [`${prefixCls}-handle-click-focused`]: this.clickFocused,
  //   });

  //   const positionStyle = vertical
  //     ? {
  //         [reverse ? 'top' : 'bottom']: `${offset}%`,
  //         [reverse ? 'bottom' : 'top']: 'auto',
  //         transform: reverse ? null : `translateY(+50%)`,
  //       }
  //     : {
  //         [reverse ? 'right' : 'left']: `${offset}%`,
  //         [reverse ? 'left' : 'right']: 'auto',
  //         transform: `translateX(${reverse ? '+' : '-'}50%)`,
  //       };

  //   const ariaProps = {
  //     'aria-valuemin': min,
  //     'aria-valuemax': max,
  //     'aria-valuenow': value,
  //     'aria-disabled': !!disabled,
  //   };
  //   const elStyle = {
  //     ...this.$attrs.style,
  //     ...positionStyle,
  //   };
  //   let mergedTabIndex = tabindex || 0;
  //   if (disabled || tabindex === null) {
  //     mergedTabIndex = null;
  //   }

  //   let ariaValueText;
  //   if (ariaValueTextFormatter) {
  //     ariaValueText = ariaValueTextFormatter(value);
  //   }

  //   const handleProps = {
  //     ...this.$attrs,
  //     role: 'slider',
  //     tabindex: mergedTabIndex,
  //     ...ariaProps,
  //     class: className,
  //     onBlur: this.handleBlur,
  //     onKeydown: this.handleKeyDown,
  //     onMousedown: this.handleMousedown,
  //     ref: this.setHandleRef,
  //     style: elStyle,
  //   };
  //   return (
  //     <div
  //       {...handleProps}
  //       aria-label={ariaLabel}
  //       aria-labelledby={ariaLabelledBy}
  //       aria-valuetext={ariaValueText}
  //     />
  //   );
  // },
});
