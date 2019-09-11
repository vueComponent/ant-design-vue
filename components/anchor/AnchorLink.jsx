import PropTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp } from '../_util/props-util';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider';

export const AnchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.any,
};

export default {
  name: 'AAnchorLink',
  props: initDefaultProps(AnchorLinkProps, {
    href: '#',
  }),
  inject: {
    antAnchor: { default: () => ({}) },
    antAnchorContext: { default: () => ({}) },
    configProvider: { default: () => ConfigConsumerProps },
  },
  watch: {
    href(val, oldVal) {
      this.$nextTick(() => {
        this.antAnchor.unregisterLink(oldVal);
        this.antAnchor.registerLink(val);
      });
    },
  },

  mounted() {
    this.antAnchor.registerLink(this.href);
  },

  beforeDestroy() {
    this.antAnchor.unregisterLink(this.href);
  },
  methods: {
    handleClick(e) {
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
    const { prefixCls: customizePrefixCls, href, $slots } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('anchor', customizePrefixCls);

    const title = getComponentFromProp(this, 'title');
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
          onClick={this.handleClick}
        >
          {title}
        </a>
        {$slots.default}
      </div>
    );
  },
};
