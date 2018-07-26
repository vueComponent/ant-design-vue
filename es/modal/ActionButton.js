
import PropTypes from '../_util/vue-types';
import Button from '../button';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
var ButtonType = buttonTypes().type;
var ActionButtonProps = {
  type: ButtonType,
  actionFn: PropTypes.func,
  closeModal: PropTypes.func,
  autoFocus: PropTypes.bool
};

export default {
  mixins: [BaseMixin],
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
      Button,
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