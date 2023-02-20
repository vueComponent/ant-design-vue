import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import MinusSquareOutlined from '@ant-design/icons-vue/MinusSquareOutlined';
import PlusSquareOutlined from '@ant-design/icons-vue/PlusSquareOutlined';
import CaretDownFilled from '@ant-design/icons-vue/CaretDownFilled';
import type { AntTreeNodeProps } from '../Tree';
import { isValidElement } from '../../_util/props-util';

import { cloneVNode } from 'vue';
export interface SwitcherIconProps extends AntTreeNodeProps {
  expanded: boolean;
  loading: boolean;
}
export default function renderSwitcherIcon(
  prefixCls: string,
  switcherIcon: any,
  props: SwitcherIconProps,
  leafIcon?: (props: SwitcherIconProps) => any,
  showLine?: boolean | { showLeafIcon: boolean } | undefined,
) {
  const { isLeaf, expanded, loading } = props;
  let icon = switcherIcon;
  if (loading) {
    return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />;
  }
  let showLeafIcon: boolean;
  if (showLine && typeof showLine === 'object') {
    showLeafIcon = showLine.showLeafIcon;
  }
  let defaultIcon = null;
  const switcherCls = `${prefixCls}-switcher-icon`;
  if (isLeaf) {
    if (!showLine) {
      return null;
    }
    if (showLeafIcon && leafIcon) {
      return leafIcon(props);
    }
    if (typeof showLine === 'object' && !showLeafIcon) {
      defaultIcon = <span class={`${prefixCls}-switcher-leaf-line`} />;
    } else {
      defaultIcon = <FileOutlined class={`${prefixCls}-switcher-line-icon`} />;
    }
    return defaultIcon;
  } else {
    defaultIcon = <CaretDownFilled class={switcherCls} />;
    if (showLine) {
      defaultIcon = expanded ? (
        <MinusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
      ) : (
        <PlusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
      );
    }
  }

  if (typeof switcherIcon === 'function') {
    icon = switcherIcon({ ...props, defaultIcon, switcherCls });
  } else if (isValidElement(icon)) {
    icon = cloneVNode(icon, {
      class: switcherCls,
    });
  }

  return icon || defaultIcon;
}
