import { inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { getOptionProps, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

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
      setup() {
        return {
          configProvider: inject('configProvider', ConfigConsumerProps),
        };
      },
      render() {
        const { prefixCls: customizePrefixCls } = this.$props;
        const getPrefixCls = this.configProvider.getPrefixCls;
        const prefixCls = getPrefixCls(suffixCls, customizePrefixCls);

        const basicComponentProps = {
          prefixCls,
          ...getOptionProps(this),
          tagName,
        };
        return <BasicComponent {...basicComponentProps}>{getSlot(this)}</BasicComponent>;
      },
    };
  };
}

const Basic = {
  props: BasicProps,
  render() {
    const { prefixCls, tagName: Tag } = this;
    const divProps = {
      class: prefixCls,
    };
    return <Tag {...divProps}>{getSlot(this)}</Tag>;
  },
};

const BasicLayout = {
  props: BasicProps,
  data() {
    return {
      siders: [],
    };
  },
  created() {
    provide('siderHook', {
      addSider: id => {
        this.siders = [...this.siders, id];
      },
      removeSider: id => {
        this.siders = this.siders.filter(currentId => currentId !== id);
      },
    });
  },
  render() {
    const { prefixCls, hasSider, tagName: Tag } = this;
    const divCls = classNames(prefixCls, {
      [`${prefixCls}-has-sider`]: typeof hasSider === 'boolean' ? hasSider : this.siders.length > 0,
    });
    const divProps = {
      class: divCls,
    };
    return <Tag {...divProps}>{getSlot(this)}</Tag>;
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
