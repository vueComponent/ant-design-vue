import { defineComponent, ref, watchEffect } from 'vue';
import { collapsePanelProps } from './commonProps';
import classNames from '../_util/classNames';

export default defineComponent({
  name: 'PanelContent',
  props: collapsePanelProps(),
  setup(props, { slots }) {
    const rendered = ref(false);

    watchEffect(() => {
      if (props.isActive || props.forceRender) {
        rendered.value = true;
      }
    });

    return () => {
      if (!rendered.value) return null;
      const { prefixCls, isActive, role } = props;
      return (
        <div
          ref={ref}
          class={classNames(`${prefixCls}-content`, {
            [`${prefixCls}-content-active`]: isActive,
            [`${prefixCls}-content-inactive`]: !isActive,
          })}
          role={role}
        >
          <div class={`${prefixCls}-content-box`}>{slots.default?.()}</div>
        </div>
      );
    };
  },
});
