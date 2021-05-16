import PropTypes from '../../_util/vue-types';
import { computed, defineComponent } from 'vue';
import useProvideKeyPath, { useInjectKeyPath } from './hooks/useKeyPath';
import { useInjectMenu, useProvideFirstLevel } from './hooks/useMenuContext';
import { getPropsSlot, isValidElement } from 'ant-design-vue/es/_util/props-util';
import classNames from 'ant-design-vue/es/_util/classNames';

export default defineComponent({
  name: 'ASubMenu',
  props: {
    icon: PropTypes.VNodeChild,
    title: PropTypes.VNodeChild,
    disabled: Boolean,
    level: Number,
    popupClassName: String,
    popupOffset: [Number, Number],
  },
  slots: ['icon', 'title'],
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    useProvideKeyPath();
    useProvideFirstLevel(false);
    const keyPath = useInjectKeyPath();
    const {
      prefixCls,
      activeKeys,
      disabled,
      changeActiveKeys,
      rtl,
      mode,
      inlineCollapsed,
      antdMenuTheme,
    } = useInjectMenu();

    const popupClassName = computed(() =>
      classNames(prefixCls, `${prefixCls.value}-${antdMenuTheme.value}`, props.popupClassName),
    );
    const renderTitle = (title: any, icon: any) => {
      if (!icon) {
        return inlineCollapsed.value && props.level === 1 && title && typeof title === 'string' ? (
          <div class={`${prefixCls.value}-inline-collapsed-noicon`}>{title.charAt(0)}</div>
        ) : (
          title
        );
      }
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      const titleIsSpan = isValidElement(title) && title.type === 'span';
      return (
        <>
          {icon}
          {titleIsSpan ? title : <span class={`${prefixCls.value}-title-content`}>{title}</span>}
        </>
      );
    };

    const className = computed(() =>
      classNames(
        prefixCls.value,
        `${prefixCls.value}-sub`,
        `${prefixCls.value}-${mode.value === 'inline' ? 'inline' : 'vertical'}`,
      ),
    );
    return () => {
      const icon = getPropsSlot(slots, props, 'icon');
      const title = renderTitle(getPropsSlot(slots, props, 'title'), icon);
      return (
        <ul {...attrs} class={[className.value, attrs.class]} data-menu-list>
          {slots.default?.()}
        </ul>
      );
    };
  },
});
