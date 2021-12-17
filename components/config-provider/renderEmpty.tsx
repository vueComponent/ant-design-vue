import { inject } from 'vue';
import Empty from '../empty';
import { defaultConfigProvider } from '.';
import type { VueNode } from '../_util/type';

export interface RenderEmptyProps {
  componentName?: string;
}

const RenderEmpty = (props: RenderEmptyProps) => {
  const configProvider = inject('configProvider', defaultConfigProvider);
  const renderHtml = (componentName?: string) => {
    const { getPrefixCls } = configProvider;
    const prefix = getPrefixCls('empty');
    switch (componentName) {
      case 'Table':
      case 'List':
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

      case 'Select':
      case 'TreeSelect':
      case 'Cascader':
      case 'Transfer':
      case 'Mentions':
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} class={`${prefix}-small`} />;

      default:
        return <Empty />;
    }
  };
  return renderHtml(props.componentName);
};

function renderEmpty(componentName?: string): VueNode {
  return <RenderEmpty componentName={componentName} />;
}

export type RenderEmptyHandler = typeof renderEmpty;

export default renderEmpty;
