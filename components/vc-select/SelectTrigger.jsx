import classnames from '../_util/classNames';
import raf from 'raf';
import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import DropdownMenu from './DropdownMenu';
import { isSingleMode, saveRef } from './util';
import BaseMixin from '../_util/BaseMixin';
import { findDOMNode, getSlot } from '../_util/props-util';

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
  inheritAttrs: false,
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
    this.rafInstance = null;
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
  beforeUnmount() {
    this.cancelRafInstance();
  },
  methods: {
    setDropdownWidth() {
      this.cancelRafInstance();
      this.rafInstance = raf(() => {
        const width = findDOMNode(this)?.offsetWidth;
        if (width !== this.dropdownWidth) {
          this.setState({ dropdownWidth: width });
        }
      });
    },
    cancelRafInstance() {
      if (this.rafInstance) {
        raf.cancel(this.rafInstance);
      }
    },
    getInnerMenu() {
      return this.dropdownMenuRef && this.dropdownMenuRef.menuRef;
    },

    getPopupDOMNode() {
      return this.triggerRef.getPopupDomNode();
    },

    getDropdownElement(newProps) {
      const props = { ...this.$props, ...this.$attrs };
      const { dropdownRender, ariaId } = props;
      const menuNode = (
        <DropdownMenu
          ref={this.saveDropdownMenuRef}
          {...newProps}
          ariaId={ariaId}
          prefixCls={this.getDropdownPrefixCls()}
          onMenuSelect={props.onMenuSelect}
          onMenuDeselect={props.onMenuDeselect}
          onPopupScroll={props.onPopupScroll}
          value={props.value}
          backfillValue={props.backfillValue}
          firstActiveValue={props.firstActiveValue}
          defaultActiveFirstOption={props.defaultActiveFirstOption}
          dropdownMenuStyle={props.dropdownMenuStyle}
          menuItemSelectedIcon={props.menuItemSelectedIcon}
        />
      );

      if (dropdownRender) {
        return dropdownRender({ menuNode, props });
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
    const { onPopupFocus, empty, ...props } = { ...this.$props, ...this.$attrs };
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
    } = props;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [dropdownClassName]: !!dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
      [`${dropdownPrefixCls}--empty`]: empty,
    };
    const popupElement = this.getDropdownElement({
      menuItems: props.options,
      multiple,
      inputValue,
      visible,
      onPopupFocus,
    });
    let hideAction;
    if (disabled) {
      hideAction = [];
    } else if (isSingleMode(props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    const popupStyle = { ...dropdownStyle };
    const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = `${this.dropdownWidth}px`;
    }
    return (
      <Trigger
        {...props}
        showAction={disabled ? [] : this.$props.showAction}
        hideAction={hideAction}
        ref={this.saveTriggerRef}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={popupElement}
        popupAlign={dropdownAlign}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classnames(popupClassName)}
        popupStyle={popupStyle}
      >
        {getSlot(this)[0]}
      </Trigger>
    );
  },
};
