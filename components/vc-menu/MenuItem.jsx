import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import BaseMixin from '../_util/BaseMixin';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from '../_util/store';
import { noop, menuAllProps } from './util';
import { getComponentFromProp, getListeners } from '../_util/props-util';

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
  mode: PropTypes.oneOf([
    'horizontal',
    'vertical',
    'vertical-left',
    'vertical-right',
    'inline',
  ]).def('vertical'),
  parentMenu: PropTypes.object,
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
  name: 'MenuItem',
  props,
  mixins: [BaseMixin],
  isMenuItem: true,
  created() {
    // invoke customized ref to expose component to mixin
    this.callRef();
  },
  updated() {
    this.$nextTick(() => {
      if (this.active) {
        scrollIntoView(this.$el, this.parentMenu.$el, {
          onlyScrollIfNeeded: true,
        });
      }
    });
    this.callRef();
  },
  beforeDestroy() {
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

    callRef() {
      if (this.manualRef) {
        this.manualRef(this);
      }
    },
  },

  render() {
    const props = { ...this.$props };
    const className = {
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
      click: props.disabled ? noop : this.onClick,
      mouseleave: props.disabled ? noop : this.onMouseLeave,
      mouseenter: props.disabled ? noop : this.onMouseEnter,
    };

    const style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = `${props.inlineIndent * props.level}px`;
    }
    const listeners = { ...getListeners(this) };
    menuAllProps.props.forEach(key => delete props[key]);
    menuAllProps.on.forEach(key => delete listeners[key]);
    const liProps = {
      attrs: {
        ...props,
        ...attrs,
      },
      on: {
        ...listeners,
        ...mouseEvent,
      },
    };
    return (
      <li {...liProps} style={style} class={className}>
        {this.$slots.default}
        {getComponentFromProp(this, 'itemIcon', props)}
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
