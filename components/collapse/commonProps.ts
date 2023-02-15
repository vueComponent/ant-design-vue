import type { Key } from '../_util/type';
import { booleanType, someType, stringType, functionType } from '../_util/type';
import PropTypes from '../_util/vue-types';

export type CollapsibleType = 'header' | 'icon' | 'disabled';

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
  activeKey: someType<ActiveKeyType>([Array, Number, String]),
  defaultActiveKey: someType<ActiveKeyType>([Array, Number, String]),
  accordion: booleanType(),
  destroyInactivePanel: booleanType(),
  bordered: booleanType(),
  expandIcon: functionType<(panelProps: PanelProps) => any>(),
  openAnimation: PropTypes.object,
  expandIconPosition: stringType<'start' | 'end'>(),
  collapsible: stringType<CollapsibleType>(),
  ghost: booleanType(),
  onChange: functionType<(key: Key | Key[]) => void>(),
  'onUpdate:activeKey': functionType<(key: Key | Key[]) => void>(),
});

const collapsePanelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: String,
  header: PropTypes.any,
  headerClass: String,
  showArrow: booleanType(),
  isActive: booleanType(),
  destroyInactivePanel: booleanType(),
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: booleanType(),
  accordion: booleanType(),
  forceRender: booleanType(),
  expandIcon: functionType<(panelProps: PanelProps) => any>(),
  extra: PropTypes.any,
  panelKey: someType<number | string>(),
  collapsible: stringType<CollapsibleType>(),
  role: String,
  onItemClick: functionType<(panelKey: Key) => void>(),
});

export { collapseProps, collapsePanelProps };
