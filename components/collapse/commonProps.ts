import type { PropType } from 'vue';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';

export type CollapsibleType = 'header' | 'disabled';

export type ActiveKeyType = Array<string | number> | string | number;
const collapseProps = () => ({
  prefixCls: PropTypes.string,
  activeKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  defaultActiveKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  accordion: PropTypes.looseBool,
  destroyInactivePanel: PropTypes.looseBool,
  bordered: PropTypes.looseBool,
  expandIcon: PropTypes.func,
  openAnimation: PropTypes.object,
  expandIconPosition: PropTypes.oneOf(tuple('left', 'right')),
  collapsible: { type: String as PropType<CollapsibleType> },
  ghost: PropTypes.looseBool,
});

const collapsePanelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string,
  header: PropTypes.any,
  headerClass: PropTypes.string,
  showArrow: PropTypes.looseBool,
  isActive: PropTypes.looseBool,
  destroyInactivePanel: PropTypes.looseBool,
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: PropTypes.looseBool,
  accordion: PropTypes.looseBool,
  forceRender: PropTypes.looseBool,
  expandIcon: PropTypes.func,
  extra: PropTypes.any,
  panelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  collapsible: { type: String as PropType<CollapsibleType> },
  role: String,
  onItemClick: { type: Function as PropType<(panelKey: string | number) => void> },
});

export { collapseProps, collapsePanelProps };
