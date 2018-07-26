import PropTypes from '../../_util/vue-types';

var collapseProps = {
  prefixCls: PropTypes.string.def('ant-collapse'),
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  accordion: PropTypes.bool.def(false),
  destroyInactivePanel: PropTypes.bool.def(false)
};

var panelProps = {
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string.def('ant-collapse'),
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  headerClass: PropTypes.string.def(''),
  showArrow: PropTypes.bool.def(true),
  isActive: PropTypes.bool.def(false),
  destroyInactivePanel: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false)
};

export { collapseProps, panelProps };