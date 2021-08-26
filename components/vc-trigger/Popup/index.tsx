import { defineComponent, ref, watch } from 'vue';
import { popupProps } from './interface';
import Mask from './Mask';
import MobilePopupInner from './MobilePopupInner';
import PopupInner from './PopupInner';

export default defineComponent({
  name: 'Popup',
  inheritAttrs: false,
  props: popupProps,
  setup(props, { attrs, slots, expose }) {
    const innerVisible = ref(false);
    const inMobile = ref(false);
    const popupRef = ref();
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
        <div>
          <Mask {...cloneProps} />
          {popupNode}
        </div>
      );
    };
  },
});
