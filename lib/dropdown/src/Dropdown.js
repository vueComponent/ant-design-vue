'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _trigger = require('../../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: {
    minOverlayWidthMatchTrigger: _vueTypes2['default'].bool.def(true),
    prefixCls: _vueTypes2['default'].string.def('rc-dropdown'),
    transitionName: _vueTypes2['default'].string,
    overlayClassName: _vueTypes2['default'].string.def(''),
    animation: _vueTypes2['default'].any,
    align: _vueTypes2['default'].object,
    overlayStyle: _vueTypes2['default'].object.def({}),
    placement: _vueTypes2['default'].string.def('bottomLeft'),
    trigger: _vueTypes2['default'].array.def(['hover']),
    showAction: _vueTypes2['default'].array.def([]),
    hideAction: _vueTypes2['default'].array.def([]),
    getPopupContainer: _vueTypes2['default'].func,
    visible: _vueTypes2['default'].bool,
    defaultVisible: _vueTypes2['default'].bool.def(false),
    mouseEnterDelay: _vueTypes2['default'].number.def(0.15),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1)
  },
  data: function data() {
    var sVisible = this.defaultVisible;
    if ((0, _propsUtil.hasProp)(this, 'visible')) {
      sVisible = this.visible;
    }
    return {
      sVisible: sVisible
    };
  },

  watch: {
    visible: function visible(val) {
      if (val !== undefined) {
        this.setState({
          sVisible: val
        });
      }
    }
  },
  methods: {
    onClick: function onClick(e) {
      // do no call onVisibleChange, if you need click to hide, use onClick and control visible
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({
          sVisible: false
        });
      }
      this.$emit('overlayClick', e);
      if (this.childOriginEvents.click) {
        this.childOriginEvents.click(e);
      }
    },
    onVisibleChange: function onVisibleChange(visible) {
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({
          sVisible: visible
        });
      }
      this.__emit('visibleChange', visible);
    },
    getMenuElement: function getMenuElement() {
      var _this = this;

      var onClick = this.onClick,
          prefixCls = this.prefixCls,
          $slots = this.$slots;

      this.childOriginEvents = (0, _propsUtil.getEvents)($slots.overlay[0]);
      var extraOverlayProps = {
        props: {
          prefixCls: prefixCls + '-menu',
          getPopupContainer: function getPopupContainer() {
            return _this.getPopupDomNode();
          }
        },
        on: {
          click: onClick
        }
      };
      return (0, _vnode.cloneElement)($slots.overlay[0], extraOverlayProps);
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    afterVisibleChange: function afterVisibleChange(visible) {
      if (visible && this.$props.minOverlayWidthMatchTrigger) {
        var overlayNode = this.getPopupDomNode();
        var rootNode = this.$el;
        if (rootNode && overlayNode && rootNode.offsetWidth > overlayNode.offsetWidth) {
          overlayNode.style.minWidth = rootNode.offsetWidth + 'px';
          if (this.$refs.trigger && this.$refs.trigger._component && this.$refs.trigger._component.alignInstance) {
            this.$refs.trigger._component.alignInstance.forceAlign();
          }
        }
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        transitionName = _$props.transitionName,
        animation = _$props.animation,
        align = _$props.align,
        placement = _$props.placement,
        getPopupContainer = _$props.getPopupContainer,
        showAction = _$props.showAction,
        hideAction = _$props.hideAction,
        overlayClassName = _$props.overlayClassName,
        overlayStyle = _$props.overlayStyle,
        trigger = _$props.trigger,
        otherProps = (0, _objectWithoutProperties3['default'])(_$props, ['prefixCls', 'transitionName', 'animation', 'align', 'placement', 'getPopupContainer', 'showAction', 'hideAction', 'overlayClassName', 'overlayStyle', 'trigger']);


    var triggerProps = {
      props: (0, _extends3['default'])({}, otherProps, {
        prefixCls: prefixCls,
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: _placements2['default'],
        action: trigger,
        showAction: showAction,
        hideAction: hideAction,
        popupPlacement: placement,
        popupAlign: align,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        popupVisible: this.sVisible,
        afterPopupVisibleChange: this.afterVisibleChange,
        getPopupContainer: getPopupContainer
      }),
      on: {
        popupVisibleChange: this.onVisibleChange
      },
      ref: 'trigger'
    };
    var child = this.$slots['default'] && this.$slots['default'][0];
    return h(
      _trigger2['default'],
      triggerProps,
      [child && !child.tag ? h('span', [child]) : child, h(
        'template',
        { slot: 'popup' },
        [this.$slots.overlay && this.getMenuElement()]
      )]
    );
  }
};
module.exports = exports['default'];