import { defineComponent, shallowRef, watch } from 'vue';
import { popupProps } from './interface';
import Mask from './Mask';
import MobilePopupInner from './MobilePopupInner';
import PopupInner from './PopupInner';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Popup',
  inheritAttrs: false,
  props: popupProps,
  setup(props, { attrs, slots, expose }) {
    const innerVisible = shallowRef(false);
    const inMobile = shallowRef(false);
    const popupRef = shallowRef();
    const rootRef = shallowRef<HTMLElement>();
    watch(
      [() => props.visible, () => props.mobile],
      () => {
        innerVisible.value = props.visible;
        if (props.visible && props.mobile) {
          inMobile.value = true;
        }
      },
      { immediate: true, flush: 'post' },
    );
    expose({
      forceAlign: () => {
        popupRef.value?.forceAlign();
      },
      getElement: () => {
        return popupRef.value?.getElement();
      },
    });
    return () => {
      const cloneProps = { ...props, ...attrs, visible: innerVisible.value };
      const popupNode = inMobile.value ? (
        <MobilePopupInner
          {...cloneProps}
          mobile={props.mobile}
          ref={popupRef}
          v-slots={{ default: slots.default }}
        ></MobilePopupInner>
      ) : (
        <PopupInner {...cloneProps} ref={popupRef} v-slots={{ default: slots.default }} />
      );

      return (
        <div ref={rootRef}>
          <Mask {...cloneProps} />
          {popupNode}
        </div>
      );
    };
  },
});
