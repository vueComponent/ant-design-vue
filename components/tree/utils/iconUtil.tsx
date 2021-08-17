import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import MinusSquareOutlined from '@ant-design/icons-vue/MinusSquareOutlined';
import PlusSquareOutlined from '@ant-design/icons-vue/PlusSquareOutlined';
import CaretDownFilled from '@ant-design/icons-vue/CaretDownFilled';
import { AntTreeNodeProps } from '../Tree';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';

import { cloneVNode } from 'vue';

export default function renderSwitcherIcon(
  prefixCls: string,
  switcherIcon: any,
  showLine: boolean | { showLeafIcon: boolean } | undefined,
  { isLeaf, expanded, loading }: AntTreeNodeProps,
) {
  if (loading) {
    return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />;
  }
  let showLeafIcon;
  if (showLine && typeof showLine === 'object') {
    showLeafIcon = showLine.showLeafIcon;
  }
  if (isLeaf) {
    if (showLine) {
      if (typeof showLine === 'object' && !showLeafIcon) {
        return <span class={`${prefixCls}-switcher-leaf-line`} />;
      }
      return <FileOutlined class={`${prefixCls}-switcher-line-icon`} />;
    }
    return null;
  }
  const switcherCls = `${prefixCls}-switcher-icon`;
  if (isValidElement(switcherIcon)) {
    return cloneVNode(switcherIcon, {
      class: switcherCls,
    });
  }

  if (switcherIcon) {
    return switcherIcon;
  }

  if (showLine) {
    return expanded ? (
      <MinusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
    ) : (
      <PlusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
    );
  }
  return <CaretDownFilled class={switcherCls} />;
}
