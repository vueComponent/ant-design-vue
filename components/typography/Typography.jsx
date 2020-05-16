import { ConfigConsumerProps } from '../config-provider';
import { initDefaultProps } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import Text from './Text';
import Title from './Title';
import Paragraph from './Paragraph';

export const TypographyProps = {
  component: PropTypes.string,
  prefixCls: PropTypes.string,
};

const Typography = {
  name: 'ATypography',
  Text,
  Title,
  Paragraph,
  inject: {
    configProvider: { default: () => ({}) },
  },
  props: initDefaultProps(TypographyProps, {
    component: 'article',
  }),
  render() {
    const { getPrefixCls: customizePrefixCls, component: Component } = this.$props;
    const getPrefixCls = this.configProvider.getPrefixCls || ConfigConsumerProps.getPrefixCls;
    const prefixCls = getPrefixCls('typography', customizePrefixCls);
    const children = this.$slots.default;

    return <Component class={prefixCls}>{children}</Component>;
  },
};

export default Typography;
