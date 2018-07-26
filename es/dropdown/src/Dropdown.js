import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../../_util/vue-types';
import Trigger from '../../trigger';
import placements from './placements';
import { hasProp, getEvents } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import { cloneElement } from '../../_util/vnode';

export default {
  mixins: [BaseMixin],
  props: {
    minOverlayWidthMatchTrigger: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-dropdown'),
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string.def(''),
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object.def({}),
    placement: PropTypes.string.def('bottomLeft'),
    trigger: PropTypes.array.def(['hover']),
    showAction: PropTypes.array.def([]),
    hideAction: PropTypes.array.def([]),
    getPopupContainer: PropTypes.func,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool.def(false),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1)
  },
  data: function data() {
    var sVisible = this.defaultVisible;
    if (hasProp(this, 'visible')) {
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
      if (!hasProp(this, 'visible')) {
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
      if (!hasProp(this, 'visible')) {
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

      this.childOriginEvents = getEvents($slots.overlay[0]);
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
      return cloneElement($slots.overlay[0], extraOverlayProps);
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
        otherProps = _objectWithoutProperties(_$props, ['prefixCls', 'transitionName', 'animation', 'align', 'placement', 'getPopupContainer', 'showAction', 'hideAction', 'overlayClassName', 'overlayStyle', 'trigger']);

    var triggerProps = {
      props: _extends({}, otherProps, {
        prefixCls: prefixCls,
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: placements,
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
      Trigger,
      triggerProps,
      [child && !child.tag ? h('span', [child]) : child, h(
        'template',
        { slot: 'popup' },
        [this.$slots.overlay && this.getMenuElement()]
      )]
    );
  }
};