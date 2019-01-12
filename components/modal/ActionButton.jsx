import PropTypes from '../_util/vue-types';
import Button from '../button';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
const ButtonType = buttonTypes().type;
const ActionButtonProps = {
  type: ButtonType,
  actionFn: PropTypes.func,
  closeModal: PropTypes.func,
  autoFocus: PropTypes.bool,
  buttonProps: PropTypes.object,
};

export default {
  mixins: [BaseMixin],
  props: ActionButtonProps,
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    if (this.autoFocus) {
      this.timeoutId = setTimeout(() => this.$el.focus());
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    onClick() {
      const { actionFn, closeModal } = this;
      if (actionFn) {
        let ret;
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
          ret.then(
            (...args) => {
              // It's unnecessary to set loading=false, for the Modal will be unmounted after close.
              // this.setState({ loading: false });
              closeModal(...args);
            },
            () => {
              // See: https://github.com/ant-design/ant-design/issues/6183
              this.setState({ loading: false });
            },
          );
        }
      } else {
        closeModal();
      }
    },
  },

  render() {
    const { type, $slots, loading, buttonProps } = this;
    return (
      <Button type={type} onClick={this.onClick} loading={loading} {...buttonProps}>
        {$slots.default}
      </Button>
    );
  },
};
