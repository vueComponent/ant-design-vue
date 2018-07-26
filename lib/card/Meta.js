'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACardMeta',
  props: {
    prefixCls: _vueTypes2['default'].string.def('ant-card'),
    title: _vueTypes2['default'].string,
    description: _vueTypes2['default'].string
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        _$props$prefixCls = _$props.prefixCls,
        prefixCls = _$props$prefixCls === undefined ? 'ant-card' : _$props$prefixCls,
        title = _$props.title,
        description = _$props.description,
        others = (0, _objectWithoutProperties3['default'])(_$props, ['prefixCls', 'title', 'description']);

    var classString = (0, _defineProperty3['default'])({}, prefixCls + '-meta', true);

    var avatar = (0, _propsUtil.getComponentFromProp)(this, 'avatar');
    var avatarDom = avatar ? h(
      'div',
      { 'class': prefixCls + '-meta-avatar' },
      [avatar]
    ) : null;
    var titleDom = title ? h(
      'div',
      { 'class': prefixCls + '-meta-title' },
      [title]
    ) : null;
    var descriptionDom = description ? h(
      'div',
      { 'class': prefixCls + '-meta-description' },
      [description]
    ) : null;
    var MetaDetail = titleDom || descriptionDom ? h(
      'div',
      { 'class': prefixCls + '-meta-detail' },
      [titleDom, descriptionDom]
    ) : null;
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([others, { 'class': classString }]),
      [avatarDom, MetaDetail]
    );
  }
};
module.exports = exports['default'];