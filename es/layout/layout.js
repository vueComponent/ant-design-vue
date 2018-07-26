import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps } from '../_util/props-util';

export var BasicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.boolean
};

function generator(props, name) {
  return function (BasicComponent) {
    return {
      name: name,
      props: BasicComponent.props,
      render: function render() {
        var h = arguments[0];
        var prefixCls = props.prefixCls;

        var basicComponentProps = {
          props: _extends({
            prefixCls: prefixCls
          }, getOptionProps(this)),
          on: this.$listeners
        };
        return h(
          BasicComponent,
          basicComponentProps,
          [this.$slots['default']]
        );
      }
    };
  };
}

var Basic = {
  props: BasicProps,
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        $slots = this.$slots,
        $listeners = this.$listeners;

    var divProps = {
      'class': prefixCls,
      on: $listeners
    };
    return h(
      'div',
      divProps,
      [$slots['default']]
    );
  }
};

var BasicLayout = {
  props: BasicProps,
  data: function data() {
    return {
      siders: []
    };
  },
  provide: function provide() {
    var _this = this;

    return {
      siderHook: {
        addSider: function addSider(id) {
          _this.siders = [].concat(_toConsumableArray(_this.siders), [id]);
        },
        removeSider: function removeSider(id) {
          _this.siders = _this.siders.filter(function (currentId) {
            return currentId !== id;
          });
        }
      }
    };
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        $slots = this.$slots,
        hasSider = this.hasSider,
        $listeners = this.$listeners;

    var divCls = classNames(prefixCls, _defineProperty({}, prefixCls + '-has-sider', hasSider || this.siders.length > 0));
    var divProps = {
      'class': divCls,
      on: $listeners
    };
    return h(
      'div',
      divProps,
      [$slots['default']]
    );
  }
};

var Layout = generator({
  prefixCls: 'ant-layout'
}, 'ALayout')(BasicLayout);

var Header = generator({
  prefixCls: 'ant-layout-header'
}, 'ALayoutHeader')(Basic);

var Footer = generator({
  prefixCls: 'ant-layout-footer'
}, 'ALayoutFooter')(Basic);

var Content = generator({
  prefixCls: 'ant-layout-content'
}, 'ALayoutContent')(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;