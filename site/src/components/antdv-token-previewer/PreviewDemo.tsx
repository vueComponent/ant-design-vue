import type { CSSProperties, PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';
import { antdComponents } from './component-panel';
import type { Theme } from './interface';
import ComponentDemoPro from './token-panel-pro/ComponentDemoPro';

export type PreviewDemoProps = {
  theme: Theme;
};

const PreviewDemo = defineComponent({
  name: 'PreviewDemo',
  props: {
    theme: { type: Object as PropType<Theme> },
  },
  setup(props, { attrs }) {
    const { theme } = toRefs(props);

    return () => {
      return (
        <div {...attrs} style={{ ...(attrs.style as CSSProperties), overflow: 'auto' }}>
          <ComponentDemoPro
            theme={theme.value}
            components={antdComponents}
            componentDrawer={false}
            showAll
            style={{ minHeight: '100%' }}
          />
        </div>
      );
    };
  },
});

export default PreviewDemo;
