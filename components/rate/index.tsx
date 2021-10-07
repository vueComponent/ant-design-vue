import type { ExtractPropTypes, VNode } from 'vue';
import { watch, defineComponent, ref, reactive, onMounted } from 'vue';
import { initDefaultProps, getPropsSlot, findDOMNode } from '../_util/props-util';
import { withInstall } from '../_util/type';
import { getOffsetLeft } from './util';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import StarFilled from '@ant-design/icons-vue/StarFilled';
import Tooltip from '../tooltip';
import useConfigInject from '../_util/hooks/useConfigInject';

import Star from './Star';
import useRefs from '../_util/hooks/useRefs';
import { useInjectFormItemContext } from '../form/FormItemContext';

export const rateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.number,
  allowHalf: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.looseBool,
  character: PropTypes.any,
  autofocus: PropTypes.looseBool,
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  direction: PropTypes.string,
  id: PropTypes.string,
};

export type RateProps = Partial<ExtractPropTypes<typeof rateProps>>;

const Rate = defineComponent({
  name: 'ARate',
  inheritAttrs: false,
  props: initDefaultProps(rateProps, {
    value: 0,
    count: 5,
    allowHalf: false,
    allowClear: true,
    prefixCls: 'ant-rate',
    tabindex: 0,
    direction: 'ltr',
  }),
  emits: ['hoverChange', 'update:value', 'change', 'focus', 'blur', 'keydown'],
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, direction } = useConfigInject('rate', props);
    const formItemContext = useInjectFormItemContext();
    const rateRef = ref();
    const [setRef, starRefs] = useRefs();
    const state = reactive({
      value: props.value,
      focused: false,
      cleanedValue: null,
      hoverValue: undefined,
    });
    watch(
      () => props.value,
      () => {
        state.value = props.value;
      },
    );
    const getStarDOM = (index: number) => {
      return findDOMNode(starRefs.value.get(index));
    };
    const getStarValue = (index: number, x: number) => {
      const reverse = direction.value === 'rtl';
      let value = index + 1;
      if (props.allowHalf) {
        const starEle = getStarDOM(index);
        const leftDis = getOffsetLeft(starEle);
        const width = starEle.clientWidth;
        if (reverse && x - leftDis > width / 2) {
          value -= 0.5;
        } else if (!reverse && x - leftDis < width / 2) {
          value -= 0.5;
        }
      }
      return value;
    };
    const changeValue = (value: number) => {
      if (props.value === undefined) {
        state.value = value;
      }
      emit('update:value', value);
      emit('change', value);
      formItemContext.onFieldChange();
    };

    const onHover = (e: MouseEvent, index: number) => {
      const hoverValue = getStarValue(index, e.pageX);
      if (hoverValue !== state.cleanedValue) {
        state.hoverValue = hoverValue;
        state.cleanedValue = null;
      }
      emit('hoverChange', hoverValue);
    };
    const onMouseLeave = () => {
      state.hoverValue = undefined;
      state.cleanedValue = null;
      emit('hoverChange', undefined);
    };
    const onClick = (event: MouseEvent, index: number) => {
      const { allowClear } = props;
      const newValue = getStarValue(index, event.pageX);
      let isReset = false;
      if (allowClear) {
        isReset = newValue === state.value;
      }
      onMouseLeave();
      changeValue(isReset ? 0 : newValue);
      state.cleanedValue = isReset ? newValue : null;
    };
    const onFocus = () => {
      state.focused = true;
      emit('focus');
    };
    const onBlur = () => {
      state.focused = false;
      emit('blur');
      formItemContext.onFieldBlur();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const { keyCode } = event;
      const { count, allowHalf } = props;
      const reverse = direction.value === 'rtl';
      if (keyCode === KeyCode.RIGHT && state.value < count && !reverse) {
        if (allowHalf) {
          state.value += 0.5;
        } else {
          state.value += 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && state.value > 0 && !reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.RIGHT && state.value > 0 && reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && state.value < count && reverse) {
        if (allowHalf) {
          state.value += 0.5;
        } else {
          state.value += 1;
        }
        changeValue(state.value);
        event.preventDefault();
      }
      emit('keydown', event);
    };

    const focus = () => {
      if (!props.disabled) {
        rateRef.value.focus();
      }
    };
    const blur = () => {
      if (!props.disabled) {
        rateRef.value.blur();
      }
    };

    expose({
      focus,
      blur,
    });

    onMounted(() => {
      const { autofocus, disabled } = props;
      if (autofocus && !disabled) {
        focus();
      }
    });

    const characterRender = (node: VNode, { index }) => {
      const { tooltips } = props;
      if (!tooltips) return node;
      return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
    };
    const character = getPropsSlot(slots, props, 'character') || <StarFilled />;

    return () => {
      const { count, allowHalf, disabled, tabindex, id = formItemContext.id.value } = props;
      const { class: className, style } = attrs;
      const stars = [];
      const disabledClass = disabled ? `${prefixCls.value}-disabled` : '';
      for (let index = 0; index < count; index++) {
        stars.push(
          <Star
            ref={setRef(index)}
            key={index}
            index={index}
            count={count}
            disabled={disabled}
            prefixCls={`${prefixCls.value}-star`}
            allowHalf={allowHalf}
            value={state.hoverValue === undefined ? state.value : state.hoverValue}
            onClick={onClick}
            onHover={onHover}
            character={character}
            characterRender={characterRender}
            focused={state.focused}
          />,
        );
      }
      const rateClassName = classNames(prefixCls.value, disabledClass, className, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });
      return (
        <ul
          {...attrs}
          id={id}
          class={rateClassName}
          style={style}
          onMouseleave={disabled ? null : onMouseLeave}
          tabindex={disabled ? -1 : tabindex}
          onFocus={disabled ? null : onFocus}
          onBlur={disabled ? null : onBlur}
          onKeydown={disabled ? null : onKeyDown}
          ref={rateRef}
          role="radiogroup"
        >
          {stars}
        </ul>
      );
    };
  },
});

export default withInstall(Rate);
