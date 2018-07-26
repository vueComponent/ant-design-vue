import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

export default {
  name: 'AIcon',
  props: {
    prefixCls: {
      'default': 'anticon',
      type: String
    },
    type: String,
    title: String,
    spin: Boolean
  },
  data: function data() {
    return {};
  },

  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          type = this.type,
          spin = this.spin;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + type, type), _defineProperty(_ref, prefixCls + '-spin', !!spin || type === 'loading'), _ref;
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      var _this = this;

      if (this.clicked) {
        return;
      }

      this.clicked = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        return _this.clicked = false;
      }, 500);
      this.$emit('click', event);
    }
  },
  render: function render() {
    var h = arguments[0];
    var title = this.title,
        classes = this.classes,
        handleClick = this.handleClick,
        $listeners = this.$listeners;

    var iconProps = {
      attrs: {
        title: title
      },
      'class': classes,
      on: _extends({}, $listeners, {
        click: handleClick
      })
    };
    return h('i', iconProps);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
};