import isMobile from '../../vc-util/isMobile';
import { onBeforeUnmount, ref, defineComponent } from 'vue';
import classNames from '../../_util/classNames';
import { functionType } from '../../_util/type';
import type { CustomSlotsType } from '../../_util/type';

/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;

/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'StepHandler',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    upDisabled: Boolean,
    downDisabled: Boolean,
    onStep: functionType<(up: boolean) => void>(),
  },
  slots: Object as CustomSlotsType<{
    upNode?: any;
    downNode?: any;
    default?: any;
  }>,
  setup(props, { slots, emit }) {
    const stepTimeoutRef = ref();

    // We will interval update step when hold mouse down
    const onStepMouseDown = (e: MouseEvent, up: boolean) => {
      e.preventDefault();

      emit('step', up);

      // Loop step for interval
      function loopStep() {
        emit('step', up);

        stepTimeoutRef.value = setTimeout(loopStep, STEP_INTERVAL);
      }

      // First time press will wait some time to trigger loop step update
      stepTimeoutRef.value = setTimeout(loopStep, STEP_DELAY);
    };

    const onStopStep = () => {
      clearTimeout(stepTimeoutRef.value);
    };

    onBeforeUnmount(() => {
      onStopStep();
    });

    return () => {
      if (isMobile()) {
        return null;
      }
      const { prefixCls, upDisabled, downDisabled } = props;
      const handlerClassName = `${prefixCls}-handler`;

      const upClassName = classNames(handlerClassName, `${handlerClassName}-up`, {
        [`${handlerClassName}-up-disabled`]: upDisabled,
      });
      const downClassName = classNames(handlerClassName, `${handlerClassName}-down`, {
        [`${handlerClassName}-down-disabled`]: downDisabled,
      });

      const sharedHandlerProps = {
        unselectable: 'on' as const,
        role: 'button',
        onMouseup: onStopStep,
        onMouseleave: onStopStep,
      };
      const { upNode, downNode } = slots;
      return (
        <div class={`${handlerClassName}-wrap`}>
          <span
            {...sharedHandlerProps}
            onMousedown={e => {
              onStepMouseDown(e, true);
            }}
            aria-label="Increase Value"
            aria-disabled={upDisabled}
            class={upClassName}
          >
            {upNode?.() || <span unselectable="on" class={`${prefixCls}-handler-up-inner`} />}
          </span>
          <span
            {...sharedHandlerProps}
            onMousedown={e => {
              onStepMouseDown(e, false);
            }}
            aria-label="Decrease Value"
            aria-disabled={downDisabled}
            class={downClassName}
          >
            {downNode?.() || <span unselectable="on" class={`${prefixCls}-handler-down-inner`} />}
          </span>
        </div>
      );
    };
  },
});
