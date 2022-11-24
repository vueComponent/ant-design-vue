import { useInjectFormItemPrefix } from './context';
import type { VueNode } from '../_util/type';
import { computed, defineComponent, ref, watch } from 'vue';
import { getTransitionGroupProps, TransitionGroup } from '../_util/transition';
import useConfigInject from '../_util/hooks/useConfigInject';
import collapseMotion from '../_util/collapseMotion';

export interface ErrorListProps {
  errors?: VueNode[];
  /** @private Internal Usage. Do not use in your production */
  help?: VueNode;
  /** @private Internal Usage. Do not use in your production */
  onDomErrorVisibleChange?: (visible: boolean) => void;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ErrorList',
  props: ['errors', 'help', 'onDomErrorVisibleChange', 'helpStatus', 'warnings'],
  setup(props) {
    const { prefixCls: rootPrefixCls } = useConfigInject('', props);
    const { prefixCls, status } = useInjectFormItemPrefix();
    const baseClassName = computed(() => `${prefixCls.value}-item-explain`);
    const visible = computed(() => !!(props.errors && props.errors.length));
    const innerStatus = ref(status.value);

    // Memo status in same visible
    watch([visible, status], () => {
      if (visible.value) {
        innerStatus.value = status.value;
      }
    });

    return () => {
      const colMItem = collapseMotion(`${rootPrefixCls.value}-show-help-item`);
      const transitionGroupProps = getTransitionGroupProps(
        `${rootPrefixCls.value}-show-help-item`,
        colMItem,
      );
      (transitionGroupProps as any).class = baseClassName.value;
      return props.errors?.length ? (
        <TransitionGroup {...transitionGroupProps} tag="div">
          {props.errors?.map((error: any, index: number) => (
            <div
              key={index}
              role="alert"
              class={innerStatus.value ? `${baseClassName.value}-${innerStatus.value}` : ''}
            >
              {error}
            </div>
          ))}
        </TransitionGroup>
      ) : null;
    };
  },
});
