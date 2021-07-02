import Menu, { Item as MenuItem } from '../../menu';
import PropTypes from '../../_util/vue-types';
import { defineComponent, inject } from 'vue';

function noop() {}

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    prefixCls: PropTypes.string,
    options: PropTypes.any,
  },
  setup(props) {
    return () => {
      const {
        notFoundContent,
        activeIndex,
        setActiveIndex,
        selectOption,
        onFocus = noop,
        onBlur = noop,
      } = inject('mentionsContext');

      const { prefixCls, options } = props;
      const activeOption = options[activeIndex.value] || {};

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
                {notFoundContent.value}
              </MenuItem>
            ),
          ].filter(Boolean)}
        </Menu>
      );
    };
  },
});
