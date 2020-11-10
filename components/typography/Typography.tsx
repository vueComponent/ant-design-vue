import { defaultConfigProvider } from '../config-provider';
import Text from './Text';
import Title from './Title';
import Paragraph from './Paragraph';
import PropTypes from '../_util/vue-types';
import { defineComponent, HTMLAttributes, inject, App, Plugin } from 'vue';

export interface TypographyProps extends HTMLAttributes {
  prefixCls?: string;
}

interface InternalTypographyProps extends TypographyProps {
  component?: string;
}

const Typography = defineComponent<InternalTypographyProps>({
  name: 'ATypography',
  Text: Text,
  Title: Title,
  Paragraph: Paragraph,
  setup(props, { slots }) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    return () => {
      const { prefixCls: customizePrefixCls, component: Component = 'article' as any } = props;
      const prefixCls = getPrefixCls('typography', customizePrefixCls);

      return <Component class={prefixCls}>{slots.default?.()}</Component>;
    };
  },
});

Typography.props = {
  prefixCls: PropTypes.string,
  component: PropTypes.string,
};

Typography.install = function(app: App) {
  app.component(Typography.name, Typography);
  app.component(Typography.Text.displayName, Text);
  app.component(Typography.Title.displayName, Title);
  app.component(Typography.Paragraph.displayName, Paragraph);
  return app;
};

export default Typography as typeof Typography &
  Plugin & {
    readonly Text: typeof Text;
    readonly Title: typeof Title;
    readonly Paragraph: typeof Paragraph;
  };
