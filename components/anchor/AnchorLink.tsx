import type { ExtractPropTypes } from 'vue';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectAnchor } from './context';
import type { Key, VueNode, CustomSlotsType } from '../_util/type';
import { objectType, anyType } from '../_util/type';
import type { CSSProperties } from '../_util/cssinjs/hooks/useStyleRegister';

export const anchorLinkProps = () => ({
  prefixCls: String,
  href: String,
  title: anyType<VueNode | ((item: any) => VueNode)>(),
  target: String,
  /* private use  */
  customTitleProps: objectType<AnchorLinkItemProps>(),
});
export interface AnchorLinkItemProps {
  key: Key;
  class?: string;
  style?: CSSProperties;
  href?: string;
  target?: string;
  children?: AnchorLinkItemProps[];
  title?: VueNode | ((item: AnchorLinkItemProps) => VueNode);
}

export type AnchorLinkProps = Partial<ExtractPropTypes<ReturnType<typeof anchorLinkProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAnchorLink',
  inheritAttrs: false,
  props: initDefaultProps(anchorLinkProps(), { href: '#' }),
  slots: Object as CustomSlotsType<{
    title: any;
    default: any;
    customTitle: any;
  }>,
  setup(props, { slots, attrs }) {
    let mergedTitle = null;
    const {
      handleClick: contextHandleClick,
      scrollTo,
      unregisterLink,
      registerLink,
      activeLink,
    } = useInjectAnchor();
    const { prefixCls } = useConfigInject('anchor', props);

    const handleClick = (e: Event) => {
      const { href } = props;
      contextHandleClick(e, { title: mergedTitle, href });
      scrollTo(href);
    };

    watch(
      () => props.href,
      (val, oldVal) => {
        nextTick(() => {
          unregisterLink(oldVal);
          registerLink(val);
        });
      },
    );

    onMounted(() => {
      registerLink(props.href);
    });

    onBeforeUnmount(() => {
      unregisterLink(props.href);
    });

    return () => {
      const { href, target, title = slots.title, customTitleProps = {} } = props;
      const pre = prefixCls.value;
      mergedTitle = typeof title === 'function' ? title(customTitleProps) : title;
      const active = activeLink.value === href;
      const wrapperClassName = classNames(
        `${pre}-link`,
        {
          [`${pre}-link-active`]: active,
        },
        attrs.class,
      );
      const titleClassName = classNames(`${pre}-link-title`, {
        [`${pre}-link-title-active`]: active,
      });
      return (
        <div {...attrs} class={wrapperClassName}>
          <a
            class={titleClassName}
            href={href}
            title={typeof mergedTitle === 'string' ? mergedTitle : ''}
            target={target}
            onClick={handleClick}
          >
            {slots.customTitle ? slots.customTitle(customTitleProps) : mergedTitle}
          </a>
          {slots.default?.()}
        </div>
      );
    };
  },
});
