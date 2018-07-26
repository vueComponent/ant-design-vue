import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import Icon from '../icon';
import Input from '../input';

export var TransferSearchProps = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleClear: PropTypes.func
};

export default {
  name: 'Search',
  props: initDefaultProps(TransferSearchProps, {
    placeholder: ''
  }),
  methods: {
    handleChange: function handleChange(e) {
      this.$emit('change', e);
    },
    handleClear2: function handleClear2(e) {
      e.preventDefault();
      if (this.handleClear) {
        this.handleClear(e);
      }
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        placeholder = _getOptionProps.placeholder,
        value = _getOptionProps.value,
        prefixCls = _getOptionProps.prefixCls;

    var icon = value && value.length > 0 ? h(
      'a',
      {
        attrs: { href: '#' },
        'class': prefixCls + '-action', on: {
          'click': this.handleClear2
        }
      },
      [h(Icon, {
        attrs: { type: 'cross-circle' }
      })]
    ) : h(
      'span',
      { 'class': prefixCls + '-action' },
      [h(Icon, {
        attrs: { type: 'search' }
      })]
    );

    return h('div', [h(Input, {
      attrs: {
        placeholder: placeholder,

        value: value
      },
      'class': prefixCls, ref: 'input',
      on: {
        'change': this.handleChange
      }
    }), icon]);
  }
};