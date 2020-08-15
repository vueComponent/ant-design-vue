import { defineComponent, CSSProperties, VNodeChild, inject, App } from 'vue';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';

const defaultEmptyImg = <DefaultEmptyImg />;
const simpleEmptyImg = <SimpleEmptyImg />;

export interface TransferLocale {
  description: string;
}

export interface EmptyProps {
  prefixCls?: string;
  class?: string;
  style?: CSSProperties;
  imageStyle?: CSSProperties;
  image?: VNodeChild;
  description?: VNodeChild;
  children?: VNodeChild;
}

const Empty = defineComponent<EmptyProps>({
  name: 'AEmpty',
  setup(props) {
    const configProvider = inject('configProvider', ConfigConsumerProps);
    const { getPrefixCls } = configProvider;
    const {
      class: className,
      prefixCls: customizePrefixCls,
      image = defaultEmptyImg,
      description,
      children,
      imageStyle,
      ...restProps
    } = props;

    return () => (
      <LocaleReceiver
        componentName="Empty"
        children={(locale: TransferLocale) => {
          const prefixCls = getPrefixCls('empty', customizePrefixCls);
          const des = typeof description !== 'undefined' ? description : locale.description;
          const alt = typeof des === 'string' ? des : 'empty';

          let imageNode: any = null;

          if (typeof image === 'string') {
            imageNode = <img alt={alt} src={image} />;
          } else {
            imageNode = image;
          }

          return (
            <div
              class={classNames(
                prefixCls,
                {
                  [`${prefixCls}-normal`]: image === simpleEmptyImg,
                },
                className,
              )}
              {...restProps}
            >
              <div class={`${prefixCls}-image`} style={imageStyle}>
                {imageNode}
              </div>
              {des && <p class={`${prefixCls}-description`}>{des}</p>}
              {children && <div class={`${prefixCls}-footer`}>{children}</div>}
            </div>
          ) as VNodeChild;
        }}
      />
    );
  },
  render() {
    return <LocaleReceiver componentName="Empty" children={this.renderEmpty} />;
  },
});

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;

/* istanbul ignore next */
Empty.install = function(app: App) {
  app.component(Empty.name, Empty);
};

export default Empty;
