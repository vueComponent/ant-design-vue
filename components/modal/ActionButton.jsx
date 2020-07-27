import PropTypes from '../_util/vue-types';
import Button from '../button';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import { getSlot, findDOMNode } from '../_util/props-util';
const ButtonType = buttonTypes().type;
const ActionButtonProps = {
  type: ButtonType,
  actionFn: PropTypes.func,
  closeModal: PropTypes.func,
  autofocus: PropTypes.bool,
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
    if (this.autofocus) {
      this.timeoutId = setTimeout(() => findDOMNode(this).focus());
    }
  },
  beforeUnmount() {
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
            e => {
              // Emit error when catch promise reject
              // eslint-disable-next-line no-console
              console.error(e);
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
    const { type, loading, buttonProps } = this;
    return (
      <Button type={type} onClick={this.onClick} loading={loading} {...buttonProps}>
        {getSlot(this)}
      </Button>
    );
  },
};
