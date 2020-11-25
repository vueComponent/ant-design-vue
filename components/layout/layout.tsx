import {
  createVNode,
  defineComponent,
  inject,
  provide,
  toRefs,
  ref,
  ExtractPropTypes,
  HTMLAttributes,
} from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { defaultConfigProvider } from '../config-provider';
import { flattenChildren } from '../_util/props-util';

export const basicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.looseBool,
  tagName: PropTypes.string,
};

export type BasicProps = Partial<ExtractPropTypes<typeof basicProps>> & HTMLAttributes;

export interface SiderHookProvider {
  addSider?: (id: string) => void;
  removeSider?: (id: string) => void;
}

type GeneratorArgument = {
  suffixCls: string;
  tagName: string;
  name: string;
};

function generator({ suffixCls, tagName, name }: GeneratorArgument) {
  return (BasicComponent: typeof Basic) => {
    const Adapter = defineComponent<BasicProps>({
      name,
      setup(props, { slots }) {
        const { getPrefixCls } = inject('configProvider', defaultConfigProvider);
        return () => {
          const { prefixCls: customizePrefixCls } = props;
          const prefixCls = getPrefixCls(suffixCls, customizePrefixCls);
          const basicComponentProps = {
            prefixCls,
            ...props,
            tagName,
          };
          return (
            <BasicComponent {...basicComponentProps}>
              {flattenChildren(slots.default?.())}
            </BasicComponent>
          );
        };
      },
    });
    Adapter.props = basicProps;
    return Adapter;
  };
}

const Basic = defineComponent({
  props: basicProps,
  setup(props, { slots }) {
    const { prefixCls, tagName } = toRefs(props);
    return () => createVNode(tagName.value, { class: prefixCls.value }, slots.default?.());
  },
});

const BasicLayout = defineComponent({
  props: basicProps,
  setup(props, { slots }) {
    const siders = ref<string[]>([]);
    const siderHookProvider: SiderHookProvider = {
      addSider: id => {
        siders.value = [...siders.value, id];
      },
      removeSider: id => {
        siders.value = siders.value.filter(currentId => currentId !== id);
      },
    };
    provide('siderHook', siderHookProvider);

    return () => {
      const { prefixCls, hasSider, tagName } = props;
      const divCls = classNames(prefixCls, {
        [`${prefixCls}-has-sider`]:
          typeof hasSider === 'boolean' ? hasSider : siders.value.length > 0,
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
