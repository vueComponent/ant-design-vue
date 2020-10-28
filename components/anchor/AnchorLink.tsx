import { ComponentPublicInstance, defineComponent, inject, nextTick } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent } from '../_util/props-util';
import classNames from '../_util/classNames';
import { defaultConfigProvider } from '../config-provider';
import { AntAnchor } from './Anchor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function noop(..._any: any[]): any {}

const AnchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string.def('#'),
  title: PropTypes.VNodeChild,
  target: PropTypes.string,
};

export default defineComponent({
  name: 'AAnchorLink',
  props: AnchorLinkProps,
  setup() {
    return {
      antAnchor: inject('antAnchor', {
        registerLink: noop,
        unregisterLink: noop,
        scrollTo: noop,
        $data: {},
      } as AntAnchor),
      antAnchorContext: inject('antAnchorContext', {}) as ComponentPublicInstance,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  watch: {
    href(val, oldVal) {
      nextTick(() => {
        this.antAnchor.unregisterLink(oldVal);
        this.antAnchor.registerLink(val);
      });
    },
  },

  mounted() {
    this.antAnchor.registerLink(this.href);
  },

  beforeUnmount() {
    this.antAnchor.unregisterLink(this.href);
  },
  methods: {
    handleClick(e: Event) {
      this.antAnchor.scrollTo(this.href);
      const { scrollTo } = this.antAnchor;
      const { href, title } = this.$props;
      if (this.antAnchorContext.$emit) {
        this.antAnchorContext.$emit('click', e, { title, href });
      }
      scrollTo(href);
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, href, $slots, target } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('anchor', customizePrefixCls);

    const title = getComponent(this, 'title');
    const active = this.antAnchor.$data.activeLink === href;
    const wrapperClassName = classNames(`${prefixCls}-link`, {
      [`${prefixCls}-link-active`]: active,
    });
    const titleClassName = classNames(`${prefixCls}-link-title`, {
      [`${prefixCls}-link-title-active`]: active,
    });
    return (
      <div class={wrapperClassName}>
        <a
          class={titleClassName}
          href={href}
          title={typeof title === 'string' ? title : ''}
          target={target}
          onClick={this.handleClick}
        >
          {title}
        </a>
        {$slots.default?.()}
      </div>
    );
  },
});
