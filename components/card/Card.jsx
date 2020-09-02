import { inject, isVNode } from 'vue';
import Tabs from '../tabs';
import Row from '../row';
import Col from '../col';
import PropTypes from '../_util/vue-types';
import { getComponent, getSlot, isEmptyElement } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';

const { TabPane } = Tabs;
export default {
  name: 'ACard',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    extra: PropTypes.any,
    bordered: PropTypes.bool.def(true),
    bodyStyle: PropTypes.object,
    headStyle: PropTypes.object,
    loading: PropTypes.bool.def(false),
    hoverable: PropTypes.bool.def(false),
    type: PropTypes.string,
    size: PropTypes.oneOf(['default', 'small']),
    actions: PropTypes.any,
    tabList: PropTypes.array,
    tabBarExtraContent: PropTypes.any,
    activeTabKey: PropTypes.string,
    defaultActiveTabKey: PropTypes.string,
    cover: PropTypes.any,
    onTabChange: PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    return {
      widerPadding: false,
    };
  },
  methods: {
    getAction(actions) {
      const actionList = actions.map((action, index) =>
        (isVNode(action) && !isEmptyElement(action)) || !isVNode(action) ? (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ) : null,
      );
      return actionList;
    },
    triggerTabChange(key) {
      this.$emit('tabChange', key);
    },
    isContainGrid(obj = []) {
      let containGrid;
      obj.forEach(element => {
        if (element && isPlainObject(element.type) && element.type.__ANT_CARD_GRID) {
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
    const getPrefixCls = this.configProvider.getPrefixCls;
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
            const { tab: temp, scopedSlots = {}, slots = {} } = item;
            const name = slots.tab || scopedSlots.tab;
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
};
