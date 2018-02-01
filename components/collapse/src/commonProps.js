import PropTypes from '../../_util/vue-types'

const collapseProps = {
  prefixCls: PropTypes.string.def('ant-collapse'),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  accordion: PropTypes.bool.def(false),
  destroyInactivePanel: PropTypes.bool.def(false),
}

const panelProps = {
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string.def('ant-collapse'),
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  headerClass: PropTypes.string.def(''),
  showArrow: PropTypes.bool.def(true),
  isActive: PropTypes.bool.def(false),
  destroyInactivePanel: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
}

export { collapseProps, panelProps }
