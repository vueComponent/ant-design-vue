import classnames from 'classnames';
import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import DropdownMenu from './DropdownMenu';
import { isSingleMode, saveRef } from './util';
import BaseMixin from '../_util/BaseMixin';
import { getListeners } from '../_util/props-util';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

export default {
  name: 'SelectTrigger',
  mixins: [BaseMixin],
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: PropTypes.bool,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    empty: PropTypes.bool,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    value: PropTypes.array,
    // children: PropTypes.any,
    showAction: PropTypes.arrayOf(PropTypes.string),
    combobox: PropTypes.bool,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    backfillValue: PropTypes.any,
    menuItemSelectedIcon: PropTypes.any,
    dropdownRender: PropTypes.func,
    ariaId: PropTypes.string,
  },
  data() {
    return {
      dropdownWidth: 0,
    };
  },
  created() {
    this.saveDropdownMenuRef = saveRef(this, 'dropdownMenuRef');
    this.saveTriggerRef = saveRef(this, 'triggerRef');
  },

  mounted() {
    this.$nextTick(() => {
      this.setDropdownWidth();
    });
  },

  updated() {
    this.$nextTick(() => {
      this.setDropdownWidth();
    });
  },
  methods: {
    setDropdownWidth() {
      const width = this.$el.offsetWidth;
      if (width !== this.dropdownWidth) {
        this.setState({ dropdownWidth: width });
      }
    },

    getInnerMenu() {
      return this.dropdownMenuRef && this.dropdownMenuRef.$refs.menuRef;
    },

    getPopupDOMNode() {
      return this.triggerRef.getPopupDomNode();
    },

    getDropdownElement(newProps) {
      const {
        value,
        firstActiveValue,
        defaultActiveFirstOption,
        dropdownMenuStyle,
        getDropdownPrefixCls,
        backfillValue,
        menuItemSelectedIcon,
      } = this;
      const { menuSelect, menuDeselect, popupScroll } = getListeners(this);
      const props = this.$props;

      const { dropdownRender, ariaId } = props;
      const dropdownMenuProps = {
        props: {
          ...newProps.props,
          ariaId,
          prefixCls: getDropdownPrefixCls(),
          value,
          firstActiveValue,
          defaultActiveFirstOption,
          dropdownMenuStyle,
          backfillValue,
          menuItemSelectedIcon,
        },
        on: {
          ...newProps.on,
          menuSelect,
          menuDeselect,
          popupScroll,
        },
        directives: [
          {
            name: 'ant-ref',
            value: this.saveDropdownMenuRef,
          },
        ],
      };
      const menuNode = <DropdownMenu {...dropdownMenuProps} />;

      if (dropdownRender) {
        return dropdownRender(menuNode, props);
      }
      return null;
    },

    getDropdownTransitionName() {
      const props = this.$props;
      let transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
      }
      return transitionName;
    },

    getDropdownPrefixCls() {
      return `${this.prefixCls}-dropdown`;
    },
  },

  render() {
    const { $props, $slots } = this;
    const {
      multiple,
      visible,
      inputValue,
      dropdownAlign,
      disabled,
      showSearch,
      dropdownClassName,
      dropdownStyle,
      dropdownMatchSelectWidth,
      options,
      getPopupContainer,
      showAction,
      empty,
    } = $props;
    const { mouseenter, mouseleave, popupFocus, dropdownVisibleChange } = getListeners(this);
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [dropdownClassName]: !!dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
      [`${dropdownPrefixCls}--empty`]: empty,
    };
    const popupElement = this.getDropdownElement({
      props: {
        menuItems: options,
        multiple,
        inputValue,
        visible,
      },
      on: {
        popupFocus,
      },
    });
    let hideAction;
    if (disabled) {
      hideAction = [];
    } else if (isSingleMode($props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    const popupStyle = { ...dropdownStyle };
    const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = `${this.dropdownWidth}px`;
    }
    const triggerProps = {
      props: {
        ...$props,
        showAction: disabled ? [] : showAction,
        hideAction,
        ref: 'triggerRef',
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        popupAlign: dropdownAlign,
        popupVisible: visible,
        getPopupContainer,
        popupClassName: classnames(popupClassName),
        popupStyle,
      },
      on: {
        popupVisibleChange: dropdownVisibleChange,
      },
      directives: [
        {
          name: 'ant-ref',
          value: this.saveTriggerRef,
        },
      ],
    };
    if (mouseenter) {
      triggerProps.on.mouseenter = mouseenter;
    }
    if (mouseleave) {
      triggerProps.on.mouseleave = mouseleave;
    }
    return (
      <Trigger {...triggerProps}>
        {$slots.default}
        <template slot="popup">{popupElement}</template>
      </Trigger>
    );
  },
};
