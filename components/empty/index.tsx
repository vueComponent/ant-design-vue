import { defineComponent, h } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';
import type { VueNode } from '../_util/type';
import { anyType, objectType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import useStyle from './style';

interface Locale {
  description?: string;
}

export const emptyProps = () => ({
  prefixCls: String,
  imageStyle: objectType<CSSProperties>(),
  image: anyType<VueNode>(),
  description: anyType<VueNode>(),
});

export type EmptyProps = Partial<ExtractPropTypes<ReturnType<typeof emptyProps>>>;

const Empty = defineComponent({
  name: 'AEmpty',
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: emptyProps(),
  setup(props, { slots = {}, attrs }) {
    const { direction, prefixCls: prefixClsRef } = useConfigInject('empty', props);

    const [wrapSSR, hashId] = useStyle(prefixClsRef);

    return () => {
      const prefixCls = prefixClsRef.value;
      const {
        image: mergedImage = slots.image?.() || h(DefaultEmptyImg),
        description = slots.description?.() || undefined,
        imageStyle,
        class: className = '',
        ...restProps
      } = { ...props, ...attrs };
      const image =
        typeof mergedImage === 'function' ? (mergedImage as () => VueNode)() : mergedImage;
      const isNormal =
        typeof image === 'object' && 'type' in image && (image.type as any).PRESENTED_IMAGE_SIMPLE;
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
                  [`${prefixCls}-normal`]: isNormal,
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

Empty.PRESENTED_IMAGE_DEFAULT = () => h(DefaultEmptyImg);
Empty.PRESENTED_IMAGE_SIMPLE = () => h(SimpleEmptyImg);

export default withInstall(Empty);
