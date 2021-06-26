import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { tuple } from '../_util/type';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import ScrollableInkTabBar from '../vc-tabs/src/ScrollableInkTabBar';
import PropTypes from '../_util/vue-types';

const TabBar = defineComponent({
  name: 'TabBar',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    centered: PropTypes.looseBool.def(false),
    tabBarStyle: PropTypes.style,
    tabBarExtraContent: PropTypes.VNodeChild,
    type: PropTypes.oneOf(tuple('line', 'card', 'editable-card')),
    tabPosition: PropTypes.oneOf(tuple('top', 'right', 'bottom', 'left')).def('top'),
    tabBarPosition: PropTypes.oneOf(tuple('top', 'right', 'bottom', 'left')),
    size: PropTypes.oneOf(tuple('default', 'small', 'large')),
    animated: {
      type: [Boolean, Object] as PropType<boolean | { inkBar: boolean; tabPane: boolean }>,
      default: undefined,
    },
    renderTabBar: PropTypes.func,
    panels: PropTypes.array.def([]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabBarGutter: PropTypes.number,
  },
  render() {
    const {
      centered,
      tabBarStyle,
      animated = true,
      renderTabBar,
      tabBarExtraContent,
      tabPosition,
      prefixCls,
      type = 'line',
      size,
    } = this.$props;
    const inkBarAnimated = typeof animated === 'object' ? animated.inkBar : animated;

    const isVertical = tabPosition === 'left' || tabPosition === 'right';
    const prevIcon = (
      <span class={`${prefixCls}-tab-prev-icon`}>
        {isVertical ? (
          <UpOutlined class={`${prefixCls}-tab-prev-icon-target`} />
        ) : (
          <LeftOutlined class={`${prefixCls}-tab-prev-icon-target`} />
        )}
      </span>
    );
    const nextIcon = (
      <span class={`${prefixCls}-tab-next-icon`}>
        {isVertical ? (
          <DownOutlined class={`${prefixCls}-tab-next-icon-target`} />
        ) : (
          <RightOutlined class={`${prefixCls}-tab-next-icon-target`} />
        )}
      </span>
    );
    // Additional className for style usage
    const cls = {
      [this.$attrs.class as string]: this.$attrs.class,
      [`${prefixCls}-centered-bar`]: centered,
      [`${prefixCls}-${tabPosition}-bar`]: true,
      [`${prefixCls}-${size}-bar`]: !!size,
      [`${prefixCls}-card-bar`]: type && type.indexOf('card') >= 0,
    };

    const renderProps = {
      ...this.$props,
      ...this.$attrs,
      children: null,
      inkBarAnimated,
      extraContent: tabBarExtraContent,
      prevIcon,
      nextIcon,
      style: tabBarStyle,
      class: cls,
    };

    if (renderTabBar) {
      return renderTabBar({ ...renderProps, DefaultTabBar: ScrollableInkTabBar });
    } else {
      return <ScrollableInkTabBar {...renderProps} />;
    }
  },
});

export default TabBar;
