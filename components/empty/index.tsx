import { CSSProperties, VNodeTypes, inject, App, SetupContext } from 'vue';
import classNames from '../_util/classNames';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
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
  image?: VNodeTypes | null;
  description?: VNodeTypes;
  children?: VNodeTypes;
}

const Empty = (props: EmptyProps, { slots }: SetupContext) => {
  const configProvider = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);
  const { getPrefixCls, direction } = configProvider;
  const {
    prefixCls: customizePrefixCls,
    image = defaultEmptyImg,
    description,
    imageStyle,
    class: className,
    ...restProps
  } = props;

  return (
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
            class={classNames(prefixCls, {
              [`${prefixCls}-normal`]: image === simpleEmptyImg,
              [`${prefixCls}-rtl`]: direction === 'rtl',
            })}
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
        );
      }}
    />
  );
};

Empty.displayName = 'AEmpty';

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;

/* istanbul ignore next */
Empty.install = function(app: App) {
  app.component(Empty.displayName, Empty);
};

export default Empty;
