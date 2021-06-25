import type { PropType } from 'vue';
import { defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';

const CheckableTag = defineComponent({
  name: 'ACheckableTag',
  props: {
    prefixCls: PropTypes.string,
    checked: PropTypes.looseBool,
    onChange: {
      type: Function as PropType<(checked: boolean) => void>,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
  },
  emits: ['update:checked', 'change', 'click'],
  setup(props, { slots, emit }) {
    const { prefixCls } = useConfigInject('tag', props);
    const handleClick = (e: MouseEvent) => {
      const { checked } = props;
      emit('update:checked', !checked);
      emit('change', !checked);
      emit('click', e);
    };

    const cls = computed(() =>
      classNames(prefixCls.value, {
        [`${prefixCls.value}-checkable`]: true,
        [`${prefixCls.value}-checkable-checked`]: props.checked,
      }),
    );

    return () => {
      return (
        <span class={cls.value} onClick={handleClick}>
          {slots.default?.()}
        </span>
      );
    };
  },
});

export default CheckableTag;
