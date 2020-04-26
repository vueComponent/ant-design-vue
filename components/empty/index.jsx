import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider';
import { getComponentFromProp, getListeners } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import Base from '../base';

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
    imageStyle: PropTypes.object,
  };
};

const Empty = {
  name: 'AEmpty',
  props: {
    ...EmptyProps(),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    renderEmpty(contentLocale) {
      const { prefixCls: customizePrefixCls, imageStyle } = this.$props;
      const { getPrefixCls, direction } = this.configProvider;
      const prefixCls = getPrefixCls('empty', customizePrefixCls);
      const image = getComponentFromProp(this, 'image') || <DefaultEmptyImg />;
      const description = getComponentFromProp(this, 'description');

      const des = typeof description !== 'undefined' ? description : contentLocale.description;
      const alt = typeof des === 'string' ? des : 'empty';
      const cls = { [prefixCls]: true };
      let imageNode = null;
      if (typeof image === 'string') {
        imageNode = <img alt={alt} src={image} />;
      } else if (typeof image === 'object' && image.PRESENTED_IMAGE_SIMPLE) {
        const Image = image;
        imageNode = <Image />;
        cls[`${prefixCls}-normal`] = true;
      } else {
        imageNode = image;
      }

      const className = classNames(cls, {
        [`${prefixCls}-rtl`]: direction === 'rtl',
      });

      return (
        <div class={className} {...{ on: getListeners(this) }}>
          <div class={`${prefixCls}-image`} style={imageStyle}>
            {imageNode}
          </div>
          {des && <p class={`${prefixCls}-description`}>{des}</p>}
          {this.$slots.default && <div class={`${prefixCls}-footer`}>{this.$slots.default}</div>}
        </div>
      );
    },
  },
  render() {
    return <LocaleReceiver componentName="Empty" scopedSlots={{ default: this.renderEmpty }} />;
  },
};

Empty.PRESENTED_IMAGE_DEFAULT = DefaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = SimpleEmptyImg;

/* istanbul ignore next */
Empty.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Empty.name, Empty);
};

export default Empty;
