import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';

export const breadcrumbSeparatorProps = () => ({
  prefixCls: String,
});
export type BreadcrumbSeparatorProps = Partial<
  ExtractPropTypes<ReturnType<typeof breadcrumbSeparatorProps>>
>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  inheritAttrs: false,
  props: breadcrumbSeparatorProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);

    return () => {
      const { separator, class: className, ...restAttrs } = attrs;
      const children = flattenChildren(slots.default?.());
      return (
        <span class={[`${prefixCls.value}-separator`, className]} {...restAttrs}>
          {children.length > 0 ? children : '/'}
        </span>
      );
    };
  },
});
