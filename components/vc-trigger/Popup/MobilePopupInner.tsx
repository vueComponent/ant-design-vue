import { CSSProperties, defineComponent, ref, Transition } from 'vue';
import { flattenChildren } from 'ant-design-vue/es/_util/props-util';
import classNames from 'ant-design-vue/es/_util/classNames';
import { MobilePopupProps, mobileProps } from './interface';

export default defineComponent({
  props: mobileProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  inheritAttrs: false,
  name: 'MobilePopupInner',
  setup(props, { expose, slots }) {
    const elementRef = ref<HTMLDivElement>();

    expose({
      forceAlign: () => {},
      getElement: () => elementRef.value,
    });

    return () => {
      const {
        zIndex,
        visible,
        prefixCls,
        mobile: { popupClassName, popupStyle, popupMotion = {}, popupRender } = {},
      } = props as MobilePopupProps;
      // ======================== Render ========================
      const mergedStyle: CSSProperties = {
        zIndex,
        ...popupStyle,
      };

      let childNode: any = flattenChildren(slots.default?.());

      // Wrapper when multiple children
      if (childNode.length > 1) {
        childNode = <div class={`${prefixCls}-content`}>{childNode}</div>;
      }

      // Mobile support additional render
      if (popupRender) {
        childNode = popupRender(childNode);
      }

      const mergedClassName = classNames(prefixCls, popupClassName);
      return (
        <Transition ref={elementRef} {...popupMotion}>
          {visible ? (
            <div class={mergedClassName} style={mergedStyle}>
              {childNode}
            </div>
          ) : null}
        </Transition>
      );
    };
  },
});
