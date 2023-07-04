import type { PropType } from 'vue';
import type { Key } from '../_util/type';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';

export type CollapsibleType = 'header' | 'disabled';

export type ActiveKeyType = Array<string | number> | string | number;

export interface PanelProps {
  isActive?: boolean;
  header?: any;
  showArrow?: boolean;
  forceRender?: boolean;
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled?: boolean;
  extra?: any;
  collapsible?: CollapsibleType;
}

const collapseProps = () => ({
  prefixCls: String,
  activeKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  defaultActiveKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  accordion: { type: Boolean, default: undefined },
  destroyInactivePanel: { type: Boolean, default: undefined },
  bordered: { type: Boolean, default: undefined },
  expandIcon: Function as PropType<(panelProps: PanelProps) => any>,
  openAnimation: PropTypes.object,
  expandIconPosition: PropTypes.oneOf(tuple('left', 'right')),
  collapsible: { type: String as PropType<CollapsibleType> },
  ghost: { type: Boolean, default: undefined },
  onChange: Function as PropType<(key: Key | Key[]) => void>,
  'onUpdate:activeKey': Function as PropType<(key: Key | Key[]) => void>,
});

const collapsePanelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: String,
  header: PropTypes.any,
  headerClass: String,
  showArrow: { type: Boolean, default: undefined },
  isActive: { type: Boolean, default: undefined },
  destroyInactivePanel: { type: Boolean, default: undefined },
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: { type: Boolean, default: undefined },
  accordion: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  expandIcon: Function as PropType<(panelProps: PanelProps) => any>,
  extra: PropTypes.any,
  panelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  collapsible: { type: String as PropType<CollapsibleType> },
  role: String,
  onItemClick: { type: Function as PropType<(panelKey: Key) => void> },
});

export { collapseProps, collapsePanelProps };
