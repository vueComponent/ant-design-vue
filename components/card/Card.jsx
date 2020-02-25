import omit from 'omit.js';
import Tabs from '../tabs';
import Row from '../row';
import Col from '../col';
import PropTypes from '../_util/vue-types';
import addEventListener from '../_util/Dom/addEventListener';
import {
  getComponentFromProp,
  getSlotOptions,
  filterEmpty,
  getListeners,
} from '../_util/props-util';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';

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
    activeTabKey: PropTypes.string,
    defaultActiveTabKey: PropTypes.string,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    this.updateWiderPaddingCalled = false;
    return {
      widerPadding: false,
    };
  },
  beforeMount() {
    this.updateWiderPadding = throttleByAnimationFrame(this.updateWiderPadding);
  },
  mounted() {
    this.updateWiderPadding();
    this.resizeEvent = addEventListener(window, 'resize', this.updateWiderPadding);
  },
  beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    this.updateWiderPadding.cancel && this.updateWiderPadding.cancel();
  },
  methods: {
    updateWiderPadding() {
      const cardContainerRef = this.$refs.cardContainerRef;
      if (!cardContainerRef) {
        return;
      }
      // 936 is a magic card width pixel number indicated by designer
      const WIDTH_BOUNDARY_PX = 936;
      if (cardContainerRef.offsetWidth >= WIDTH_BOUNDARY_PX && !this.widerPadding) {
        this.setState({ widerPadding: true }, () => {
          this.updateWiderPaddingCalled = true; // first render without css transition
        });
      }
      if (cardContainerRef.offsetWidth < WIDTH_BOUNDARY_PX && this.widerPadding) {
        this.setState({ widerPadding: false }, () => {
          this.updateWiderPaddingCalled = true; // first render without css transition
        });
      }
    },
    onHandleTabChange(key) {
      this.$emit('tabChange', key);
    },
    isContainGrid(obj = []) {
      let containGrid;
      obj.forEach(element => {
        if (element && getSlotOptions(element).__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    },
    getAction(actions) {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => (
        <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
          <span>{action}</span>
        </li>
      ));
      return actionList;
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

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const { $slots, $scopedSlots } = this;

    const classString = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-hoverable`]: !!hoverable,
      [`${prefixCls}-wider-padding`]: this.widerPadding,
      [`${prefixCls}-padding-transition`]: this.updateWiderPaddingCalled,
      [`${prefixCls}-contain-grid`]: this.isContainGrid($slots.default),
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
      props: {
        size: 'large',
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
          ? activeTabKey
          : defaultActiveTabKey,
      },
      on: {
        change: this.onHandleTabChange,
      },
      class: `${prefixCls}-head-tabs`,
    };

    let head;
    const tabs =
      tabList && tabList.length ? (
        <Tabs {...tabsProps}>
          {tabList.map(item => {
            const { tab: temp, scopedSlots = {} } = item;
            const name = scopedSlots.tab;
            const tab =
              temp !== undefined ? temp : $scopedSlots[name] ? $scopedSlots[name](item) : null;
            return <TabPane tab={tab} key={item.key} disabled={item.disabled} />;
          })}
        </Tabs>
      ) : null;
    const titleDom = getComponentFromProp(this, 'title');
    const extraDom = getComponentFromProp(this, 'extra');
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

    const children = $slots.default;
    const cover = getComponentFromProp(this, 'cover');
    const coverDom = cover ? <div class={`${prefixCls}-cover`}>{cover}</div> : null;
    const body = (
      <div class={`${prefixCls}-body`} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>
    );
    const actions = filterEmpty(this.$slots.actions);
    const actionDom =
      actions && actions.length ? (
        <ul class={`${prefixCls}-actions`}>{this.getAction(actions)}</ul>
      ) : null;

    return (
      <div
        class={classString}
        ref="cardContainerRef"
        {...{ on: omit(getListeners(this), ['tabChange', 'tab-change']) }}
      >
        {head}
        {coverDom}
        {children ? body : null}
        {actionDom}
      </div>
    );
  },
};
