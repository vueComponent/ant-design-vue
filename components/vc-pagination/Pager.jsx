import PropTypes from '../_util/vue-types';
import classNames from 'classnames';

export default {
  name: 'Pager',
  inheritAttrs: false,
  props: {
    rootPrefixCls: PropTypes.string,
    page: PropTypes.number,
    active: PropTypes.bool,
    last: PropTypes.bool,
    locale: PropTypes.object,
    showTitle: PropTypes.bool,
    itemRender: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.page);
    },
    handleKeyPress(event) {
      this.$emit('keypress', event, this.handleClick, this.page);
    },
  },
  render() {
    const { class: _cls, style } = this.$attrs;
    const props = this.$props;
    const prefixCls = `${props.rootPrefixCls}-item`;
    const cls = classNames(
      prefixCls,
      `${prefixCls}-${props.page}`,
      {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-disabled`]: !props.page,
      },
      _cls,
    );

    return (
      <li
        onClick={this.handleClick}
        onKeypress={this.handleKeyPress}
        title={this.showTitle ? this.page : null}
        tabindex="0"
        class={cls}
        style={style}
      >
        {this.itemRender(this.page, 'page', <a>{this.page}</a>)}
      </li>
    );
  },
};
