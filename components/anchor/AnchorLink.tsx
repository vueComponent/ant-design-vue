import {
  ComponentInternalInstance,
  defineComponent,
  ExtractPropTypes,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  watch,
} from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import { AntAnchor } from './Anchor';
import useConfigInject from '../_util/hooks/useConfigInject';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function noop(..._any: any[]): any {}

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
  setup(props, { slots }) {
    const antAnchor = inject('antAnchor', {
      registerLink: noop,
      unregisterLink: noop,
      scrollTo: noop,
      $data: {},
    } as AntAnchor);
    const antAnchorContext = inject('antAnchorContext', {}) as ComponentInternalInstance;
    const { prefixCls } = useConfigInject('anchor', props);

    const handleClick = (e: Event) => {
      // antAnchor.scrollTo(props.href);
      const { scrollTo } = antAnchor;
      const { href, title } = props;
      if (antAnchorContext.emit) {
        antAnchorContext.emit('click', e, { title, href });
      }
      scrollTo(href);
    };

    watch(
      () => props.href,
      (val, oldVal) => {
        nextTick(() => {
          antAnchor.unregisterLink(oldVal);
          antAnchor.registerLink(val);
        });
      },
    );

    onMounted(() => {
      antAnchor.registerLink(props.href);
    });

    onBeforeUnmount(() => {
      antAnchor.unregisterLink(props.href);
    });

    return () => {
      const { href, target } = props;
      const pre = prefixCls.value;
      const title = getPropsSlot(slots, props, 'title');
      const active = antAnchor.$data.activeLink === href;
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
