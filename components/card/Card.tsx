import type { VNodeTypes, PropType, VNode, ExtractPropTypes } from 'vue';
import { isVNode, defineComponent, renderSlot } from 'vue';
import Tabs from '../tabs';
import Row from '../row';
import Col from '../col';
import PropTypes from '../_util/vue-types';
import { flattenChildren, isEmptyElement } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import type { SizeType } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';
import useConfigInject from '../_util/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
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

const cardProps = () => ({
  prefixCls: PropTypes.string,
  title: PropTypes.any,
  extra: PropTypes.any,
  bordered: PropTypes.looseBool.def(true),
  bodyStyle: PropTypes.style,
  headStyle: PropTypes.style,
  loading: PropTypes.looseBool.def(false),
  hoverable: PropTypes.looseBool.def(false),
  type: { type: String as PropType<CardType> },
  size: { type: String as PropType<CardSize> },
  actions: PropTypes.any,
  tabList: {
    type: Array as PropType<CardTabListType[]>,
  },
  tabBarExtraContent: PropTypes.any,
  activeTabKey: PropTypes.string,
  defaultActiveTabKey: PropTypes.string,
  cover: PropTypes.any,
  onTabChange: {
    type: Function as PropType<(key: string) => void>,
  },
});

export type CardProps = Partial<ExtractPropTypes<ReturnType<typeof cardProps>>>;

const Card = defineComponent({
  name: 'ACard',
  mixins: [BaseMixin],
  props: cardProps(),
  slots: ['title', 'extra', 'tabBarExtraContent', 'actions', 'cover', 'customTab'],
  setup(props, { slots }) {
    const { prefixCls, direction, size } = useConfigInject('card', props);
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
        tabBarExtraContent = slots.tabBarExtraContent?.(),
        title = slots.title?.(),
        extra = slots.extra?.(),
        actions = slots.actions?.(),
        cover = slots.cover?.(),
      } = props;
      const children = flattenChildren(slots.default?.());
      const pre = prefixCls.value;
      const classString = {
        [`${pre}`]: true,
        [`${pre}-loading`]: loading,
        [`${pre}-bordered`]: bordered,
        [`${pre}-hoverable`]: !!hoverable,
        [`${pre}-contain-grid`]: isContainGrid(children),
        [`${pre}-contain-tabs`]: tabList && tabList.length,
        [`${pre}-${size.value}`]: size.value,
        [`${pre}-type-${type}`]: !!type,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };

      const loadingBlockStyle =
        bodyStyle.padding === 0 || bodyStyle.padding === '0px' ? { padding: '24px' } : undefined;

      const block = <div class={`${pre}-loading-block`} />;
      const loadingBlock = (
        <div class={`${pre}-loading-content`} style={loadingBlockStyle}>
          <Row gutter={8}>
            <Col span={22}>{block}</Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>{block}</Col>
            <Col span={15}>{block}</Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>{block}</Col>
            <Col span={18}>{block}</Col>
          </Row>
          <Row gutter={8}>
            <Col span={13}>{block}</Col>
            <Col span={9}>{block}</Col>
          </Row>
          <Row gutter={8}>
            <Col span={4}>{block}</Col>
            <Col span={3}>{block}</Col>
            <Col span={16}>{block}</Col>
          </Row>
        </div>
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
              tab = renderSlot(slots, 'customTab', item as any, () => [tab]);
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

      return (
        <div class={classString} ref="cardContainerRef">
          {head}
          {coverDom}
          {children && children.length ? body : null}
          {actionDom}
        </div>
      );
    };
  },
});

export default Card;
