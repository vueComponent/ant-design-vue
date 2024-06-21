import { defineComponent, nextTick, Transition } from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
const getCollapsedWidth = (node: HTMLSpanElement) => {
  if (node) {
    node.style.width = '0px';
    node.style.opacity = '0';
    node.style.transform = 'scale(0)';
  }
};
const getRealWidth = (node: HTMLSpanElement) => {
  nextTick(() => {
    if (node) {
      node.style.width = `${node.scrollWidth}px`;
      node.style.opacity = '1';
      node.style.transform = 'scale(1)';
    }
  });
};
const resetStyle = (node: HTMLSpanElement) => {
  if (node && node.style) {
    node.style.width = null;
    node.style.opacity = null;
    node.style.transform = null;
  }
};
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'LoadingIcon',
  props: {
    prefixCls: String,
    loading: [Boolean, Object],
    existIcon: Boolean,
  },
  setup(props) {
    return () => {
      const { existIcon, prefixCls, loading } = props;
      if (existIcon) {
        return (
          <span class={`${prefixCls}-loading-icon`}>
            <LoadingOutlined />
          </span>
        );
      }
      const visible = !!loading;
      return (
        <Transition
          name={`${prefixCls}-loading-icon-motion`}
          onBeforeEnter={getCollapsedWidth}
          onEnter={getRealWidth}
          onAfterEnter={resetStyle}
          onBeforeLeave={getRealWidth}
          onLeave={(node: HTMLSpanElement) => {
            setTimeout(() => {
              getCollapsedWidth(node);
            });
          }}
          onAfterLeave={resetStyle}
        >
          {visible ? (
            <span class={`${prefixCls}-loading-icon`}>
              <LoadingOutlined />
            </span>
          ) : null}
        </Transition>
      );
    };
  },
});
