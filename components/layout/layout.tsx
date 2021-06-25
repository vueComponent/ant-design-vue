import type { ExtractPropTypes, HTMLAttributes } from 'vue';
import { createVNode, defineComponent, provide, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';
import { SiderHookProviderKey } from './injectionKey';

export const basicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.looseBool,
  tagName: PropTypes.string,
};

export type BasicProps = Partial<ExtractPropTypes<typeof basicProps>> & HTMLAttributes;

type GeneratorArgument = {
  suffixCls: string;
  tagName: 'header' | 'footer' | 'main' | 'section';
  name: string;
};

function generator({ suffixCls, tagName, name }: GeneratorArgument) {
  return (BasicComponent: typeof Basic) => {
    const Adapter = defineComponent({
      name,
      props: basicProps,
      setup(props, { slots }) {
        const { prefixCls } = useConfigInject(suffixCls, props);
        return () => {
          const basicComponentProps = {
            ...props,
            prefixCls: prefixCls.value,
            tagName,
          };
          return <BasicComponent {...basicComponentProps}>{slots.default?.()}</BasicComponent>;
        };
      },
    });
    return Adapter;
  };
}

const Basic = defineComponent({
  props: basicProps,
  setup(props, { slots }) {
    return () => createVNode(props.tagName, { class: props.prefixCls }, slots.default?.());
  },
});

const BasicLayout = defineComponent({
  props: basicProps,
  setup(props, { slots }) {
    const { direction } = useConfigInject('', props);
    const siders = ref<string[]>([]);
    const siderHookProvider = {
      addSider: (id: string) => {
        siders.value = [...siders.value, id];
      },
      removeSider: (id: string) => {
        siders.value = siders.value.filter(currentId => currentId !== id);
      },
    };

    provide(SiderHookProviderKey, siderHookProvider);

    return () => {
      const { prefixCls, hasSider, tagName } = props;
      const divCls = classNames(prefixCls, {
        [`${prefixCls}-has-sider`]:
          typeof hasSider === 'boolean' ? hasSider : siders.value.length > 0,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
      });
      return createVNode(tagName, { class: divCls }, slots.default?.());
    };
  },
});

const Layout = generator({
  suffixCls: 'layout',
  tagName: 'section',
  name: 'ALayout',
})(BasicLayout);

const Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  name: 'ALayoutHeader',
})(Basic);

const Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  name: 'ALayoutFooter',
})(Basic);

const Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  name: 'ALayoutContent',
})(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout as typeof Layout & {
  readonly Header: typeof Header;
  readonly Footer: typeof Footer;
  readonly Content: typeof Content;
};
