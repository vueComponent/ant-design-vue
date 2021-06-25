import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

const breadcrumbSeparatorProps = {
  prefixCls: PropTypes.string,
};
export type BreadcrumbSeparatorProps = Partial<ExtractPropTypes<typeof breadcrumbSeparatorProps>>;

export default defineComponent({
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  inheritAttrs: false,
  props: breadcrumbSeparatorProps,
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
