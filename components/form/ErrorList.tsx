import { useInjectFormItemPrefix } from './context';
import type { VueNode } from '../_util/type';
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import Transition, { getTransitionProps } from '../_util/transition';
import useConfigInject from '../_util/hooks/useConfigInject';

export interface ErrorListProps {
  errors?: VueNode[];
  /** @private Internal Usage. Do not use in your production */
  help?: VueNode;
  /** @private Internal Usage. Do not use in your production */
  onDomErrorVisibleChange?: (visible: boolean) => void;
}

export default defineComponent({
  name: 'ErrorList',
  props: ['errors', 'help', 'onDomErrorVisibleChange'],
  setup(props) {
    const { prefixCls: rootPrefixCls } = useConfigInject('', props);
    const { prefixCls, status } = useInjectFormItemPrefix();
    const visible = ref(!!(props.errors && props.errors.length));
    const innerStatus = ref(status.value);
    const timeout = ref();
    const cacheErrors = ref([...props.errors]);
    watch([() => [...props.errors], () => props.help], newValues => {
      window.clearTimeout(timeout.value);
      if (props.help) {
        visible.value = !!(props.errors && props.errors.length);
        if (visible.value) {
          cacheErrors.value = newValues[0];
        }
      } else {
        timeout.value = window.setTimeout(() => {
          visible.value = !!(props.errors && props.errors.length);
          if (visible.value) {
            cacheErrors.value = newValues[0];
          }
        });
      }
    });
    onBeforeUnmount(() => {
      window.clearTimeout(timeout.value);
    });
    // Memo status in same visible
    watch([visible, status], () => {
      if (visible.value && status.value) {
        innerStatus.value = status.value;
      }
    });
    watch(
      visible,
      () => {
        if (visible.value) {
          props.onDomErrorVisibleChange?.(true);
        }
      },
      { immediate: true, flush: 'post' },
    );
    return () => {
      const baseClassName = `${prefixCls.value}-item-explain`;
      const transitionProps = getTransitionProps(`${rootPrefixCls.value}-show-help`, {
        onAfterLeave: () => {
          props.onDomErrorVisibleChange?.(false);
        },
      });
      return (
        <Transition {...transitionProps}>
          {visible.value ? (
            <div
              class={classNames(baseClassName, {
                [`${baseClassName}-${innerStatus.value}`]: innerStatus.value,
              })}
              key="help"
            >
              {cacheErrors.value?.map((error: any, index: number) => (
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
