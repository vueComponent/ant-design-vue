import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

const checkableTagProps = () => ({
  prefixCls: String,
  checked: { type: Boolean, default: undefined },
  onChange: {
    type: Function as PropType<(checked: boolean) => void>,
  },
  onClick: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  'onUpdate:checked': Function as PropType<(checked: boolean) => void>,
});
export type CheckableTagProps = Partial<ExtractPropTypes<ReturnType<typeof checkableTagProps>>>;

const CheckableTag = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckableTag',
  inheritAttrs: false,
  props: checkableTagProps(),
  // emits: ['update:checked', 'change', 'click'],
  setup(props, { slots, emit, attrs }) {
    const { prefixCls } = useConfigInject('tag', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const handleClick = (e: MouseEvent) => {
      const { checked } = props;
      emit('update:checked', !checked);
      emit('change', !checked);
      emit('click', e);
    };

    const cls = computed(() =>
      classNames(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-checkable`]: true,
        [`${prefixCls.value}-checkable-checked`]: props.checked,
      }),
    );

    return () => {
      return wrapSSR(
        <span {...attrs} class={[cls.value, attrs.class]} onClick={handleClick}>
          {slots.default?.()}
        </span>,
      );
    };
  },
});

export default CheckableTag;
