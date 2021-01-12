import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export const BasicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.boolean,
  tagName: PropTypes.string,
};

function generator({ suffixCls, tagName, name }) {
  return BasicComponent => {
    return {
      name,
      props: BasicComponent.props,
      inject: {
        configProvider: { default: () => ConfigConsumerProps },
      },
      render() {
        const { prefixCls: customizePrefixCls } = this.$props;
        const getPrefixCls = this.configProvider.getPrefixCls;
        const prefixCls = getPrefixCls(suffixCls, customizePrefixCls);

        const basicComponentProps = {
          props: {
            prefixCls,
            ...getOptionProps(this),
            tagName,
          },
          on: getListeners(this),
        };
        return <BasicComponent {...basicComponentProps}>{this.$slots.default}</BasicComponent>;
      },
    };
  };
}

const Basic = {
  props: BasicProps,
  render() {
    const { prefixCls, tagName: Tag, $slots } = this;
    const divProps = {
      class: prefixCls,
      on: getListeners(this),
    };
    return <Tag {...divProps}>{$slots.default}</Tag>;
  },
};

const BasicLayout = {
  props: BasicProps,
  data() {
    return {
      siders: [],
    };
  },
  provide() {
    return {
      siderHook: {
        addSider: id => {
          this.siders = [...this.siders, id];
        },
        removeSider: id => {
          this.siders = this.siders.filter(currentId => currentId !== id);
        },
      },
    };
  },
  render() {
    const { prefixCls, $slots, hasSider, tagName: Tag } = this;
    const divCls = classNames(prefixCls, {
      [`${prefixCls}-has-sider`]: typeof hasSider === 'boolean' ? hasSider : this.siders.length > 0,
    });
    const divProps = {
      class: divCls,
      on: getListeners,
    };
    return <Tag {...divProps}>{$slots.default}</Tag>;
  },
};

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

export default Layout;
