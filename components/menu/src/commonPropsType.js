import PropTypes from '../../_util/vue-types'
export default {
  prefixCls: PropTypes.string.def('rc-menu'),
  inlineIndent: PropTypes.number.def(24),
  focusable: PropTypes.bool.def(true),
  multiple: PropTypes.bool,
  defaultActiveFirst: PropTypes.bool,
  visible: PropTypes.bool.def(true),
  activeKey: PropTypes.string,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
  openKeys: PropTypes.arrayOf(PropTypes.string),
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  triggerSubMenuAction: PropTypes.string.def('click'),
  openTransitionName: PropTypes.string,
}
