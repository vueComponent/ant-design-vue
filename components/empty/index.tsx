import { defineComponent } from 'vue';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import useStyle from './style';

const defaultEmptyImg = <DefaultEmptyImg />;
const simpleEmptyImg = <SimpleEmptyImg />;

interface Locale {
  description?: string;
}

export const emptyProps = () => ({
  prefixCls: String,
  class: PropTypes.any,
  style: [String, Object] as PropType<string | CSSProperties>,
  imageStyle: Object as PropType<CSSProperties>,
  image: PropTypes.any,
  description: PropTypes.any,
});

export type EmptyProps = Partial<ExtractPropTypes<ReturnType<typeof emptyProps>>>;

const Empty = defineComponent({
  name: 'AEmpty',
  inheritAttrs: false,
  props: emptyProps(),
  setup(props, { slots = {}, attrs }) {
    const { direction, prefixCls: prefixClsRef } = useConfigInject('empty', props);

    const [wrapSSR, hashId] = useStyle(prefixClsRef);

    return () => {
      const prefixCls = prefixClsRef.value;
      const {
        image = defaultEmptyImg,
        description = slots.description?.() || undefined,
        imageStyle,
        class: className = '',
        ...restProps
      } = { ...props, ...attrs };

      return wrapSSR(
        <LocaleReceiver
          componentName="Empty"
          children={(locale: Locale) => {
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
                class={classNames(prefixCls, className, hashId.value, {
                  [`${prefixCls}-normal`]: image === simpleEmptyImg,
                  [`${prefixCls}-rtl`]: direction.value === 'rtl',
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
        />,
      );
    };
  },
});

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;
Empty.inheritAttrs = false;
Empty.props = {
  prefixCls: String,
  image: PropTypes.any,
  description: PropTypes.any,
  imageStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
};

export default withInstall(Empty);
