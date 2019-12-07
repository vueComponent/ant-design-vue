import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export const BasicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.boolean,
};

function generator(props, name) {
  return BasicComponent => {
    return {
      name,
      props: BasicComponent.props,
      inject: {
        configProvider: { default: () => ConfigConsumerProps },
      },
      render() {
        const { suffixCls } = props;
        const { prefixCls: customizePrefixCls } = this.$props;
        const getPrefixCls = this.configProvider.getPrefixCls;
        const prefixCls = getPrefixCls(suffixCls, customizePrefixCls);

        const basicComponentProps = {
          props: {
            prefixCls,
            ...getOptionProps(this),
          },
          on: this.$listeners,
        };
        return <BasicComponent {...basicComponentProps}>{this.$slots.default}</BasicComponent>;
      },
    };
  };
}

const Basic = {
  props: BasicProps,
  render() {
    const { prefixCls, $slots, $listeners } = this;
    const divProps = {
      class: prefixCls,
      on: $listeners,
    };
    return <div {...divProps}>{$slots.default}</div>;
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
    const { prefixCls, $slots, hasSider, $listeners } = this;
    const divCls = classNames(prefixCls, {
      [`${prefixCls}-has-sider`]: hasSider || this.siders.length > 0,
    });
    const divProps = {
      class: divCls,
      on: $listeners,
    };
    return <div {...divProps}>{$slots.default}</div>;
  },
};

const Layout = generator(
  {
    suffixCls: 'layout',
  },
  'ALayout',
)(BasicLayout);

const Header = generator(
  {
    suffixCls: 'layout-header',
  },
  'ALayoutHeader',
)(Basic);

const Footer = generator(
  {
    suffixCls: 'layout-footer',
  },
  'ALayoutFooter',
)(Basic);

const Content = generator(
  {
    suffixCls: 'layout-content',
  },
  'ALayoutContent',
)(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;
