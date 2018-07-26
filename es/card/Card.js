import _defineProperty from 'babel-runtime/helpers/defineProperty';

import Tabs from '../tabs';
import PropTypes from '../_util/vue-types';
import addEventListener from '../_util/Dom/addEventListener';
import { getComponentFromProp, getComponentName } from '../_util/props-util';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import BaseMixin from '../_util/BaseMixin';

var TabPane = Tabs.TabPane;

export default {
  name: 'ACard',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
    title: PropTypes.string,
    extra: PropTypes.any,
    bordered: PropTypes.bool.def(true),
    bodyStyle: PropTypes.object,
    loading: PropTypes.bool.def(false),
    hoverable: PropTypes.bool.def(false),
    type: PropTypes.string,
    actions: PropTypes.any,
    tabList: PropTypes.array,
    activeTabKey: PropTypes.string,
    defaultActiveTabKey: PropTypes.string
  },
  data: function data() {
    this.updateWiderPaddingCalled = false;
    return {
      widerPadding: false
    };
  },
  beforeMount: function beforeMount() {
    this.updateWiderPadding = throttleByAnimationFrame(this.updateWiderPadding);
  },
  mounted: function mounted() {
    this.updateWiderPadding();
    this.resizeEvent = addEventListener(window, 'resize', this.updateWiderPadding);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    this.updateWiderPadding.cancel && this.updateWiderPadding.cancel();
  },

  methods: {
    updateWiderPadding: function updateWiderPadding() {
      var _this = this;

      var cardContainerRef = this.$refs.cardContainerRef;
      if (!cardContainerRef) {
        return;
      }
      // 936 is a magic card width pixer number indicated by designer
      var WIDTH_BOUDARY_PX = 936;
      if (cardContainerRef.offsetWidth >= WIDTH_BOUDARY_PX && !this.widerPadding) {
        this.setState({ widerPadding: true }, function () {
          _this.updateWiderPaddingCalled = true; // first render without css transition
        });
      }
      if (cardContainerRef.offsetWidth < WIDTH_BOUDARY_PX && this.widerPadding) {
        this.setState({ widerPadding: false }, function () {
          _this.updateWiderPaddingCalled = true; // first render without css transition
        });
      }
    },
    onHandleTabChange: function onHandleTabChange(key) {
      this.$emit('tabChange', key);
    },
    isContainGrid: function isContainGrid() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var containGrid = void 0;
      obj.forEach(function (element) {
        if (element && element.componentOptions && getComponentName(element.componentOptions) === 'Grid') {
          containGrid = true;
        }
      });
      return containGrid;
    }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];
    var _$props = this.$props,
        _$props$prefixCls = _$props.prefixCls,
        prefixCls = _$props$prefixCls === undefined ? 'ant-card' : _$props$prefixCls,
        bodyStyle = _$props.bodyStyle,
        loading = _$props.loading,
        _$props$bordered = _$props.bordered,
        bordered = _$props$bordered === undefined ? true : _$props$bordered,
        type = _$props.type,
        tabList = _$props.tabList,
        hoverable = _$props.hoverable,
        activeTabKey = _$props.activeTabKey,
        defaultActiveTabKey = _$props.defaultActiveTabKey;
    var $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;


    var classString = (_classString = {}, _defineProperty(_classString, '' + prefixCls, true), _defineProperty(_classString, prefixCls + '-loading', loading), _defineProperty(_classString, prefixCls + '-bordered', bordered), _defineProperty(_classString, prefixCls + '-hoverable', !!hoverable), _defineProperty(_classString, prefixCls + '-wider-padding', this.widerPadding), _defineProperty(_classString, prefixCls + '-padding-transition', this.updateWiderPaddingCalled), _defineProperty(_classString, prefixCls + '-contain-grid', this.isContainGrid($slots['default'])), _defineProperty(_classString, prefixCls + '-contain-tabs', tabList && tabList.length), _defineProperty(_classString, prefixCls + '-type-' + type, !!type), _classString);

    var loadingBlock = h(
      'div',
      { 'class': prefixCls + '-loading-content' },
      [h('p', { 'class': prefixCls + '-loading-block', style: { width: '94%' } }), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '28%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '62%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '22%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '66%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '56%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '39%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '21%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '15%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '40%' } })])]
    );

    var hasActiveTabKey = activeTabKey !== undefined;
    var tabsProps = {
      props: _defineProperty({
        size: 'large'
      }, hasActiveTabKey ? 'activeKey' : 'defaultActiveKey', hasActiveTabKey ? activeTabKey : defaultActiveTabKey),
      on: {
        change: this.onHandleTabChange
      },
      'class': prefixCls + '-head-tabs'
    };

    var head = void 0;
    var tabs = tabList && tabList.length ? h(
      Tabs,
      tabsProps,
      [tabList.map(function (item) {
        var temp = item.tab,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots;

        var name = scopedSlots.tab;
        var tab = temp !== undefined ? temp : $scopedSlots[name] ? $scopedSlots[name](item) : null;
        return h(TabPane, {
          attrs: { tab: tab },
          key: item.key });
      })]
    ) : null;
    var titleDom = getComponentFromProp(this, 'title');
    var extraDom = getComponentFromProp(this, 'extra');
    if (titleDom || extraDom || tabs) {
      head = h(
        'div',
        { 'class': prefixCls + '-head' },
        [h(
          'div',
          { 'class': prefixCls + '-head-wrapper' },
          [titleDom && h(
            'div',
            { 'class': prefixCls + '-head-title' },
            [titleDom]
          ), extraDom && h(
            'div',
            { 'class': prefixCls + '-extra' },
            [extraDom]
          )]
        ), tabs]
      );
    }

    var children = $slots['default'];
    var cover = getComponentFromProp(this, 'cover');
    var coverDom = cover ? h(
      'div',
      { 'class': prefixCls + '-cover' },
      [cover]
    ) : null;
    var body = h(
      'div',
      { 'class': prefixCls + '-body', style: bodyStyle },
      [loading ? loadingBlock : children]
    );
    var actions = getComponentFromProp(this, 'actions');
    var actionDom = actions || null;

    return h(
      'div',
      { 'class': classString, ref: 'cardContainerRef' },
      [head, coverDom, children ? body : null, actionDom]
    );
  }
};