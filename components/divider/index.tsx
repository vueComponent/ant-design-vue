import { flattenChildren } from '../_util/props-util';
import { computed, defineComponent, inject, PropType } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import { withInstall } from '../_util/type';

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
      const prefixClsRef = prefixCls.value;
      return {
        [prefixClsRef]: true,
        [`${prefixClsRef}-${type}`]: true,
        [`${prefixClsRef}-with-text${orientationPrefix}`]: slots.default,
        [`${prefixClsRef}-dashed`]: !!dashed,
      };
    });

    return () => {
      const children = flattenChildren(slots.default?.());
      return (
        <div class={classString.value} role="separator">
          {children.length ? <span class={`${prefixCls.value}-inner-text`}>{children}</span> : null}
        </div>
      );
    };
  },
});

export default withInstall(Divider);
