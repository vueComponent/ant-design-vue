import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import { getComponentFromProp } from '../_util/props-util';

export default {
  name: 'ACardMeta',
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
    title: PropTypes.string,
    description: PropTypes.string
  },
  render: function render() {
    var h = arguments[0];

    var _$props = this.$props,
        _$props$prefixCls = _$props.prefixCls,
        prefixCls = _$props$prefixCls === undefined ? 'ant-card' : _$props$prefixCls,
        title = _$props.title,
        description = _$props.description,
        others = _objectWithoutProperties(_$props, ['prefixCls', 'title', 'description']);

    var classString = _defineProperty({}, prefixCls + '-meta', true);

    var avatar = getComponentFromProp(this, 'avatar');
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
      _mergeJSXProps([others, { 'class': classString }]),
      [avatarDom, MetaDetail]
    );
  }
};