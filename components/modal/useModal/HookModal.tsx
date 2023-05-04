import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useConfigContextInject } from '../../config-provider/context';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import defaultLocale from '../../locale/en_US';
import ConfirmDialog from '../ConfirmDialog';
import type { ModalFuncProps } from '../Modal';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
export interface HookModalProps {
  afterClose: () => void;
  config: ModalFuncProps;
  destroyAction: (...args: any[]) => void;
  open: boolean;
}

export interface HookModalRef {
  destroy: () => void;
  update: (config: ModalFuncProps) => void;
}

const comfirmFuncProps = () => ({
  config: Object as PropType<ModalFuncProps>,
  afterClose: Function as PropType<() => void>,
  destroyAction: Function as PropType<(e: any) => void>,
  open: Boolean,
});

export default defineComponent({
  name: 'HookModal',
  inheritAttrs: false,
  props: initDefaultProps(comfirmFuncProps(), {
    config: {
      width: 520,
      okType: 'primary',
    },
  }),
  setup(props: HookModalProps, { expose }) {
    const open = computed(() => props.open);
    const innerConfig = computed(() => props.config);
    const { direction, getPrefixCls } = useConfigContextInject();
    const prefixCls = getPrefixCls('modal');
    const rootPrefixCls = getPrefixCls();

    const afterClose = () => {
      props?.afterClose();
      innerConfig.value.afterClose?.();
    };

    const close = (...args: any[]) => {
      props.destroyAction(...args);
    };

    expose({ destroy: close });
    const mergedOkCancel = innerConfig.value.okCancel ?? innerConfig.value.type === 'confirm';
    const [contextLocale] = useLocaleReceiver('Modal', defaultLocale.Modal);
    return () => (
      <ConfirmDialog
        prefixCls={prefixCls}
        rootPrefixCls={rootPrefixCls}
        {...innerConfig.value}
        close={close}
        open={open.value}
        afterClose={afterClose}
        okText={
          innerConfig.value.okText ||
          (mergedOkCancel ? contextLocale?.value.okText : contextLocale?.value.justOkText)
        }
        direction={innerConfig.value.direction || direction.value}
        cancelText={innerConfig.value.cancelText || contextLocale?.value.cancelText}
      />
    );
  },
});
