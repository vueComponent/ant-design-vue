'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _buttonTypes = require('../button/buttonTypes');

var _buttonTypes2 = _interopRequireDefault(_buttonTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonType = (0, _buttonTypes2['default'])().type;
var ActionButtonProps = {
  type: ButtonType,
  actionFn: _vueTypes2['default'].func,
  closeModal: _vueTypes2['default'].func,
  autoFocus: _vueTypes2['default'].bool
};

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: ActionButtonProps,
  data: function data() {
    return {
      loading: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.autoFocus) {
      this.timeoutId = setTimeout(function () {
        return _this.$el.focus();
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.timeoutId);
  },

  methods: {
    onClick: function onClick() {
      var _this2 = this;

      var actionFn = this.actionFn,
          closeModal = this.closeModal;

      if (actionFn) {
        var ret = void 0;
        if (actionFn.length) {
          ret = actionFn(closeModal);
        } else {
          ret = actionFn();
          if (!ret) {
            closeModal();
          }
        }
        if (ret && ret.then) {
          this.setState({ loading: true });
          ret.then(function () {
            // It's unnecessary to set loading=false, for the Modal will be unmounted after close.
            // this.setState({ loading: false });
            closeModal.apply(undefined, arguments);
          }, function () {
            // See: https://github.com/ant-design/ant-design/issues/6183
            _this2.setState({ loading: false });
          });
        }
      } else {
        closeModal();
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var type = this.type,
        $slots = this.$slots,
        loading = this.loading;

    return h(
      _button2['default'],
      {
        attrs: { type: type, loading: loading },
        on: {
          'click': this.onClick
        }
      },
      [$slots['default']]
    );
  }
};
module.exports = exports['default'];