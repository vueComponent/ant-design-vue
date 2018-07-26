import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getSlotOptions, getComponentFromProp, isEmptyElement } from '../_util/props-util';
import { Col } from '../grid';
import { ListGridType } from './index';

export var ListItemProps = {
  prefixCls: PropTypes.string,
  extra: PropTypes.any,
  actions: PropTypes.arrayOf(PropTypes.any),
  grid: ListGridType
};

export var ListItemMetaProps = {
  avatar: PropTypes.any,
  description: PropTypes.any,
  prefixCls: PropTypes.string,
  title: PropTypes.any
};

export var Meta = {
  functional: true,
  name: 'AListItemMeta',
  __ANT_LIST_ITEM_META: true,
  render: function render(h, context) {
    var props = context.props,
        slots = context.slots,
        listeners = context.listeners;

    var slotsMap = slots();
    var _props$prefixCls = props.prefixCls,
        prefixCls = _props$prefixCls === undefined ? 'ant-list' : _props$prefixCls;

    var avatar = props.avatar || slotsMap.avatar;
    var title = props.title || slotsMap.title;
    var description = props.description || slotsMap.description;
    var content = h(
      'div',
      { 'class': prefixCls + '-item-meta-content' },
      [title && h(
        'h4',
        { 'class': prefixCls + '-item-meta-title' },
        [title]
      ), description && h(
        'div',
        { 'class': prefixCls + '-item-meta-description' },
        [description]
      )]
    );
    return h(
      'div',
      _mergeJSXProps([{ on: listeners }, { 'class': prefixCls + '-item-meta' }]),
      [avatar && h(
        'div',
        { 'class': prefixCls + '-item-meta-avatar' },
        [avatar]
      ), (title || description) && content]
    );
  }
};

function getGrid(grid, t) {
  return grid[t] && Math.floor(24 / grid[t]);
}

export default {
  name: 'AListItem',
  Meta: Meta,
  props: ListItemProps,
  inject: {
    listContext: { 'default': {} }
  },

  render: function render() {
    var h = arguments[0];
    var grid = this.listContext.grid;
    var _prefixCls = this.prefixCls,
        prefixCls = _prefixCls === undefined ? 'ant-list' : _prefixCls,
        $slots = this.$slots,
        $listeners = this.$listeners;

    var classString = prefixCls + '-item';
    var extra = getComponentFromProp(this, 'extra');
    var actions = getComponentFromProp(this, 'actions');
    var metaContent = [];
    var otherContent = [];($slots['default'] || []).forEach(function (element) {
      if (!isEmptyElement(element)) {
        if (getSlotOptions(element).__ANT_LIST_ITEM_META) {
          metaContent.push(element);
        } else {
          otherContent.push(element);
        }
      }
    });

    var contentClassString = classNames(prefixCls + '-item-content', _defineProperty({}, prefixCls + '-item-content-single', metaContent.length < 1));
    var content = otherContent.length > 0 ? h(
      'div',
      { 'class': contentClassString },
      [otherContent]
    ) : null;

    var actionsContent = void 0;
    if (actions && actions.length > 0) {
      var actionsContentItem = function actionsContentItem(action, i) {
        return h(
          'li',
          { key: prefixCls + '-item-action-' + i },
          [action, i !== actions.length - 1 && h('em', { 'class': prefixCls + '-item-action-split' })]
        );
      };
      actionsContent = h(
        'ul',
        { 'class': prefixCls + '-item-action' },
        [actions.map(function (action, i) {
          return actionsContentItem(action, i);
        })]
      );
    }

    var extraContent = h(
      'div',
      { 'class': prefixCls + '-item-extra-wrap' },
      [h(
        'div',
        { 'class': prefixCls + '-item-main' },
        [metaContent, content, actionsContent]
      ), h(
        'div',
        { 'class': prefixCls + '-item-extra' },
        [extra]
      )]
    );

    var mainContent = grid ? h(
      Col,
      {
        attrs: {
          span: getGrid(grid, 'column'),
          xs: getGrid(grid, 'xs'),
          sm: getGrid(grid, 'sm'),
          md: getGrid(grid, 'md'),
          lg: getGrid(grid, 'lg'),
          xl: getGrid(grid, 'xl'),
          xxl: getGrid(grid, 'xxl')
        }
      },
      [h(
        'div',
        _mergeJSXProps([{ on: $listeners }, { 'class': classString }]),
        [extra && extraContent, !extra && metaContent, !extra && content, !extra && actionsContent]
      )]
    ) : h(
      'div',
      _mergeJSXProps([{ on: $listeners }, { 'class': classString }]),
      [extra && extraContent, !extra && metaContent, !extra && content, !extra && actionsContent]
    );

    return mainContent;
  }
};