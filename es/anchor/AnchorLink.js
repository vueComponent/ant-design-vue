import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp } from '../_util/props-util';
import classNames from 'classnames';

export var AnchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.any
};

export default {
  name: 'AAnchorLink',
  props: initDefaultProps(AnchorLinkProps, {
    prefixCls: 'ant-anchor',
    href: '#'
  }),
  inject: {
    antAnchor: { 'default': {} }
  },

  mounted: function mounted() {
    this.antAnchor.registerLink(this.href);
  },
  beforeDestroy: function beforeDestroy() {
    this.antAnchor.unregisterLink(this.href);
  },

  watch: {
    href: function href(val) {
      this.antAnchor.unregisterLink(val);
      this.antAnchor.registerLink(val);
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.antAnchor.scrollTo(this.href);
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        href = this.href,
        $slots = this.$slots;

    var title = getComponentFromProp(this, 'title');
    var active = this.antAnchor.$data.activeLink === href;
    var wrapperClassName = classNames(prefixCls + '-link', _defineProperty({}, prefixCls + '-link-active', active));
    var titleClassName = classNames(prefixCls + '-link-title', _defineProperty({}, prefixCls + '-link-title-active', active));
    return h(
      'div',
      { 'class': wrapperClassName },
      [h(
        'a',
        {
          'class': titleClassName,
          attrs: { href: href,
            title: typeof title === 'string' ? title : ''
          },
          on: {
            'click': this.handleClick
          }
        },
        [title]
      ), $slots['default']]
    );
  }
};