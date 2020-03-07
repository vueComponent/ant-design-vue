import PropTypes from '../_util/vue-types';
import classNames from 'classnames';

export default {
  name: 'Pager',
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
    const props = this.$props;
    const prefixCls = `${props.rootPrefixCls}-item`;
    const cls = classNames(prefixCls, `${prefixCls}-${props.page}`, {
      [`${prefixCls}-active`]: props.active,
      [`${prefixCls}-disabled`]: !props.page,
    });

    return (
      <li
        class={cls}
        onClick={this.handleClick}
        onKeypress={this.handleKeyPress}
        title={this.showTitle ? this.page : null}
        tabIndex="0"
      >
        {this.itemRender(this.page, 'page', <a>{this.page}</a>)}
      </li>
    );
  },
};
