import { flattenChildren } from '../_util/props-util';
import type { ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import { withInstall } from '../_util/type';

export const dividerProps = {
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
  plain: {
    type: Boolean,
    default: false,
  },
};
export type DividerProps = Partial<ExtractPropTypes<typeof dividerProps>>;

const Divider = defineComponent({
  name: 'ADivider',
  props: dividerProps,
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const prefixClsRef = computed(() => configProvider.getPrefixCls('divider', props.prefixCls));

    const classString = computed(() => {
      const { type, dashed, plain } = props;
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-dashed`]: !!dashed,
        [`${prefixCls}-plain`]: !!plain,
        [`${prefixCls}-rtl`]: configProvider.direction === 'rtl',
      };
    });

    const orientationPrefix = computed(() =>
      props.orientation.length > 0 ? '-' + props.orientation : props.orientation,
    );

    return () => {
      const children = flattenChildren(slots.default?.());
      return (
        <div
          class={[
            classString.value,
            children.length
              ? `${prefixClsRef.value}-with-text ${prefixClsRef.value}-with-text${orientationPrefix.value}`
              : '',
          ]}
          role="separator"
        >
          {children.length ? (
            <span class={`${prefixClsRef.value}-inner-text`}>{children}</span>
          ) : null}
        </div>
      );
    };
  },
});

export default withInstall(Divider);
