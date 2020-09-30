import { App, computed, defineComponent, inject, PropType, unref } from 'vue';
import { defaultConfigProvider } from '../config-provider';

const Divider = defineComponent({
  name: 'ADivider',
  props: {
    prefixCls: String,
    type: {
      type: String as PropType<'horizontal' | 'vertical' | ''>,
      default: 'horizontal',
    },
    dashed: {
      type: Boolean,
      default: false,
    },
    orientation: {
      type: String as PropType<'left' | 'right' | 'center'>,
      default: 'center',
    },
  },
  setup(props, { slots }) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);
    const prefixCls = computed(() => getPrefixCls('divider', props.prefixCls));

    const classString = computed(() => {
      const { type, dashed, orientation } = props;
      const orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;
      const prefixClsRef = unref(prefixCls);
      return {
        [prefixClsRef]: true,
        [`${prefixClsRef}-${type}`]: true,
        [`${prefixClsRef}-with-text${orientationPrefix}`]: slots.default,
        [`${prefixClsRef}-dashed`]: !!dashed,
      };
    });

    return () => {
      return (
        <div class={classString.value} role="separator">
          <span class={`${prefixCls.value}-inner-text`}>{slots.default?.()}</span>
        </div>
      );
    };
  },
});

/* istanbul ignore next */
Divider.install = function(app: App) {
  app.component(Divider.name, Divider);
};

export default Divider;
