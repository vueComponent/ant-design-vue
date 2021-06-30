import type { ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import { getPropsSlot } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export const starProps = {
  value: PropTypes.number,
  index: PropTypes.number,
  prefixCls: PropTypes.string,
  allowHalf: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  character: PropTypes.any,
  characterRender: PropTypes.func,
  focused: PropTypes.looseBool,
  count: PropTypes.number,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
};

export type StarProps = Partial<ExtractPropTypes<typeof starProps>>;

export default defineComponent({
  name: 'Star',
  inheritAttrs: false,
  props: starProps,
  emits: ['hover', 'click'],
  setup(props, { slots, emit }) {
    const onHover = (e: MouseEvent) => {
      const { index } = props;
      emit('hover', e, index);
    };
    const onClick = (e: MouseEvent) => {
      const { index } = props;
      emit('click', e, index);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const { index } = props;
      if (e.keyCode === 13) {
        emit('click', e, index);
      }
    };

    const cls = computed(() => {
      const { prefixCls, index, value, allowHalf, focused } = props;
      const starValue = index + 1;
      let className = prefixCls;
      if (value === 0 && index === 0 && focused) {
        className += ` ${prefixCls}-focused`;
      } else if (allowHalf && value + 0.5 >= starValue && value < starValue) {
        className += ` ${prefixCls}-half ${prefixCls}-active`;
        if (focused) {
          className += ` ${prefixCls}-focused`;
        }
      } else {
        className += starValue <= value ? ` ${prefixCls}-full` : ` ${prefixCls}-zero`;
        if (starValue === value && focused) {
          className += ` ${prefixCls}-focused`;
        }
      }
      return className;
    });

    return () => {
      const { disabled, prefixCls, characterRender, index, count, value } = props;
      const character = getPropsSlot(slots, props, 'character');
      let star = (
        <li class={cls.value}>
          <div
            onClick={disabled ? null : onClick}
            onKeydown={disabled ? null : onKeyDown}
            onMousemove={disabled ? null : onHover}
            role="radio"
            aria-checked={value > index ? 'true' : 'false'}
            aria-posinset={index + 1}
            aria-setsize={count}
            tabindex={disabled ? -1 : 0}
          >
            <div class={`${prefixCls}-first`}>{character}</div>
            <div class={`${prefixCls}-second`}>{character}</div>
          </div>
        </li>
      );
      if (characterRender) {
        star = characterRender(star, props);
      }
      return star;
    };
  },
});
