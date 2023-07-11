import classNames from '../../_util/classNames';
import { computed, defineComponent } from 'vue';

type HandlerSize = 'default' | 'small';

interface HandlerProps {
  size?: HandlerSize;
  color?: string;
  prefixCls?: string;
}

const Handler = defineComponent({
  name: 'Handler',
  props: ['size', 'color', 'prefixCls'],
  setup(props: HandlerProps) {
    const size = computed(() => props.size || 'default');
    return () => (
      <div
        class={classNames(`${props.prefixCls}-handler`, {
          [`${props.prefixCls}-handler-sm`]: size.value === 'small',
        })}
        style={{
          backgroundColor: props.color,
        }}
      />
    );
  },
});

export default Handler;
