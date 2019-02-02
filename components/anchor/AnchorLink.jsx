import PropTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp } from '../_util/props-util';
import classNames from 'classnames';

export const AnchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.any,
};

export default {
  name: 'AAnchorLink',
  props: initDefaultProps(AnchorLinkProps, {
    prefixCls: 'ant-anchor',
    href: '#',
  }),
  inject: {
    antAnchor: { default: () => ({}) },
    antAnchorContext: { default: () => ({}) },
  },
  watch: {
    href(val, oldVal) {
      this.antAnchor.unregisterLink(oldVal);
      this.antAnchor.registerLink(val);
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
    const { prefixCls, href, $slots } = this;
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
