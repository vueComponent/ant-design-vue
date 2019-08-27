import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import placements from './placements';
import { hasProp, getEvents, getOptionProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import { cloneElement } from '../../_util/vnode';

export default {
  mixins: [BaseMixin],
  props: {
    minOverlayWidthMatchTrigger: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-dropdown'),
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string.def(''),
    openClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object.def({}),
    placement: PropTypes.string.def('bottomLeft'),
    overlay: PropTypes.any,
    trigger: PropTypes.array.def(['hover']),
    alignPoint: PropTypes.bool,
    showAction: PropTypes.array.def([]),
    hideAction: PropTypes.array.def([]),
    getPopupContainer: PropTypes.func,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool.def(false),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
  },
  data() {
    let sVisible = this.defaultVisible;
    if (hasProp(this, 'visible')) {
      sVisible = this.visible;
    }
    return {
      sVisible,
    };
  },
  watch: {
    visible(val) {
      if (val !== undefined) {
        this.setState({
          sVisible: val,
        });
      }
    },
  },
  methods: {
    onClick(e) {
      // do no call onVisibleChange, if you need click to hide, use onClick and control visible
      if (!hasProp(this, 'visible')) {
        this.setState({
          sVisible: false,
        });
      }
      this.$emit('overlayClick', e);
      if (this.childOriginEvents.click) {
        this.childOriginEvents.click(e);
      }
    },

    onVisibleChange(visible) {
      if (!hasProp(this, 'visible')) {
        this.setState({
          sVisible: visible,
        });
      }
      this.__emit('visibleChange', visible);
    },

    getMinOverlayWidthMatchTrigger() {
      const props = getOptionProps(this);
      const { minOverlayWidthMatchTrigger, alignPoint } = props;
      if ('minOverlayWidthMatchTrigger' in props) {
        return minOverlayWidthMatchTrigger;
      }

      return !alignPoint;
    },

    getOverlayElement() {
      const overlay = this.overlay || this.$slots.overlay || this.$scopedSlots.overlay;
      let overlayElement;
      if (typeof overlay === 'function') {
        overlayElement = overlay();
      } else {
        overlayElement = overlay;
      }
      return overlayElement;
    },

    getMenuElement() {
      const { onClick, prefixCls, $slots } = this;
      this.childOriginEvents = getEvents($slots.overlay[0]);
      const overlayElement = this.getOverlayElement();
      const extraOverlayProps = {
        props: {
          prefixCls: `${prefixCls}-menu`,
          getPopupContainer: () => this.getPopupDomNode(),
        },
        on: {
          click: onClick,
        },
      };
      if (typeof overlayElement.type === 'string') {
        delete extraOverlayProps.props.prefixCls;
      }
      return cloneElement($slots.overlay[0], extraOverlayProps);
    },

    getMenuElementOrLambda() {
      const overlay = this.overlay || this.$slots.overlay || this.$scopedSlots.overlay;
      if (typeof overlay === 'function') {
        return this.getMenuElement;
      }
      return this.getMenuElement();
    },

    getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    },

    getOpenClassName() {
      const { openClassName, prefixCls } = this.$props;
      if (openClassName !== undefined) {
        return openClassName;
      }
      return `${prefixCls}-open`;
    },

    afterVisibleChange(visible) {
      if (visible && this.getMinOverlayWidthMatchTrigger()) {
        const overlayNode = this.getPopupDomNode();
        const rootNode = this.$el;
        if (rootNode && overlayNode && rootNode.offsetWidth > overlayNode.offsetWidth) {
          overlayNode.style.minWidth = `${rootNode.offsetWidth}px`;
          if (
            this.$refs.trigger &&
            this.$refs.trigger._component &&
            this.$refs.trigger._component.alignInstance
          ) {
            this.$refs.trigger._component.alignInstance.forceAlign();
          }
        }
      }
    },

    renderChildren() {
      const children = this.$slots.default && this.$slots.default[0];
      const { sVisible } = this;
      return sVisible && children
        ? cloneElement(children, { class: this.getOpenClassName() })
        : children;
    },
  },

  render() {
    const {
      prefixCls,
      transitionName,
      animation,
      align,
      placement,
      getPopupContainer,
      showAction,
      hideAction,
      overlayClassName,
      overlayStyle,
      trigger,
      ...otherProps
    } = this.$props;
    let triggerHideAction = hideAction;
    if (!triggerHideAction && trigger.indexOf('contextmenu') !== -1) {
      triggerHideAction = ['click'];
    }

    const triggerProps = {
      props: {
        ...otherProps,
        prefixCls,
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: placements,
        action: trigger,
        showAction,
        hideAction: triggerHideAction || [],
        popupPlacement: placement,
        popupAlign: align,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        popupVisible: this.sVisible,
        afterPopupVisibleChange: this.afterVisibleChange,
        getPopupContainer: getPopupContainer,
      },
      on: {
        popupVisibleChange: this.onVisibleChange,
      },
      ref: 'trigger',
    };
    const child = this.$slots.default && this.$slots.default[0];
    return (
      <Trigger {...triggerProps}>
        {this.renderChildren()}
        <template slot="popup">{this.$slots.overlay && this.getMenuElement()}</template>
      </Trigger>
    );
  },
};
