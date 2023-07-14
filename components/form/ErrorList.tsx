import { useInjectFormItemPrefix } from './context';
import type { VueNode } from '../_util/type';
import { computed, defineComponent, ref, Transition, watch, TransitionGroup } from 'vue';
import { getTransitionGroupProps, getTransitionProps } from '../_util/transition';

import collapseMotion from '../_util/collapseMotion';
import useStyle from './style';

export interface ErrorListProps {
  errors?: VueNode[];
  /** @private Internal Usage. Do not use in your production */
  help?: VueNode;
  onErrorVisibleChanged?: (visible: boolean) => void;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ErrorList',
  inheritAttrs: false,
  props: ['errors', 'help', 'onErrorVisibleChanged', 'helpStatus', 'warnings'],
  setup(props, { attrs }) {
    const { prefixCls, status } = useInjectFormItemPrefix();
    const baseClassName = computed(() => `${prefixCls.value}-item-explain`);
    const visible = computed(() => !!(props.errors && props.errors.length));
    const innerStatus = ref(status.value);
    const [, hashId] = useStyle(prefixCls);
    // Memo status in same visible
    watch([visible, status], () => {
      if (visible.value) {
        innerStatus.value = status.value;
      }
    });

    return () => {
      const colMItem = collapseMotion(`${prefixCls.value}-show-help-item`);
      const transitionGroupProps = getTransitionGroupProps(
        `${prefixCls.value}-show-help-item`,
        colMItem,
      );
      (transitionGroupProps as any).role = 'alert';
      (transitionGroupProps as any).class = [
        hashId.value,
        baseClassName.value,
        attrs.class,
        `${prefixCls.value}-show-help`,
      ];
      return (
        <Transition
          {...getTransitionProps(`${prefixCls.value}-show-help`)}
          onAfterEnter={() => props.onErrorVisibleChanged(true)}
          onAfterLeave={() => props.onErrorVisibleChanged(false)}
        >
          <TransitionGroup {...transitionGroupProps} tag="div" v-show={!!props.errors?.length}>
            {props.errors?.map((error: any, index: number) => (
              <div
                key={index}
                class={innerStatus.value ? `${baseClassName.value}-${innerStatus.value}` : ''}
              >
                {error}
              </div>
            ))}
          </TransitionGroup>
        </Transition>
      );
    };
  },
});
