import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
// import PureRenderMixin from 'rc-util/lib/PureRenderMixin'
import Lazyload from '../vc-lazy-load';
import Checkbox from '../checkbox';

function noop() {}

export default {
  // shouldComponentUpdate (...args: any[]) {
  //   return PureRenderMixin.shouldComponentUpdate.apply(this, args)
  // }
  props: {
    renderedText: PropTypes.any,
    renderedEl: PropTypes.any,
    item: PropTypes.any,
    lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    checked: PropTypes.bool,
    prefixCls: PropTypes.string
  },
  name: 'Item',
  render: function render() {
    var _classNames,
        _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        renderedText = _$props.renderedText,
        renderedEl = _$props.renderedEl,
        item = _$props.item,
        lazy = _$props.lazy,
        checked = _$props.checked,
        prefixCls = _$props.prefixCls;


    var className = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-content-item', true), _defineProperty(_classNames, prefixCls + '-content-item-disabled', item.disabled), _classNames));

    var listItem = h(
      'li',
      {
        'class': className,
        attrs: { title: renderedText
        },
        on: {
          'click': item.disabled ? noop : function () {
            _this.$emit('click', item);
          }
        }
      },
      [h(Checkbox, {
        attrs: { checked: checked, disabled: item.disabled }
      }), h('span', [renderedEl])]
    );
    var children = null;
    if (lazy) {
      var lazyProps = {
        props: _extends({
          height: 32,
          offset: 500,
          throttle: 0,
          debounce: false
        }, lazy)
      };
      children = h(
        Lazyload,
        lazyProps,
        [listItem]
      );
    } else {
      children = listItem;
    }
    return children;
  }
};