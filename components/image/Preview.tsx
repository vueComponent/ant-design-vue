import { computed, defineComponent, reactive, ref, watchEffect } from 'vue';
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

import classnames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import Dialog from '../vc-dialog';
import getIDialogPropTypes from '../vc-dialog/IDialogPropTypes';
import { getOffset } from '../vc-util/Dom/css';
import addEventListener from '../vc-util/Dom/addEventListener';
import { warning } from '../vc-util/warning';

import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';

const IDialogPropTypes = getIDialogPropTypes();
export type MouseEventHandler = (payload: MouseEvent) => void;

export interface PreviewProps extends Omit<typeof IDialogPropTypes, 'onClose'> {
  onClose?: (e) => void;
  src?: string;
  alt?: string;
}

const initialPosition = {
  x: 0,
  y: 0,
};
const PreviewType = {
  src: PropTypes.string,
  alt: PropTypes.string,
  ...IDialogPropTypes,
};
const Preview = defineComponent<PreviewProps>({
  name: 'Preview',
  props: initDefaultProps(PreviewType, {}),
  emits: ['close', 'afterClose'],
  setup(props, { emit }) {
    const scale = ref(1);
    const rotate = ref(0);
    const position = ref<{
      x: number;
      y: number;
    }>(initialPosition);

    const onClose = () => emit('close');
    const imgRef = ref<HTMLImageElement>();
    const originPositionRef = reactive<{
      originX: number;
      originY: number;
      deltaX: number;
      deltaY: number;
    }>({
      originX: 0,
      originY: 0,
      deltaX: 0,
      deltaY: 0,
    });
    const isMoving = ref(false);

    const onAfterClose = () => {
      scale.value = 1;
      rotate.value = 0;
      position.value = initialPosition;
      emit('afterClose');
    };

    const onZoomIn = () => {
      scale.value++;

      position.value = initialPosition;
    };
    const onZoomOut = () => {
      if (scale.value > 1) {
        scale.value--;
      }
      position.value = initialPosition;
    };

    const onRotateRight = () => {
      rotate.value += 90;
    };

    const onRotateLeft = () => {
      rotate.value -= 90;
    };

    const wrapClassName = classnames({
      [`${props.prefixCls}-moving`]: isMoving.value,
    });
    const toolClassName = `${props.prefixCls}-operations-operation`;
    const iconClassName = `${props.prefixCls}-operations-icon`;
    const tools = [
      {
        icon: CloseOutlined,
        onClick: onClose,
        type: 'close',
      },
      {
        icon: ZoomInOutlined,
        onClick: onZoomIn,
        type: 'zoomIn',
      },
      {
        icon: ZoomOutOutlined,
        onClick: onZoomOut,
        type: 'zoomOut',
        disabled: computed(() => scale.value === 1),
      },
      {
        icon: RotateRightOutlined,
        onClick: onRotateRight,
        type: 'rotateRight',
      },
      {
        icon: RotateLeftOutlined,
        onClick: onRotateLeft,
        type: 'rotateLeft',
      },
    ];

    const onMouseUp: MouseEventHandler = () => {
      if (props.visible && isMoving.value) {
        const width = imgRef.value.offsetWidth * scale.value;
        const height = imgRef.value.offsetHeight * scale.value;
        const { left, top } = getOffset(imgRef.value);
        const isRotate = rotate.value % 180 !== 0;

        isMoving.value = false;

        const fixState = getFixScaleEleTransPosition(
          isRotate ? height : width,
          isRotate ? width : height,
          left,
          top,
        );

        if (fixState) {
          position.value = { ...fixState };
        }
      }
    };

    const onMouseDown: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      originPositionRef.deltaX = event.pageX - position.value.x;
      originPositionRef.deltaY = event.pageY - position.value.y;
      originPositionRef.originX = position.value.x;
      originPositionRef.originY = position.value.y;
      isMoving.value = true;
    };

    const onMouseMove: MouseEventHandler = event => {
      if (props.visible && isMoving.value) {
        position.value = {
          x: event.pageX - originPositionRef.deltaX,
          y: event.pageY - originPositionRef.deltaY,
        };
      }
    };

    watchEffect(function() {
      let onTopMouseUpListener;
      let onTopMouseMoveListener;

      const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
      const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);

      try {
        // Resolve if in iframe lost event
        /* istanbul ignore next */
        if (window.top !== window.self) {
          onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
          onTopMouseMoveListener = addEventListener(window.top, 'mousemove', onMouseMove, false);
        }
      } catch (error) {
        /* istanbul ignore next */
        warning(false, `[rc-image] ${error}`);
      }

      return () => {
        onMouseUpListener.remove();
        onMouseMoveListener.remove();

        /* istanbul ignore next */
        if (onTopMouseUpListener) onTopMouseUpListener.remove();
        /* istanbul ignore next */
        if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
      };
    });

    return () => (
      <Dialog
        transitionName="zoom"
        maskTransitionName="fade"
        closable={false}
        keyboard
        prefixCls={props.prefixCls}
        onClose={onClose}
        afterClose={onAfterClose}
        visible={props.visible}
        wrapClassName={wrapClassName}
      >
        <ul class={`${props.prefixCls}-operations`}>
          {tools.map(({ icon: IconType, onClick, type, disabled }) => (
            <li
              class={classnames(toolClassName, {
                [`${props.prefixCls}-operations-operation-disabled`]: disabled && disabled?.value,
              })}
              onClick={onClick}
              key={type}
            >
              <IconType class={iconClassName} />
            </li>
          ))}
        </ul>
        <div
          class={`${props.prefixCls}-img-wrapper`}
          style={{
            transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
          }}
        >
          <img
            onMousedown={onMouseDown}
            ref={imgRef}
            class={`${props.prefixCls}-img`}
            src={props.src}
            alt={props.alt}
            style={{
              transform: `scale3d(${scale.value}, ${scale.value}, 1) rotate(${rotate.value}deg)`,
            }}
          />
        </div>
      </Dialog>
    );
  },
});

export default Preview;
