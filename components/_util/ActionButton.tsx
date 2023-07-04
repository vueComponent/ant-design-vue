import type { ExtractPropTypes, PropType } from 'vue';
import { onMounted, ref, defineComponent, onBeforeUnmount } from 'vue';
import Button from '../button';
import type { ButtonProps } from '../button';
import type { LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import useDestroyed from './hooks/useDestroyed';

const actionButtonProps = {
  type: {
    type: String as PropType<LegacyButtonType>,
  },
  actionFn: Function as PropType<(...args: any[]) => any | PromiseLike<any>>,
  close: Function,
  autofocus: Boolean,
  prefixCls: String,
  buttonProps: Object as PropType<ButtonProps>,
  emitEvent: Boolean,
  quitOnNullishReturnValue: Boolean,
};

export type ActionButtonProps = ExtractPropTypes<typeof actionButtonProps>;

function isThenable(thing?: PromiseLike<any>): boolean {
  return !!(thing && !!thing.then);
}

export default defineComponent({
  name: 'ActionButton',
  props: actionButtonProps,
  setup(props, { slots }) {
    const clickedRef = ref<boolean>(false);
    const buttonRef = ref();
    const loading = ref(false);
    let timeoutId: any;
    const isDestroyed = useDestroyed();
    onMounted(() => {
      if (props.autofocus) {
        timeoutId = setTimeout(() => buttonRef.value.$el?.focus());
      }
    });
    onBeforeUnmount(() => {
      clearTimeout(timeoutId);
    });

    const handlePromiseOnOk = (returnValueOfOnOk?: PromiseLike<any>) => {
      const { close } = props;
      if (!isThenable(returnValueOfOnOk)) {
        return;
      }
      loading.value = true;
      returnValueOfOnOk!.then(
        (...args: any[]) => {
          if (!isDestroyed.value) {
            loading.value = false;
          }
          close(...args);
          clickedRef.value = false;
        },
        (e: Error) => {
          // Emit error when catch promise reject
          // eslint-disable-next-line no-console
          console.error(e);
          // See: https://github.com/ant-design/ant-design/issues/6183
          if (!isDestroyed.value) {
            loading.value = false;
          }
          clickedRef.value = false;
        },
      );
    };

    const onClick = (e: MouseEvent) => {
      const { actionFn, close = () => {} } = props;
      if (clickedRef.value) {
        return;
      }
      clickedRef.value = true;
      if (!actionFn) {
        close();
        return;
      }
      let returnValueOfOnOk;
      if (props.emitEvent) {
        returnValueOfOnOk = actionFn(e);
        if (props.quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
          clickedRef.value = false;
          close(e);
          return;
        }
      } else if (actionFn.length) {
        returnValueOfOnOk = actionFn(close);
        // https://github.com/ant-design/ant-design/issues/23358
        clickedRef.value = false;
      } else {
        returnValueOfOnOk = actionFn();
        if (!returnValueOfOnOk) {
          close();
          return;
        }
      }
      handlePromiseOnOk(returnValueOfOnOk);
    };
    return () => {
      const { type, prefixCls, buttonProps } = props;
      return (
        <Button
          {...convertLegacyProps(type)}
          onClick={onClick}
          loading={loading.value}
          prefixCls={prefixCls}
          {...buttonProps}
          ref={buttonRef}
          v-slots={slots}
        ></Button>
      );
    };
  },
});
