import Menu, { Item as MenuItem } from '../../menu';
import PropTypes from '../../_util/vue-types';
import { OptionProps } from './Option';
import { inject } from 'vue';

function noop() {}
export default {
  name: 'DropdownMenu',
  props: {
    prefixCls: PropTypes.string,
    options: PropTypes.arrayOf(OptionProps),
  },
  setup() {
    return {
      mentionsContext: inject('mentionsContext'),
    };
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
        prefixCls={`${prefixCls}-menu`}
        activeKey={activeOption.value}
        onSelect={({ key }) => {
          const option = options.find(({ value }) => value === key);
          selectOption(option);
        }}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {[
          ...options.map((option, index) => {
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
          }),
          !options.length && (
            <MenuItem key="notFoundContent" disabled>
              {notFoundContent}
            </MenuItem>
          ),
        ].filter(Boolean)}
      </Menu>
    );
  },
};
