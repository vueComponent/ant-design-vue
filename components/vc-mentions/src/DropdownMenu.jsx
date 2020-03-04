import Menu, { MenuItem } from '../../vc-menu';
import PropTypes from '../../_util/vue-types';
import { OptionProps } from './Option';

function noop() {}
export default {
  name: 'DropdownMenu',
  props: {
    prefixCls: PropTypes.string,
    options: PropTypes.arrayOf(OptionProps),
  },
  inject: {
    mentionsContext: { default: {} },
  },

  render() {
    const {
      notFoundContent,
      activeIndex,
      setActiveIndex,
      selectOption,
      onFocus = noop,
      onBlur = noop,
    } = this.mentionsContext;
    const { prefixCls, options } = this.$props;
    const activeOption = options[activeIndex] || {};

    return (
      <Menu
        {...{
          props: {
            prefixCls: `${prefixCls}-menu`,
            activeKey: activeOption.value,
          },
          on: {
            select: ({ key }) => {
              const option = options.find(({ value }) => value === key);
              selectOption(option);
            },
            focus: onFocus,
            blur: onBlur,
          },
        }}
      >
        {options.map((option, index) => {
          const { value, disabled, children } = option;
          return (
            <MenuItem
              key={value}
              disabled={disabled}
              onMouseenter={() => {
                setActiveIndex(index);
              }}
            >
              {children}
            </MenuItem>
          );
        })}
        {!options.length && <MenuItem disabled>{notFoundContent}</MenuItem>}
      </Menu>
    );
  },
};
