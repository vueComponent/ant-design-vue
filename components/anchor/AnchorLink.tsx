import type { ExtractPropTypes } from 'vue';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useInjectAnchor } from './context';

const anchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string.def('#'),
  title: PropTypes.VNodeChild,
  target: PropTypes.string,
};

export type AnchorLinkProps = Partial<ExtractPropTypes<typeof anchorLinkProps>>;

export default defineComponent({
  name: 'AAnchorLink',
  props: anchorLinkProps,
  slots: ['title'],
  setup(props, { slots }) {
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
      const { href, target } = props;
      const pre = prefixCls.value;
      const title = getPropsSlot(slots, props, 'title');
      mergedTitle = title;
      const active = activeLink.value === href;
      const wrapperClassName = classNames(`${pre}-link`, {
        [`${pre}-link-active`]: active,
      });
      const titleClassName = classNames(`${pre}-link-title`, {
        [`${pre}-link-title-active`]: active,
      });
      return (
        <div class={wrapperClassName}>
          <a
            class={titleClassName}
            href={href}
            title={typeof title === 'string' ? title : ''}
            target={target}
            onClick={handleClick}
          >
            {title}
          </a>
          {slots.default?.()}
        </div>
      );
    };
  },
});
