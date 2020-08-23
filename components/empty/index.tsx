import { CSSProperties, VNodeChild, inject, App, SetupContext } from 'vue';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';

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
  image?: VNodeChild | JSX.Element;
  description?: VNodeChild | JSX.Element;
  children?: VNodeChild | JSX.Element;
}

const Empty = (props: EmptyProps, { slots }: SetupContext) => {
  const configProvider = inject('configProvider', ConfigConsumerProps);
  const { getPrefixCls } = configProvider;
  const {
    prefixCls: customizePrefixCls,
    class: className,
    image = defaultEmptyImg,
    description,
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
        let imageNode: EmptyProps['image'] = null;

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
            {slots.default && (
              <div class={`${prefixCls}-footer`}>{filterEmpty(slots.default())}</div>
            )}
          </div>
        ) as VNodeChild;
      }}
    />
  );
};

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;

/* istanbul ignore next */
Empty.install = function(app: App) {
  app.component('AEmpty', Empty);
};

export default Empty;
