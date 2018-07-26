import _defineProperty from 'babel-runtime/helpers/defineProperty';

export default {
  name: 'ACheckableTag',
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: {
      'default': 'ant-tag',
      type: String
    },
    checked: Boolean
  },
  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          checked = this.checked;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-checkable', true), _defineProperty(_ref, prefixCls + '-checkable-checked', checked), _ref;
    }
  },
  methods: {
    handleClick: function handleClick() {
      var checked = this.checked;

      this.$emit('input', !checked);
      this.$emit('change', !checked);
    }
  },
  render: function render() {
    var h = arguments[0];
    var classes = this.classes,
        handleClick = this.handleClick,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': classes, on: {
          'click': handleClick
        }
      },
      [$slots['default']]
    );
  }
};