'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferSearchProps = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TransferSearchProps = exports.TransferSearchProps = {
  prefixCls: _vueTypes2['default'].string,
  placeholder: _vueTypes2['default'].string,
  value: _vueTypes2['default'].any,
  handleClear: _vueTypes2['default'].func
};

exports['default'] = {
  name: 'Search',
  props: (0, _propsUtil.initDefaultProps)(TransferSearchProps, {
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

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
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
      [h(_icon2['default'], {
        attrs: { type: 'cross-circle' }
      })]
    ) : h(
      'span',
      { 'class': prefixCls + '-action' },
      [h(_icon2['default'], {
        attrs: { type: 'search' }
      })]
    );

    return h('div', [h(_input2['default'], {
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