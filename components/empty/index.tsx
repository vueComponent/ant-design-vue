import { defineComponent, CSSProperties, VNodeChild, inject, App, PropType, VNode } from 'vue';
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

const Empty = defineComponent({
  name: 'AEmpty',
  props: {
    prefixCls: {
      type: String,
    },
    imageStyle: {
      type: Object as PropType<string | CSSProperties>,
    },
    image: {
      type: Object as PropType<VNode>,
    },
    description: {
      type: String,
    },
  },
  setup(props, { slots }) {
    const configProvider = inject('configProvider', ConfigConsumerProps);
    const { getPrefixCls } = configProvider;
    const {
      class: className,
      prefixCls: customizePrefixCls,
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
              {slots.default && (
                <div class={`${prefixCls}-footer`}>{filterEmpty(slots.default?.())}</div>
              )}
            </div>
          ) as VNodeChild;
        }}
      />
    );
  },
});

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;

/* istanbul ignore next */
Empty.install = function(app: App) {
  app.component(Empty.name, Empty);
};

export default Empty;
