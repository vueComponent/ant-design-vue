'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BasicProps = exports.BasicProps = {
  prefixCls: _vueTypes2['default'].string,
  hasSider: _vueTypes2['default'].boolean
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
          props: (0, _extends3['default'])({
            prefixCls: prefixCls
          }, (0, _propsUtil.getOptionProps)(this)),
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
          _this.siders = [].concat((0, _toConsumableArray3['default'])(_this.siders), [id]);
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

    var divCls = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-has-sider', hasSider || this.siders.length > 0));
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

exports['default'] = Layout;