import type { VNode } from 'vue';
import {
  onMounted,
  getCurrentInstance,
  watch,
  onBeforeUnmount,
  ref,
  nextTick,
  defineComponent,
  withDirectives,
} from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import calculateNodeHeight from './calculateNodeHeight';
import raf from '../_util/raf';
import warning from '../_util/warning';
import antInput from '../_util/antInputDirective';
import omit from '../_util/omit';
import { textAreaProps } from './inputProps';

const RESIZE_STATUS_NONE = 0;
const RESIZE_STATUS_RESIZING = 1;
const RESIZE_STATUS_RESIZED = 2;

const ResizableTextArea = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ResizableTextArea',
  inheritAttrs: false,
  props: textAreaProps(),
  setup(props, { attrs, emit, expose }) {
    let nextFrameActionId: any;
    let resizeFrameId: any;
    const textAreaRef = ref();
    const textareaStyles = ref({});
    const resizeStatus = ref(RESIZE_STATUS_NONE);
    onBeforeUnmount(() => {
      raf.cancel(nextFrameActionId);
      raf.cancel(resizeFrameId);
    });

    // https://github.com/ant-design/ant-design/issues/21870
    const fixFirefoxAutoScroll = () => {
      try {
        if (document.activeElement === textAreaRef.value) {
          const currentStart = textAreaRef.value.selectionStart;
          const currentEnd = textAreaRef.value.selectionEnd;
          textAreaRef.value.setSelectionRange(currentStart, currentEnd);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    };

    const resizeTextarea = () => {
      const autoSize = props.autoSize || props.autosize;
      if (!autoSize || !textAreaRef.value) {
        return;
      }
      const { minRows, maxRows } = autoSize;
      textareaStyles.value = calculateNodeHeight(textAreaRef.value, false, minRows, maxRows);
      resizeStatus.value = RESIZE_STATUS_RESIZING;
      raf.cancel(resizeFrameId);
      resizeFrameId = raf(() => {
        resizeStatus.value = RESIZE_STATUS_RESIZED;
        resizeFrameId = raf(() => {
          resizeStatus.value = RESIZE_STATUS_NONE;
          fixFirefoxAutoScroll();
        });
      });
    };

    const resizeOnNextFrame = () => {
      raf.cancel(nextFrameActionId);
      nextFrameActionId = raf(resizeTextarea);
    };

    const handleResize = (size: { width: number; height: number }) => {
      if (resizeStatus.value !== RESIZE_STATUS_NONE) {
        return;
      }
      emit('resize', size);

      const autoSize = props.autoSize || props.autosize;
      if (autoSize) {
        resizeOnNextFrame();
      }
    };
    warning(
      props.autosize === undefined,
      'Input.TextArea',
      'autosize is deprecated, please use autoSize instead.',
    );

    const renderTextArea = () => {
      const { prefixCls, autoSize, autosize, disabled } = props;
      const otherProps = omit(props, [
        'prefixCls',
        'onPressEnter',
        'autoSize',
        'autosize',
        'defaultValue',
        'allowClear',
        'type',
        'lazy',
        'maxlength',
        'valueModifiers',
      ]);
      const cls = classNames(prefixCls, attrs.class, {
        [`${prefixCls}-disabled`]: disabled,
      });
      const style = [
        attrs.style,
        textareaStyles.value,
        resizeStatus.value === RESIZE_STATUS_RESIZING
          ? { overflowX: 'hidden', overflowY: 'hidden' }
          : null,
      ];
      const textareaProps: any = {
        ...otherProps,
        ...attrs,
        style,
        class: cls,
      };
      if (!textareaProps.autofocus) {
        delete textareaProps.autofocus;
      }
      if (textareaProps.rows === 0) {
        delete textareaProps.rows;
      }
      return (
        <ResizeObserver onResize={handleResize} disabled={!(autoSize || autosize)}>
          {withDirectives((<textarea {...textareaProps} ref={textAreaRef} />) as VNode, [
            [antInput],
          ])}
        </ResizeObserver>
      );
    };

    watch(
      () => props.value,
      () => {
        nextTick(() => {
          resizeTextarea();
        });
      },
    );
    onMounted(() => {
      nextTick(() => {
        resizeTextarea();
      });
    });
    const instance = getCurrentInstance();
    expose({
      resizeTextarea,
      textArea: textAreaRef,
      instance,
    });

    return () => {
      return renderTextArea();
    };
  },
});

export default ResizableTextArea;
