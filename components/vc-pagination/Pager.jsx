import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import BaseMixin from '../_util/BaseMixin';

export default {
  name: 'Pager',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    rootPrefixCls: PropTypes.string,
    page: PropTypes.number,
    active: PropTypes.looseBool,
    last: PropTypes.looseBool,
    locale: PropTypes.object,
    showTitle: PropTypes.looseBool,
    itemRender: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleClick() {
      this.__emit('click', this.page);
    },
    handleKeyPress(event) {
      this.__emit('keypress', event, this.handleClick, this.page);
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
        {this.itemRender({ page: this.page, type: 'page', originalElement: <a>{this.page}</a> })}
      </li>
    );
  },
};
