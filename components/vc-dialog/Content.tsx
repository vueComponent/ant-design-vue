import type { CSSProperties, PropType } from 'vue';
import { Transition, computed, ref, defineComponent, nextTick } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import { getTransitionProps } from '../_util/transition';
import dialogPropTypes from './IDialogPropTypes';
import { offset } from './util';
const sentinelStyle = { width: 0, height: 0, overflow: 'hidden', outline: 'none' };
const entityStyle = { outline: 'none' };
export type ContentRef = {
  focus: () => void;
  changeActive: (next: boolean) => void;
};
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'DialogContent',
  inheritAttrs: false,
  props: {
    ...dialogPropTypes(),
    motionName: String,
    ariaId: String,
    onVisibleChanged: Function as PropType<(visible: boolean) => void>,
    onMousedown: Function as PropType<MouseEventHandler>,
    onMouseup: Function as PropType<MouseEventHandler>,
  },
  setup(props, { expose, slots, attrs }) {
    const sentinelStartRef = ref<HTMLDivElement>();
    const sentinelEndRef = ref<HTMLDivElement>();
    const dialogRef = ref<HTMLDivElement>();
    expose({
      focus: () => {
        sentinelStartRef.value?.focus({ preventScroll: true });
      },
      changeActive: next => {
        const { activeElement } = document;
        if (next && activeElement === sentinelEndRef.value) {
          sentinelStartRef.value.focus({ preventScroll: true });
        } else if (!next && activeElement === sentinelStartRef.value) {
          sentinelEndRef.value.focus({ preventScroll: true });
        }
      },
    });
    const transformOrigin = ref<string>();
    const contentStyleRef = computed(() => {
      const { width, height } = props;
      const contentStyle: CSSProperties = {};
      if (width !== undefined) {
        contentStyle.width = typeof width === 'number' ? `${width}px` : width;
      }
      if (height !== undefined) {
        contentStyle.height = typeof height === 'number' ? `${height}px` : height;
      }
      if (transformOrigin.value) {
        contentStyle.transformOrigin = transformOrigin.value;
      }
      return contentStyle;
    });

    const onPrepare = () => {
      nextTick(() => {
        if (dialogRef.value) {
          const elementOffset = offset(dialogRef.value);
          transformOrigin.value = props.mousePosition
            ? `${props.mousePosition.x - elementOffset.left}px ${
                props.mousePosition.y - elementOffset.top
              }px`
            : '';
        }
      });
    };
    const onVisibleChanged = (visible: boolean) => {
      props.onVisibleChanged(visible);
    };
    return () => {
      const {
        prefixCls,
        footer = slots.footer?.(),
        title = slots.title?.(),
        ariaId,
        closable,
        closeIcon = slots.closeIcon?.(),
        onClose,
        bodyStyle,
        bodyProps,
        onMousedown,
        onMouseup,
        visible,
        modalRender = slots.modalRender,
        destroyOnClose,
        motionName,
      } = props;
      let footerNode: any;
      if (footer) {
        footerNode = <div class={`${prefixCls}-footer`}>{footer}</div>;
      }

      let headerNode: any;
      if (title) {
        headerNode = (
          <div class={`${prefixCls}-header`}>
            <div class={`${prefixCls}-title`} id={ariaId}>
              {title}
            </div>
          </div>
        );
      }

      let closer: any;
      if (closable) {
        closer = (
          <button type="button" onClick={onClose} aria-label="Close" class={`${prefixCls}-close`}>
            {closeIcon || <span class={`${prefixCls}-close-x`} />}
          </button>
        );
      }

      const content = (
        <div class={`${prefixCls}-content`}>
          {closer}
          {headerNode}
          <div class={`${prefixCls}-body`} style={bodyStyle} {...bodyProps}>
            {slots.default?.()}
          </div>
          {footerNode}
        </div>
      );
      const transitionProps = getTransitionProps(motionName);
      return (
        <Transition
          {...transitionProps}
          onBeforeEnter={onPrepare}
          onAfterEnter={() => onVisibleChanged(true)}
          onAfterLeave={() => onVisibleChanged(false)}
        >
          {visible || !destroyOnClose ? (
            <div
              {...attrs}
              ref={dialogRef}
              v-show={visible}
              key="dialog-element"
              role="document"
              style={[contentStyleRef.value, attrs.style as CSSProperties]}
              class={[prefixCls, attrs.class]}
              onMousedown={onMousedown}
              onMouseup={onMouseup}
            >
              <div tabindex={0} ref={sentinelStartRef} style={entityStyle}>
                {modalRender ? modalRender({ originVNode: content }) : content}
              </div>
              <div tabindex={0} ref={sentinelEndRef} style={sentinelStyle} />
            </div>
          ) : null}
        </Transition>
      );
    };
  },
});
