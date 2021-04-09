import { defineComponent, inject, onBeforeMount, ref, ExtractPropTypes } from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import PropTypes from '../_util/vue-types';
import VcSwitch from '../vc-switch';
import Wave from '../_util/wave';
import { defaultConfigProvider } from '../config-provider';
import warning from '../_util/warning';
import { tuple, withInstall } from '../_util/type';
import { getPropsSlot } from '../_util/props-util';
import Omit from 'omit.js';

export const SwitchSizes = tuple('small', 'default', 'large');

const switchProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(SwitchSizes),
  disabled: PropTypes.looseBool,
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // defaultChecked: PropTypes.looseBool,
  autofocus: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  checked: PropTypes.looseBool,
};

export type SwitchProps = Partial<ExtractPropTypes<typeof switchProps>>;

const Switch = defineComponent({
  name: 'ASwitch',
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: switchProps,
  setup(props: SwitchProps, { attrs, slots, expose }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const refSwitchNode = ref();

    const focus = () => {
      refSwitchNode.value?.focus();
    };
    const blur = () => {
      refSwitchNode.value?.blur();
    };

    expose({ focus, blur });

    onBeforeMount(() => {
      if ('defaultChecked' in attrs) {
        console.warn(
          `[antdv: Switch]: 'defaultChecked' will be obsolete, please use 'v-model:checked'`,
        );
      }
      warning(
        'checked' in props || !('value' in attrs),
        'Switch',
        '`value` is not validate prop, do you mean `checked`?',
      );
    });
    const { getPrefixCls } = configProvider;
    return () => (
      <Wave insertExtraNode>
        <VcSwitch
          {...Omit(props, ['prefixCls', 'size', 'loading', 'disabled'])}
          {...attrs}
          checked={props.checked}
          prefixCls={getPrefixCls('switch', props.prefixCls)}
          loadingIcon={
            props.loading ? (
              <LoadingOutlined class={`${getPrefixCls('switch', props.prefixCls)}-loading-icon`} />
            ) : null
          }
          checkedChildren={getPropsSlot(slots, props, 'checkedChildren')}
          unCheckedChildren={getPropsSlot(slots, props, 'unCheckedChildren')}
          disabled={props.disabled || props.loading}
          class={{
            [attrs.class as string]: attrs.class,
            [`${getPrefixCls('switch', props.prefixCls)}-small`]: props.size === 'small',
            [`${getPrefixCls('switch', props.prefixCls)}-loading`]: props.loading,
          }}
          ref={refSwitchNode}
        />
      </Wave>
    );
  },
});

export default withInstall(Switch);
