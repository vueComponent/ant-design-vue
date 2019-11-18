import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import Icon from '../icon';
import Input from '../input';

export const TransferSearchProps = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleClear: PropTypes.func,
  disabled: PropTypes.bool,
};

export default {
  name: 'Search',
  props: initDefaultProps(TransferSearchProps, {
    placeholder: '',
  }),
  methods: {
    handleChange(e) {
      this.$emit('change', e);
    },
    handleClear2(e) {
      e.preventDefault();
      const { handleClear, disabled } = this.$props;
      if (!disabled && handleClear) {
        handleClear(e);
      }
    },
  },
  render() {
    const { placeholder, value, prefixCls, disabled } = getOptionProps(this);
    const icon =
      value && value.length > 0 ? (
        <a href="#" class={`${prefixCls}-action`} onClick={this.handleClear2}>
          <Icon type="close-circle" theme="filled" />
        </a>
      ) : (
        <span class={`${prefixCls}-action`}>
          <Icon type="search" />
        </span>
      );

    return (
      <div>
        <Input
          placeholder={placeholder}
          class={prefixCls}
          value={value}
          onChange={this.handleChange}
          disabled={disabled}
        />
        {icon}
      </div>
    );
  },
};
