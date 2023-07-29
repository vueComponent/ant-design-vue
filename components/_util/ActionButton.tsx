import type { ExtractPropTypes, PropType } from 'vue';
import { shallowRef, onMounted, defineComponent, onBeforeUnmount } from 'vue';
import Button from '../button';
import type { ButtonProps } from '../button';
import type { LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import useDestroyed from './hooks/useDestroyed';
import { objectType } from './type';
import { findDOMNode } from './props-util';

const actionButtonProps = {
  type: {
    type: String as PropType<LegacyButtonType>,
  },
  actionFn: Function as PropType<(...args: any[]) => any | PromiseLike<any>>,
  close: Function,
  autofocus: Boolean,
  prefixCls: String,
  buttonProps: objectType<ButtonProps>(),
  emitEvent: Boolean,
  quitOnNullishReturnValue: Boolean,
};

export type ActionButtonProps = ExtractPropTypes<typeof actionButtonProps>;

function isThenable<T>(thing?: PromiseLike<T>): boolean {
  return !!(thing && thing.then);
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ActionButton',
  props: actionButtonProps,
  setup(props, { slots }) {
    const clickedRef = shallowRef<boolean>(false);
    const buttonRef = shallowRef();
    const loading = shallowRef(false);
    let timeoutId: any;
    const isDestroyed = useDestroyed();
    onMounted(() => {
      if (props.autofocus) {
        timeoutId = setTimeout(() => findDOMNode(buttonRef.value)?.focus?.());
      }
    });
    onBeforeUnmount(() => {
      clearTimeout(timeoutId);
    });

    const onInternalClose = (...args: any[]) => {
      props.close?.(...args);
    };

    const handlePromiseOnOk = (returnValueOfOnOk?: PromiseLike<any>) => {
      if (!isThenable(returnValueOfOnOk)) {
        return;
      }
      loading.value = true;
      returnValueOfOnOk!.then(
        (...args: any[]) => {
          if (!isDestroyed.value) {
            loading.value = false;
          }
          onInternalClose(...args);
          clickedRef.value = false;
        },
        (e: Error) => {
          // See: https://github.com/ant-design/ant-design/issues/6183
          if (!isDestroyed.value) {
            loading.value = false;
          }
          clickedRef.value = false;
          return Promise.reject(e);
        },
      );
    };

    const onClick = (e: MouseEvent) => {
      const { actionFn } = props;
      if (clickedRef.value) {
        return;
      }
      clickedRef.value = true;
      if (!actionFn) {
        onInternalClose();
        return;
      }
      let returnValueOfOnOk: PromiseLike<any>;
      if (props.emitEvent) {
        returnValueOfOnOk = actionFn(e);
        if (props.quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
          clickedRef.value = false;
          onInternalClose(e);
          return;
        }
      } else if (actionFn.length) {
        returnValueOfOnOk = actionFn(props.close);
        // https://github.com/ant-design/ant-design/issues/23358
        clickedRef.value = false;
      } else {
        returnValueOfOnOk = actionFn();
        if (!returnValueOfOnOk) {
          onInternalClose();
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
