import _extends from 'babel-runtime/helpers/extends';

import MenuMixin from './MenuMixin';
import BaseMixin from '../_util/BaseMixin';
import commonPropsType from './commonPropsType';
export default {
  name: 'SubPopupMenu',
  props: _extends({}, commonPropsType),

  mixins: [MenuMixin, BaseMixin],
  methods: {
    onDeselect: function onDeselect(selectInfo) {
      this.__emit('deselect', selectInfo);
    },
    onSelect: function onSelect(selectInfo) {
      this.__emit('select', selectInfo);
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
    },
    onOpenChange: function onOpenChange(e) {
      this.__emit('openChange', e);
    },
    onDestroy: function onDestroy(key) {
      this.__emit('destroy', key);
    },
    getOpenTransitionName: function getOpenTransitionName() {
      return this.$props.openTransitionName;
    },
    renderMenuItem: function renderMenuItem(c, i, subIndex) {
      if (!c) {
        return null;
      }
      var props = this.$props;
      var extraProps = {
        openKeys: props.openKeys,
        selectedKeys: props.selectedKeys,
        triggerSubMenuAction: props.triggerSubMenuAction,
        isRootMenu: false
      };
      return this.renderCommonMenuItem(c, i, subIndex, extraProps);
    }
  },
  render: function render() {
    var props = this.$props;

    this.haveOpened = this.haveOpened || props.visible || props.forceSubMenuRender;
    if (!this.haveOpened) {
      return null;
    }
    var prefixCls = this.$props.prefixCls;

    return this.renderRoot(_extends({}, this.$props, { 'class': prefixCls + '-sub' }), this.$slots['default']);
  }
};