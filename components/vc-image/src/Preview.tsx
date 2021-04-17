import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import RotateLeftOutlined from '@ant-design/icons-vue/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons-vue/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons-vue/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons-vue/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';

import classnames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import Dialog from '../../vc-dialog';
import getIDialogPropTypes from '../../vc-dialog/IDialogPropTypes';
import { getOffset } from '../../vc-util/Dom/css';
import addEventListener from '../../vc-util/Dom/addEventListener';
import { warning } from '../../vc-util/warning';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';

import { context } from './PreviewGroup';

const IDialogPropTypes = getIDialogPropTypes();
export type MouseEventHandler = (payload: MouseEvent) => void;

export interface PreviewProps extends Omit<typeof IDialogPropTypes, 'onClose'> {
  onClose?: (e: Element) => void;
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
const Preview = defineComponent({
  name: 'Preview',
  inheritAttrs: false,
  props: PreviewType,
  emits: ['close', 'afterClose'],
  setup(props, { emit, attrs }) {
    const scale = ref(1);
    const rotate = ref(0);
    const [position, setPosition] = useFrameSetState<{
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
    const groupContext = context.inject();
    const { previewUrls, current, isPreviewGroup, setCurrent } = groupContext;
    const previewGroupCount = computed(() => Object.keys(previewUrls).length);
    const previewUrlsKeys = computed(() => Object.keys(previewUrls));
    const currentPreviewIndex = computed(() =>
      previewUrlsKeys.value.indexOf(String(current.value)),
    );
    const combinationSrc = computed(() =>
      isPreviewGroup.value ? previewUrls[current.value] : props.src,
    );
    const showLeftOrRightSwitches = computed(
      () => isPreviewGroup.value && previewGroupCount.value > 1,
    );

    const onAfterClose = () => {
      scale.value = 1;
      rotate.value = 0;
      setPosition(initialPosition);
    };

    const onZoomIn = () => {
      scale.value++;
      setPosition(initialPosition);
    };
    const onZoomOut = () => {
      if (scale.value > 1) {
        scale.value--;
      }
      setPosition(initialPosition);
    };

    const onRotateRight = () => {
      rotate.value += 90;
    };

    const onRotateLeft = () => {
      rotate.value -= 90;
    };
    const onSwitchLeft: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      if (currentPreviewIndex.value > 0) {
        setCurrent(previewUrlsKeys.value[String(currentPreviewIndex.value - 1)]);
      }
    };

    const onSwitchRight: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      if (currentPreviewIndex.value < previewGroupCount.value - 1) {
        setCurrent(previewUrlsKeys.value[String(currentPreviewIndex.value + 1)]);
      }
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
          setPosition({ ...fixState });
        }
      }
    };

    const onMouseDown: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      originPositionRef.deltaX = event.pageX - position.x;
      originPositionRef.deltaY = event.pageY - position.y;
      originPositionRef.originX = position.x;
      originPositionRef.originY = position.y;
      isMoving.value = true;
    };

    const onMouseMove: MouseEventHandler = event => {
      if (props.visible && isMoving.value) {
        setPosition({
          x: event.pageX - originPositionRef.deltaX,
          y: event.pageY - originPositionRef.deltaY,
        });
      }
    };
    let removeListeners = () => {};
    onMounted(() => {
      watch(
        [() => props.visible, isMoving],
        () => {
          removeListeners();
          let onTopMouseUpListener: { remove: any };
          let onTopMouseMoveListener: { remove: any };

          const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
          const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);

          try {
            // Resolve if in iframe lost event
            /* istanbul ignore next */
            if (window.top !== window.self) {
              onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
              onTopMouseMoveListener = addEventListener(
                window.top,
                'mousemove',
                onMouseMove,
                false,
              );
            }
          } catch (error) {
            /* istanbul ignore next */
            warning(false, `[vc-image] ${error}`);
          }

          removeListeners = () => {
            onMouseUpListener.remove();
            onMouseMoveListener.remove();

            /* istanbul ignore next */
            if (onTopMouseUpListener) onTopMouseUpListener.remove();
            /* istanbul ignore next */
            if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
          };
        },
        { flush: 'post', immediate: true },
      );
    });
    onUnmounted(() => {
      removeListeners();
    });

    return () => (
      <Dialog
        {...attrs}
        transitionName="zoom"
        maskTransitionName="fade"
        closable={false}
        keyboard
        prefixCls={props.prefixCls}
        onClose={onClose}
        afterClose={onAfterClose}
        visible={props.visible}
        wrapClassName={wrapClassName}
        getContainer={props.getContainer}
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
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          <img
            onMousedown={onMouseDown}
            ref={imgRef}
            class={`${props.prefixCls}-img`}
            src={combinationSrc.value}
            alt={props.alt}
            style={{
              transform: `scale3d(${scale.value}, ${scale.value}, 1) rotate(${rotate.value}deg)`,
            }}
          />
        </div>
        {showLeftOrRightSwitches.value && (
          <div
            class={classnames(`${props.prefixCls}-switch-left`, {
              [`${props.prefixCls}-switch-left-disabled`]: currentPreviewIndex.value <= 0,
            })}
            onClick={onSwitchLeft}
          >
            <LeftOutlined />
          </div>
        )}
        {showLeftOrRightSwitches.value && (
          <div
            class={classnames(`${props.prefixCls}-switch-right`, {
              [`${props.prefixCls}-switch-right-disabled`]:
                currentPreviewIndex.value >= previewGroupCount.value - 1,
            })}
            onClick={onSwitchRight}
          >
            <RightOutlined />
          </div>
        )}
      </Dialog>
    );
  },
});

export default Preview;
