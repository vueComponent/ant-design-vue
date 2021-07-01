import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import Input from '../input';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';

export const transferSearchProps = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleClear: PropTypes.func,
  disabled: PropTypes.looseBool,
  onChange: PropTypes.func,
};

export type TransferSearchProps = Partial<ExtractPropTypes<typeof transferSearchProps>>;

export default defineComponent({
  name: 'Search',
  inheritAttrs: false,
  props: initDefaultProps(transferSearchProps, {
    placeholder: '',
  }),
  emits: ['change'],
  setup(props, { emit }) {
    const handleChange = (e: Event) => {
      emit('change', e);
    };

    const handleClearFn = (e: Event) => {
      const { handleClear, disabled } = props;
      if (!disabled && handleClear) {
        handleClear(e);
      }
    };

    return () => {
      const { placeholder, value, prefixCls, disabled } = props;
      const icon =
        value && value.length > 0 ? (
          <a class={`${prefixCls}-action`} onClick={handleClearFn}>
            <CloseCircleFilled />
          </a>
        ) : (
          <span class={`${prefixCls}-action`}>
            <SearchOutlined />
          </span>
        );
      return (
        <>
          <Input
            placeholder={placeholder}
            class={prefixCls}
            value={value}
            onChange={handleChange}
            disabled={disabled}
          />
          {icon}
        </>
      );
    };
  },
});
