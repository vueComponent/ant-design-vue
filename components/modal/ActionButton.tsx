import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import Button from '../button';
import BaseMixin from '../_util/BaseMixin';
import type { LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import { getSlot, findDOMNode } from '../_util/props-util';

const ActionButtonProps = {
  type: {
    type: String as PropType<LegacyButtonType>,
  },
  actionFn: PropTypes.func,
  closeModal: PropTypes.func,
  autofocus: PropTypes.looseBool,
  buttonProps: PropTypes.object,
};

export type IActionButtonProps = ExtractPropTypes<typeof ActionButtonProps>;

export default defineComponent({
  mixins: [BaseMixin],
  props: ActionButtonProps,
  setup() {
    return {
      timeoutId: undefined,
    };
  },
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
        let ret: any;
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
            (...args: any[]) => {
              // It's unnecessary to set loading=false, for the Modal will be unmounted after close.
              // this.setState({ loading: false });
              closeModal(...args);
            },
            (e: Event) => {
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
    const props = {
      ...convertLegacyProps(type),
      onClick: this.onClick,
      loading,
      ...buttonProps,
    };
    return <Button {...props}>{getSlot(this)}</Button>;
  },
});
