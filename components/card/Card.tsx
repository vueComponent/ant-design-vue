import type { VNodeTypes, PropType, VNode, ExtractPropTypes, CSSProperties } from 'vue';
import { isVNode, defineComponent } from 'vue';
import Tabs from '../tabs';
import PropTypes from '../_util/vue-types';
import { flattenChildren, isEmptyElement, filterEmptyWithUndefined } from '../_util/props-util';
import type { SizeType } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import useStyle from './style';
import Skeleton from '../skeleton';
import type { CustomSlotsType } from '../_util/type';
import { customRenderSlot } from '../_util/vnode';

export interface CardTabListType {
  key: string;
  tab: any;
  /** @deprecated Please use `customTab` instead. */
  slots?: { tab: string };
  disabled?: boolean;
}

export type CardType = 'inner';
export type CardSize = 'default' | 'small';

const { TabPane } = Tabs;

export const cardProps = () => ({
  prefixCls: String,
  title: PropTypes.any,
  extra: PropTypes.any,
  bordered: { type: Boolean, default: true },
  bodyStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  headStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  loading: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  type: { type: String as PropType<CardType> },
  size: { type: String as PropType<CardSize> },
  actions: PropTypes.any,
  tabList: {
    type: Array as PropType<CardTabListType[]>,
  },
  tabBarExtraContent: PropTypes.any,
  activeTabKey: String,
  defaultActiveTabKey: String,
  cover: PropTypes.any,
  onTabChange: {
    type: Function as PropType<(key: string) => void>,
  },
});

export type CardProps = Partial<ExtractPropTypes<ReturnType<typeof cardProps>>>;

const Card = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACard',
  inheritAttrs: false,
  props: cardProps(),
  slots: Object as CustomSlotsType<{
    title: any;
    extra: any;
    tabBarExtraContent: any;
    actions: any;
    cover: any;
    customTab: CardTabListType;
    default: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction, size } = useConfigInject('card', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getAction = (actions: VNodeTypes[]) => {
      const actionList = actions.map((action, index) =>
        (isVNode(action) && !isEmptyElement(action)) || !isVNode(action) ? (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ) : null,
      );
      return actionList;
    };
    const triggerTabChange = (key: string) => {
      props.onTabChange?.(key);
    };
    const isContainGrid = (obj: VNode[] = []) => {
      let containGrid: boolean;
      obj.forEach(element => {
        if (element && isPlainObject(element.type) && (element.type as any).__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    };

    return () => {
      const {
        headStyle = {},
        bodyStyle = {},
        loading,
        bordered = true,
        type,
        tabList,
        hoverable,
        activeTabKey,
        defaultActiveTabKey,
        tabBarExtraContent = filterEmptyWithUndefined(slots.tabBarExtraContent?.()),
        title = filterEmptyWithUndefined(slots.title?.()),
        extra = filterEmptyWithUndefined(slots.extra?.()),
        actions = filterEmptyWithUndefined(slots.actions?.()),
        cover = filterEmptyWithUndefined(slots.cover?.()),
      } = props;
      const children = flattenChildren(slots.default?.());
      const pre = prefixCls.value;
      const classString = {
        [`${pre}`]: true,
        [hashId.value]: true,
        [`${pre}-loading`]: loading,
        [`${pre}-bordered`]: bordered,
        [`${pre}-hoverable`]: !!hoverable,
        [`${pre}-contain-grid`]: isContainGrid(children),
        [`${pre}-contain-tabs`]: tabList && tabList.length,
        [`${pre}-${size.value}`]: size.value,
        [`${pre}-type-${type}`]: !!type,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
      const loadingBlock = (
        <Skeleton loading active paragraph={{ rows: 4 }} title={false}>
          {children}
        </Skeleton>
      );

      const hasActiveTabKey = activeTabKey !== undefined;
      const tabsProps = {
        size: 'large' as SizeType,
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
          ? activeTabKey
          : defaultActiveTabKey,
        onChange: triggerTabChange,
        class: `${pre}-head-tabs`,
      };

      let head;
      const tabs =
        tabList && tabList.length ? (
          <Tabs
            {...tabsProps}
            v-slots={{ rightExtra: tabBarExtraContent ? () => tabBarExtraContent : null }}
          >
            {tabList.map(item => {
              const { tab: temp, slots: itemSlots } = item as CardTabListType;
              const name = itemSlots?.tab;
              devWarning(
                !itemSlots,
                'Card',
                `tabList slots is deprecated, Please use \`customTab\` instead.`,
              );
              let tab = temp !== undefined ? temp : slots[name] ? slots[name](item) : null;
              tab = customRenderSlot(slots, 'customTab', item as any, () => [tab]);
              return <TabPane tab={tab} key={item.key} disabled={item.disabled} />;
            })}
          </Tabs>
        ) : null;
      if (title || extra || tabs) {
        head = (
          <div class={`${pre}-head`} style={headStyle}>
            <div class={`${pre}-head-wrapper`}>
              {title && <div class={`${pre}-head-title`}>{title}</div>}
              {extra && <div class={`${pre}-extra`}>{extra}</div>}
            </div>
            {tabs}
          </div>
        );
      }

      const coverDom = cover ? <div class={`${pre}-cover`}>{cover}</div> : null;
      const body = (
        <div class={`${pre}-body`} style={bodyStyle}>
          {loading ? loadingBlock : children}
        </div>
      );
      const actionDom =
        actions && actions.length ? <ul class={`${pre}-actions`}>{getAction(actions)}</ul> : null;

      return wrapSSR(
        <div ref="cardContainerRef" {...attrs} class={[classString, attrs.class]}>
          {head}
          {coverDom}
          {children && children.length ? body : null}
          {actionDom}
        </div>,
      );
    };
  },
});

export default Card;
