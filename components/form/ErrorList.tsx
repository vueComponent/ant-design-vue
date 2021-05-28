import { useInjectFormItemPrefix } from './context';
import { VueNode } from '../_util/type';
import { computed, defineComponent, ref, watch } from '@vue/runtime-core';
import classNames from '../_util/classNames';
import Transition, { getTransitionProps } from '../_util/transition';

export interface ErrorListProps {
  errors?: VueNode[];
  /** @private Internal Usage. Do not use in your production */
  help?: VueNode;
  /** @private Internal Usage. Do not use in your production */
  onDomErrorVisibleChange?: (visible: boolean) => void;
}

export default defineComponent<ErrorListProps>({
  name: 'ErrorList',
  setup(props) {
    const { prefixCls, status } = useInjectFormItemPrefix();
    const visible = computed(() => props.errors && props.errors.length);
    const innerStatus = ref(status.value);
    // Memo status in same visible
    watch([() => visible, () => status], () => {
      if (visible.value && status.value) {
        innerStatus.value = status.value;
      }
    });
    return () => {
      const baseClassName = `${prefixCls.value}-item-explain`;
      const transitionProps = getTransitionProps('show-help', {
        onAfterLeave: () => props.onDomErrorVisibleChange?.(false),
      });
      return (
        <Transition {...transitionProps}>
          {visible ? (
            <div
              class={classNames(baseClassName, {
                [`${baseClassName}-${innerStatus}`]: innerStatus,
              })}
              key="help"
            >
              {props.errors?.map((error: any, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} role="alert">
                  {error}
                </div>
              ))}
            </div>
          ) : null}
        </Transition>
      );
    };
  },
});
