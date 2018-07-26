'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _tabs = require('../tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _propsUtil = require('../_util/props-util');

var _throttleByAnimationFrame = require('../_util/throttleByAnimationFrame');

var _throttleByAnimationFrame2 = _interopRequireDefault(_throttleByAnimationFrame);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabPane = _tabs2['default'].TabPane;
exports['default'] = {
  name: 'ACard',
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string.def('ant-card'),
    title: _vueTypes2['default'].string,
    extra: _vueTypes2['default'].any,
    bordered: _vueTypes2['default'].bool.def(true),
    bodyStyle: _vueTypes2['default'].object,
    loading: _vueTypes2['default'].bool.def(false),
    hoverable: _vueTypes2['default'].bool.def(false),
    type: _vueTypes2['default'].string,
    actions: _vueTypes2['default'].any,
    tabList: _vueTypes2['default'].array,
    activeTabKey: _vueTypes2['default'].string,
    defaultActiveTabKey: _vueTypes2['default'].string
  },
  data: function data() {
    this.updateWiderPaddingCalled = false;
    return {
      widerPadding: false
    };
  },
  beforeMount: function beforeMount() {
    this.updateWiderPadding = (0, _throttleByAnimationFrame2['default'])(this.updateWiderPadding);
  },
  mounted: function mounted() {
    this.updateWiderPadding();
    this.resizeEvent = (0, _addEventListener2['default'])(window, 'resize', this.updateWiderPadding);
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
        if (element && element.componentOptions && (0, _propsUtil.getComponentName)(element.componentOptions) === 'Grid') {
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


    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, '' + prefixCls, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-loading', loading), (0, _defineProperty3['default'])(_classString, prefixCls + '-bordered', bordered), (0, _defineProperty3['default'])(_classString, prefixCls + '-hoverable', !!hoverable), (0, _defineProperty3['default'])(_classString, prefixCls + '-wider-padding', this.widerPadding), (0, _defineProperty3['default'])(_classString, prefixCls + '-padding-transition', this.updateWiderPaddingCalled), (0, _defineProperty3['default'])(_classString, prefixCls + '-contain-grid', this.isContainGrid($slots['default'])), (0, _defineProperty3['default'])(_classString, prefixCls + '-contain-tabs', tabList && tabList.length), (0, _defineProperty3['default'])(_classString, prefixCls + '-type-' + type, !!type), _classString);

    var loadingBlock = h(
      'div',
      { 'class': prefixCls + '-loading-content' },
      [h('p', { 'class': prefixCls + '-loading-block', style: { width: '94%' } }), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '28%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '62%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '22%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '66%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '56%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '39%' } })]), h('p', [h('span', { 'class': prefixCls + '-loading-block', style: { width: '21%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '15%' } }), h('span', { 'class': prefixCls + '-loading-block', style: { width: '40%' } })])]
    );

    var hasActiveTabKey = activeTabKey !== undefined;
    var tabsProps = {
      props: (0, _defineProperty3['default'])({
        size: 'large'
      }, hasActiveTabKey ? 'activeKey' : 'defaultActiveKey', hasActiveTabKey ? activeTabKey : defaultActiveTabKey),
      on: {
        change: this.onHandleTabChange
      },
      'class': prefixCls + '-head-tabs'
    };

    var head = void 0;
    var tabs = tabList && tabList.length ? h(
      _tabs2['default'],
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
    var titleDom = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var extraDom = (0, _propsUtil.getComponentFromProp)(this, 'extra');
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
    var cover = (0, _propsUtil.getComponentFromProp)(this, 'cover');
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
    var actions = (0, _propsUtil.getComponentFromProp)(this, 'actions');
    var actionDom = actions || null;

    return h(
      'div',
      { 'class': classString, ref: 'cardContainerRef' },
      [head, coverDom, children ? body : null, actionDom]
    );
  }
};
module.exports = exports['default'];