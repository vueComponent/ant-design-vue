import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import BaseMixin from '../_util/BaseMixin';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from '../_util/store';
import { noop, menuAllProps } from './util';
import { getComponent, getSlot, findDOMNode } from '../_util/props-util';
import { inject } from 'vue';

const props = {
  attribute: PropTypes.object,
  rootPrefixCls: PropTypes.string,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  selectedKeys: PropTypes.array,
  disabled: PropTypes.bool,
  title: PropTypes.any,
  index: PropTypes.number,
  inlineIndent: PropTypes.number.def(24),
  level: PropTypes.number.def(1),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  multiple: PropTypes.bool,
  value: PropTypes.any,
  isSelected: PropTypes.bool,
  manualRef: PropTypes.func.def(noop),
  role: PropTypes.any,
  subMenuKey: PropTypes.string,
  itemIcon: PropTypes.any,
  // clearSubMenuTimers: PropTypes.func.def(noop),
};
const MenuItem = {
  name: 'AMenuItem',
  inheritAttrs: false,
  props,
  mixins: [BaseMixin],
  isMenuItem: true,
  setup() {
    return { parentMenu: inject('parentMenu', undefined) };
  },
  created() {
    this.prevActive = this.active;
    // invoke customized ref to expose component to mixin
    this.callRef();
  },
  updated() {
    this.$nextTick(() => {
      const { active, parentMenu, eventKey } = this;
      if (!this.prevActive && active && (!parentMenu || !parentMenu[`scrolled-${eventKey}`])) {
        scrollIntoView(findDOMNode(this.node), findDOMNode(parentMenu), {
          onlyScrollIfNeeded: true,
        });
        parentMenu[`scrolled-${eventKey}`] = true;
      } else if (parentMenu && parentMenu[`scrolled-${eventKey}`]) {
        delete parentMenu[`scrolled-${eventKey}`];
      }
      this.prevActive = active;
    });
    this.callRef();
  },
  beforeUnmount() {
    const props = this.$props;
    this.__emit('destroy', props.eventKey);
  },
  methods: {
    onKeyDown(e) {
      const keyCode = e.keyCode;
      if (keyCode === KeyCode.ENTER) {
        this.onClick(e);
        return true;
      }
    },

    onMouseLeave(e) {
      const { eventKey } = this.$props;
      this.__emit('itemHover', {
        key: eventKey,
        hover: false,
      });
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e,
      });
    },

    onMouseEnter(e) {
      const { eventKey } = this;
      this.__emit('itemHover', {
        key: eventKey,
        hover: true,
      });
      this.__emit('mouseenter', {
        key: eventKey,
        domEvent: e,
      });
    },

    onClick(e) {
      const { eventKey, multiple, isSelected } = this.$props;
      const info = {
        key: eventKey,
        keyPath: [eventKey],
        item: this,
        domEvent: e,
      };

      this.__emit('click', info);
      if (multiple) {
        if (isSelected) {
          this.__emit('deselect', info);
        } else {
          this.__emit('select', info);
        }
      } else if (!isSelected) {
        this.__emit('select', info);
      }
    },

    getPrefixCls() {
      return `${this.$props.rootPrefixCls}-item`;
    },

    getActiveClassName() {
      return `${this.getPrefixCls()}-active`;
    },

    getSelectedClassName() {
      return `${this.getPrefixCls()}-selected`;
    },

    getDisabledClassName() {
      return `${this.getPrefixCls()}-disabled`;
    },
    saveNode(node) {
      this.node = node;
    },
    callRef() {
      if (this.manualRef) {
        this.manualRef(this);
      }
    },
  },

  render() {
    const { class: cls, style, ...props } = { ...this.$props, ...this.$attrs };

    const className = {
      [cls]: !!cls,
      [this.getPrefixCls()]: true,
      [this.getActiveClassName()]: !props.disabled && props.active,
      [this.getSelectedClassName()]: props.isSelected,
      [this.getDisabledClassName()]: props.disabled,
    };
    let attrs = {
      ...props.attribute,
      title: props.title,
      role: props.role || 'menuitem',
      'aria-disabled': props.disabled,
    };
    if (props.role === 'option') {
      // overwrite to option
      attrs = {
        ...attrs,
        role: 'option',
        'aria-selected': props.isSelected,
      };
    } else if (props.role === null || props.role === 'none') {
      // sometimes we want to specify role inside <li/> element
      // <li><a role='menuitem'>Link</a></li> would be a good example
      // in this case the role on <li/> should be "none" to
      // remove the implied listitem role.
      // https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
      attrs.role = 'none';
    }
    // In case that onClick/onMouseLeave/onMouseEnter is passed down from owner
    const mouseEvent = {
      onClick: props.disabled ? noop : this.onClick,
      onMouseleave: props.disabled ? noop : this.onMouseLeave,
      onMouseenter: props.disabled ? noop : this.onMouseEnter,
    };

    const styles = { ...(style || {}) };
    if (props.mode === 'inline') {
      styles.paddingLeft = `${props.inlineIndent * props.level}px`;
    }
    menuAllProps.forEach(key => delete props[key]);
    const liProps = {
      ...props,
      ...attrs,
      ...mouseEvent,
      ref: this.saveNode,
    };
    delete liProps.children;
    return (
      <li {...liProps} style={styles} class={className}>
        {getSlot(this)}
        {getComponent(this, 'itemIcon', props)}
      </li>
    );
  },
};

const connected = connect(({ activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
  active: activeKey[subMenuKey] === eventKey,
  isSelected: selectedKeys.indexOf(eventKey) !== -1,
}))(MenuItem);

export default connected;
export { props as menuItemProps };
