import PropTypes from '../../_util/vue-types';

const collapseProps = {
  prefixCls: PropTypes.string,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  accordion: PropTypes.bool,
  destroyInactivePanel: PropTypes.bool,
  bordered: PropTypes.bool,
  expandIcon: PropTypes.func,
  openAnimation: PropTypes.object,
};

const panelProps = {
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  headerClass: PropTypes.string,
  showArrow: PropTypes.bool,
  isActive: PropTypes.bool,
  destroyInactivePanel: PropTypes.bool,
  disabled: PropTypes.bool,
  accordion: PropTypes.bool,
  forceRender: PropTypes.bool,
  expandIcon: PropTypes.func,
};

export { collapseProps, panelProps };
