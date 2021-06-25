import type { VNodeTypes, PropType, VNode, ExtractPropTypes } from 'vue';
import { inject, isVNode, defineComponent } from 'vue';
import { tuple } from '../_util/type';
import Tabs from '../tabs';
import Row from '../row';
import Col from '../col';
import PropTypes from '../_util/vue-types';
import { getComponent, getSlot, isEmptyElement } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { defaultConfigProvider } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';

export interface CardTabListType {
  key: string;
  tab: VNodeTypes;
  slots?: { tab: string };
  disabled?: boolean;
}

export type CardType = 'inner';

const { TabPane } = Tabs;

const cardProps = {
  prefixCls: PropTypes.string,
  title: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  bordered: PropTypes.looseBool.def(true),
  bodyStyle: PropTypes.style,
  headStyle: PropTypes.style,
  loading: PropTypes.looseBool.def(false),
  hoverable: PropTypes.looseBool.def(false),
  type: PropTypes.string,
  size: PropTypes.oneOf(tuple('default', 'small')),
  actions: PropTypes.VNodeChild,
  tabList: {
    type: Array as PropType<CardTabListType[]>,
  },
  tabBarExtraContent: PropTypes.VNodeChild,
  activeTabKey: PropTypes.string,
  defaultActiveTabKey: PropTypes.string,
  cover: PropTypes.VNodeChild,
  onTabChange: {
    type: Function as PropType<(key: string) => void>,
  },
};

export type CardProps = Partial<ExtractPropTypes<typeof cardProps>>;

const Card = defineComponent({
  name: 'ACard',
  mixins: [BaseMixin],
  props: cardProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      widerPadding: false,
    };
  },
  methods: {
    getAction(actions: VNodeTypes[]) {
      const actionList = actions.map((action, index) =>
        (isVNode(action) && !isEmptyElement(action)) || !isVNode(action) ? (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ) : null,
      );
      return actionList;
    },
    triggerTabChange(key: string) {
      this.$emit('tabChange', key);
    },
    isContainGrid(obj: VNode[] = []) {
      let containGrid: boolean;
      obj.forEach(element => {
        if (element && isPlainObject(element.type) && (element.type as any).__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      headStyle = {},
      bodyStyle = {},
      loading,
      bordered = true,
      size = 'default',
      type,
      tabList,
      hoverable,
      activeTabKey,
      defaultActiveTabKey,
    } = this.$props;
    const { $slots } = this;
    const children = getSlot(this);
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const tabBarExtraContent = getComponent(this, 'tabBarExtraContent');
    const classString = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-hoverable`]: !!hoverable,
      [`${prefixCls}-contain-grid`]: this.isContainGrid(children),
      [`${prefixCls}-contain-tabs`]: tabList && tabList.length,
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-type-${type}`]: !!type,
    };

    const loadingBlockStyle =
      bodyStyle.padding === 0 || bodyStyle.padding === '0px' ? { padding: 24 } : undefined;

    const loadingBlock = (
      <div class={`${prefixCls}-loading-content`} style={loadingBlockStyle}>
        <Row gutter={8}>
          <Col span={22}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={15}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={18}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={13}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={9}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={3}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={16}>
            <div class={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
      </div>
    );

    const hasActiveTabKey = activeTabKey !== undefined;
    const tabsProps = {
      size: 'large',
      [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
        ? activeTabKey
        : defaultActiveTabKey,
      tabBarExtraContent,
      onChange: this.triggerTabChange,
      class: `${prefixCls}-head-tabs`,
    };

    let head;
    const tabs =
      tabList && tabList.length ? (
        <Tabs {...tabsProps}>
          {tabList.map(item => {
            const { tab: temp, slots } = item as CardTabListType;
            const name = slots?.tab;
            const tab = temp !== undefined ? temp : $slots[name] ? $slots[name](item) : null;
            return <TabPane tab={tab} key={item.key} disabled={item.disabled} />;
          })}
        </Tabs>
      ) : null;
    const titleDom = getComponent(this, 'title');
    const extraDom = getComponent(this, 'extra');
    if (titleDom || extraDom || tabs) {
      head = (
        <div class={`${prefixCls}-head`} style={headStyle}>
          <div class={`${prefixCls}-head-wrapper`}>
            {titleDom && <div class={`${prefixCls}-head-title`}>{titleDom}</div>}
            {extraDom && <div class={`${prefixCls}-extra`}>{extraDom}</div>}
          </div>
          {tabs}
        </div>
      );
    }

    const cover = getComponent(this, 'cover');
    const coverDom = cover ? <div class={`${prefixCls}-cover`}>{cover}</div> : null;
    const body = (
      <div class={`${prefixCls}-body`} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>
    );
    const actions = getComponent(this, 'actions');
    const actionDom =
      actions && actions.length ? (
        <ul class={`${prefixCls}-actions`}>{this.getAction(actions)}</ul>
      ) : null;

    return (
      <div class={classString} ref="cardContainerRef">
        {head}
        {coverDom}
        {children ? body : null}
        {actionDom}
      </div>
    );
  },
});

export default Card;
