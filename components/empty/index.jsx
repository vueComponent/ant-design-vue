import PropTypes from '../_util/vue-types';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { getComponentFromProp } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import emptyImg from './empty.svg';

export const TransferLocale = () => {
  return {
    description: PropTypes.string,
  };
};

export const EmptyProps = () => {
  return {
    prefixCls: PropTypes.string,
    image: PropTypes.any,
    description: PropTypes.any,
  };
};

const Empty = {
  name: 'AEmpty',
  props: {
    ...EmptyProps(),
  },
  methods: {
    renderEmpty(contentLocale) {
      const {
        prefixCls: customizePrefixCls,
        ...restProps
      } = this.$props;

      // todo
      // const prefixCls = getPrefixCls('empty', customizePrefixCls);
      const prefixCls = customizePrefixCls || 'ant-empty';
      const image = getComponentFromProp(this, 'image');
      const description = getComponentFromProp(this, 'description');

      const des = description || contentLocale.description;
      const alt = typeof des === 'string' ? des : 'empty';

      let imageNode = null;
      if (!image) {
        imageNode = <img alt={alt} src={emptyImg} />;
      } else if (typeof image === 'string') {
        imageNode = <img alt={alt} src={image} />;
      } else {
        imageNode = image;
      }

      return (
        <div class={prefixCls} {...restProps}>
          <div class={`${prefixCls}-image`}>{imageNode}</div>

          <p class={`${prefixCls}-description`}>{des}</p>

          {this.$slots.default && <div class={`${prefixCls}-footer`}>{this.$slots.default[0]}</div>}
        </div>
      );
    },
  },
  render() {
    return (
      <LocaleReceiver componentName="Empty" scopedSlots={{ default: this.renderEmpty }} />
    );
  },
};

/* istanbul ignore next */
Empty.install = function(Vue) {
  Vue.component(Empty.name, Empty);
};

export default Empty;
